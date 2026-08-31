import os
import hashlib
from datetime import datetime

import numpy as np

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

from utils.map_payload import (
    edges_dataframe,
    load_city_meta,
    nearest_edges,
    network_payload,
    parse_linestring,
    resolve_edge_file,
    traffic_map_payload,
)
from utils.places import location_speeds, load_osm_places, nearest_place_name, search_places


# ======================================================
# APP SETUP
# ======================================================

app = Flask(__name__)

@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

EDGE_FILE = resolve_edge_file(BASE_DIR)
CITY_CENTER = [8.5241, 76.9366]
CITY_ZOOM = 13
CITY_META = load_city_meta(BASE_DIR, CITY_CENTER)
PREVIEW_ROADS = 120

# Warm OSM place catalog (Overpass cache under data/tvm_osm_places.json)
try:
    _osm_n = len(load_osm_places(os.path.join(BASE_DIR, "data")))
    print(f"OSM places loaded: {_osm_n}")
except Exception as _osm_err:
    print("OSM places warmup skipped:", _osm_err)

UPLOAD_DIR = os.path.join(BASE_DIR, "static", "uploads")
YOLO_WEIGHTS = os.path.join(BASE_DIR, "models", "yolov8n.pt")
VEHICLE_CLASS_IDS = {1, 2, 3, 5, 7}  # bicycle, car, motorcycle, bus, truck


def _yolo_enabled():
    env = os.environ.get("ENABLE_YOLO")
    if env is not None:
        return env.lower() not in ("0", "false", "off")
    return not os.environ.get("RENDER")


yolo_model = None
yolo_load_error = None

if _yolo_enabled():
    try:
        from ultralytics import YOLO

        if os.path.isfile(YOLO_WEIGHTS):
            yolo_model = YOLO(YOLO_WEIGHTS)
        else:
            yolo_model = YOLO("yolov8n.pt")
        print("YOLO model loaded.")
    except Exception as e:
        yolo_load_error = str(e)
        print("YOLO load error:", e)
else:
    yolo_load_error = "Live vehicle detection is disabled on this deployment."


# ======================================================
# GLOBAL VARIABLES
# ======================================================

last_hybrid_prediction = None
last_hybrid_meta = None


# ======================================================
# API SERVICE (UI lives in Next.js on port 3000)
# ======================================================

@app.route("/")
def home():
    return jsonify({
        "service": "TrafficAI Flask API",
        "frontend": "http://localhost:3000",
        "endpoints": [
            "GET  /api/places",
            "GET  /api/nearest",
            "GET  /api/network",
            "GET  /api/influence",
            "POST /api/hybrid_predict",
            "POST /api/ppo_route",
            "POST /api/route_map_full",
            "POST /api/yolo_detect",
        ],
    })


@app.route("/api/health", methods=["GET"])
def api_health():
    return jsonify({
        "ok": True,
        "city": CITY_META.get("name", "Thiruvananthapuram"),
        "edges": int(CITY_META.get("edges") or get_number_of_roads()),
        "yolo": yolo_model is not None,
        "edge_file": os.path.basename(EDGE_FILE),
    })


def resolve_edge_from_body(data, prefix):
    """Accept either an edge index or lat/lon for start/end."""
    lat_key = f"{prefix}_lat"
    lon_key = f"{prefix}_lon"
    if data.get(lat_key) is not None and data.get(lon_key) is not None:
        hits = nearest_edges(
            EDGE_FILE,
            float(data[lat_key]),
            float(data[lon_key]),
            k=1,
        )
        if hits:
            return int(hits[0]["index"])
    if prefix in data and data[prefix] is not None and data[prefix] != "":
        return int(data[prefix])
    return None


@app.route("/api/places", methods=["GET"])
def api_places():
    try:
        q = request.args.get("q", "")
        lat = request.args.get("lat", type=float)
        lon = request.args.get("lon", type=float)
        refresh = request.args.get("refresh", "").lower() in ("1", "true", "yes")
        if refresh:
            from utils.places import load_osm_places

            load_osm_places(os.path.join(BASE_DIR, "data"), refresh=True)
        payload = search_places(
            EDGE_FILE,
            query=q,
            lat=lat,
            lon=lon,
            limit=int(request.args.get("limit", 25)),
        )
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/places/catalog", methods=["GET"])
def api_places_catalog():
    """Return OSM place catalog size (Overpass-cached)."""
    try:
        from utils.places import load_osm_places

        refresh = request.args.get("refresh", "").lower() in ("1", "true", "yes")
        places = load_osm_places(os.path.join(BASE_DIR, "data"), refresh=refresh)
        return jsonify(
            {
                "count": len(places),
                "source": "openstreetmap",
                "file": "data/tvm_osm_places.json",
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/nearest", methods=["GET"])
def api_nearest():
    try:
        lat = request.args.get("lat", type=float)
        lon = request.args.get("lon", type=float)
        if lat is None or lon is None:
            return jsonify({"error": "lat and lon are required."}), 400
        payload = search_places(EDGE_FILE, query="", lat=lat, lon=lon, limit=8)
        return jsonify(payload)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ======================================================
# TIMESTAMP HELPER
# ======================================================

def make_timestamp(date_str, time_str):

    if not date_str:
        date_str = datetime.now().strftime("%Y-%m-%d")

    if not time_str:
        time_str = "10:00"

    parts = str(time_str).split(":")

    if len(parts) >= 2:
        time_short = (
            f"{parts[0].zfill(2)}:"
            f"{parts[1].zfill(2)}"
        )
    else:
        time_short = "10:00"

    return f"{date_str}T{time_short}"


# ======================================================
# GET NUMBER OF ROADS
# ======================================================

def get_number_of_roads():

    try:
        df = edges_dataframe(EDGE_FILE)

        if len(df) > 0:
            return len(df)

    except Exception as e:
        print("Could not read edge file:", e)

    # Fallback if CSV cannot be read
    return 50


# ======================================================
# LIGHTWEIGHT TRAFFIC PREDICTION
#
# This replaces live GAT-LSTM inference on the
# low-memory Render deployment.
#
# Results are deterministic for the same:
# date + time + scenario
# ======================================================

def generate_demo_predictions(
    date,
    time,
    scenario
):

    timestamp = make_timestamp(
        date,
        time
    )

    number_of_roads = get_number_of_roads()

    # Create deterministic seed
    seed_text = (
        f"{timestamp}-{scenario}"
    )

    seed_hash = hashlib.sha256(
        seed_text.encode()
    ).hexdigest()

    seed = int(
        seed_hash[:8],
        16
    )

    rng = np.random.default_rng(seed)


    # ----------------------------------------------
    # Base traffic speed
    # ----------------------------------------------

    base_speed = 27.0


    # ----------------------------------------------
    # Time influence
    # ----------------------------------------------

    try:
        hour = int(
            str(time).split(":")[0]
        )

    except Exception:
        hour = 10


    # Morning rush hour
    if 7 <= hour <= 10:
        base_speed -= 7

    # Evening rush hour
    elif 16 <= hour <= 20:
        base_speed -= 9

    # Late night
    elif hour >= 22 or hour <= 5:
        base_speed += 8


    # ----------------------------------------------
    # Scenario influence
    # ----------------------------------------------

    scenario_lower = str(
        scenario
    ).lower()


    if scenario_lower == "accident":

        base_speed -= 10


    elif scenario_lower in [
        "rain",
        "rainy"
    ]:

        base_speed -= 6


    elif scenario_lower in [
        "heavy",
        "heavy traffic",
        "congestion"
    ]:

        base_speed -= 9


    elif scenario_lower in [
        "clear",
        "light"
    ]:

        base_speed += 4


    # ----------------------------------------------
    # Generate road-level variation
    # ----------------------------------------------

    road_variation = rng.normal(
        loc=0,
        scale=5,
        size=number_of_roads
    )


    predictions = (
        base_speed
        +
        road_variation
    )


    # Keep realistic speed range
    predictions = np.clip(
        predictions,
        5,
        55
    )


    return predictions


# ======================================================
# HYBRID PREDICTION API
#
# API name remains unchanged so your frontend
# does not need modification.
# ======================================================

@app.route(
    "/api/hybrid_predict",
    methods=["POST"]
)
def hybrid_predict():

    global last_hybrid_prediction
    global last_hybrid_meta

    try:

        data = request.get_json(
            silent=True
        ) or {}

        date = data.get(
            "date"
        )

        time = data.get(
            "time",
            "10:00"
        )

        scenario = data.get(
            "scenario",
            "normal"
        )


        timestamp = make_timestamp(
            date,
            time
        )


        predictions = (
            generate_demo_predictions(
                date,
                time,
                scenario
            )
        )


        last_hybrid_prediction = (
            predictions.copy()
        )


        last_hybrid_meta = {

            "date":
            date,

            "time":
            time,

            "scenario":
            scenario,

            "timestamp":
            timestamp

        }


        locations = location_speeds(EDGE_FILE, predictions)

        return jsonify({
            "locations": locations,
            "unit": "km/h",
            "date": date,
            "time": time,
            "scenario": scenario,
            "timestamp": timestamp,
            "road_count": int(len(predictions)),
            "deployment_mode": "flask-backend",
        })


    except Exception as e:

        print(
            "Prediction error:",
            e
        )

        return jsonify({

            "error":
            str(e)

        }), 500


# ======================================================
# ROUTE RECOMMENDATION
#
# Keeps existing /api/ppo_route endpoint for
# frontend compatibility.
# ======================================================

@app.route(
    "/api/ppo_route",
    methods=["POST"]
)
def ppo_route():

    global last_hybrid_prediction
    global last_hybrid_meta

    try:

        data = request.get_json(
            silent=True
        ) or {}


        if (
            "start" not in data
            and data.get("start_lat") is None
        ) or (
            "end" not in data
            and data.get("end_lat") is None
        ):

            return jsonify({

                "error":
                "Please choose a start place and an end place."

            }), 400


        start = resolve_edge_from_body(data, "start")
        end = resolve_edge_from_body(data, "end")

        start_name = str(data.get("start_name") or "").strip()
        end_name = str(data.get("end_name") or "").strip()
        if not start_name or start_name.upper().startswith("R") and start_name[1:].isdigit():
            if data.get("start_lat") is not None:
                start_name = nearest_place_name(
                    float(data["start_lat"]), float(data["start_lon"])
                ) or start_name
        if not end_name or end_name.upper().startswith("R") and end_name[1:].isdigit():
            if data.get("end_lat") is not None:
                end_name = nearest_place_name(
                    float(data["end_lat"]), float(data["end_lon"])
                ) or end_name
        if not start_name:
            start_name = "start place"
        if not end_name:
            end_name = "end place"

        if start is None or end is None:
            return jsonify({
                "error":
                "Please choose a start place and an end place."
            }), 400


        date = data.get(
            "date"
        )

        time = data.get(
            "time",
            "10:00"
        )

        scenario = data.get(
            "scenario",
            "normal"
        )


        timestamp = make_timestamp(
            date,
            time
        )


        use_predictions = None


        # Reuse previous prediction
        if (
            last_hybrid_prediction
            is not None
            and
            last_hybrid_meta
            is not None
        ):

            if (
                last_hybrid_meta.get(
                    "timestamp"
                )
                ==
                timestamp
                and
                last_hybrid_meta.get(
                    "scenario"
                )
                ==
                scenario
            ):

                use_predictions = (
                    last_hybrid_prediction.copy()
                )


        # Generate if prediction not already available
        if use_predictions is None:

            use_predictions = (
                generate_demo_predictions(
                    date,
                    time,
                    scenario
                )
            )


            last_hybrid_prediction = (
                use_predictions.copy()
            )


            last_hybrid_meta = {

                "date":
                date,

                "time":
                time,

                "scenario":
                scenario,

                "timestamp":
                timestamp

            }


        number_of_roads = len(
            use_predictions
        )


        if (
            start < 0
            or
            end < 0
            or
            start >= number_of_roads
            or
            end >= number_of_roads
        ):

            return jsonify({

                "error":
                (
                    "start/end must be "
                    f"in range 0.."
                    f"{number_of_roads - 1}"
                )

            }), 400


        low = min(
            start,
            end
        )

        high = max(
            start,
            end
        )


        subset = use_predictions[
            low:
            high + 1
        ]


        best_local_index = int(
            np.argmax(
                subset
            )
        )


        best_global_index = (
            low
            +
            best_local_index
        )


        best_speed = float(

            use_predictions[
                best_global_index
            ]

        )


        # Try to get real edge ID
        real_edge_id = None

        try:

            df = edges_dataframe(EDGE_FILE)

            if (
                best_global_index
                <
                len(df)
            ):

                real_edge_id = str(

                    df.iloc[
                        best_global_index
                    ]["edge_id"]

                )

        except Exception:
            pass


        return jsonify({

            "start":
            start,

            "end":
            end,

            "start_name":
            start_name,

            "end_name":
            end_name,

            "date":
            date,

            "time":
            time,

            "scenario":
            scenario,

            "recommended_route_index":
            best_global_index,

            "recommended_edge_id":
            real_edge_id,

            "predicted_speed":
            best_speed,

            "note":
            (
                f"Best road between "
                f"{start_name} and {end_name} "
                "based on predicted speed."
            )

        })


    except Exception as e:

        print(
            "Route recommendation error:",
            e
        )

        return jsonify({

            "error":
            str(e)

        }), 500


# ======================================================
# ROAD NETWORK + FULL TRAFFIC MAP (JSON for Leaflet)
# ======================================================

@app.route("/api/network", methods=["GET"])
def api_network():
    try:
        return jsonify(
            network_payload(
                EDGE_FILE,
                CITY_META,
                CITY_CENTER,
                CITY_ZOOM,
            )
        )
    except Exception as e:
        print("Network payload error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/route_map_full", methods=["POST"])
def route_map_full():
    global last_hybrid_prediction
    global last_hybrid_meta

    try:
        data = request.get_json(silent=True) or {}

        date = data.get("date")
        time = data.get("time", "10:00")
        scenario = data.get("scenario", "normal")
        route_mode = str(data.get("route_mode") or "fastest").lower()
        timestamp = make_timestamp(date, time)

        use_predictions = None
        if (
            last_hybrid_prediction is not None
            and last_hybrid_meta is not None
            and last_hybrid_meta.get("timestamp") == timestamp
            and last_hybrid_meta.get("scenario") == scenario
        ):
            use_predictions = last_hybrid_prediction.copy()

        if use_predictions is None:
            use_predictions = generate_demo_predictions(date, time, scenario)
            last_hybrid_prediction = use_predictions.copy()
            last_hybrid_meta = {
                "date": date,
                "time": time,
                "scenario": scenario,
                "timestamp": timestamp,
            }

        route = None
        start_lat = data.get("start_lat")
        start_lon = data.get("start_lon")
        end_lat = data.get("end_lat")
        end_lon = data.get("end_lon")

        if start_lat is not None and start_lon is not None and end_lat is not None and end_lon is not None:
            start_name = str(data.get("start_name") or "").strip()
            end_name = str(data.get("end_name") or "").strip()
            if not start_name:
                start_name = nearest_place_name(float(start_lat), float(start_lon)) or "Start"
            if not end_name:
                end_name = nearest_place_name(float(end_lat), float(end_lon)) or "End"
            route = {
                "start_lat": float(start_lat),
                "start_lon": float(start_lon),
                "end_lat": float(end_lat),
                "end_lon": float(end_lon),
                "start_name": start_name,
                "end_name": end_name,
                "scenario": scenario,
                "route_mode": route_mode,
            }

        return jsonify(
            traffic_map_payload(
                EDGE_FILE,
                use_predictions,
                CITY_META,
                CITY_CENTER,
                CITY_ZOOM,
                route=route,
            )
        )
    except Exception as e:
        print("Map generation error:", e)
        return jsonify({"error": str(e)}), 500


# ======================================================
# YOLO ENDPOINT
# ======================================================

@app.route(
    "/api/yolo_detect",
    methods=["POST"]
)
def yolo_detect():

    if yolo_model is None:
        return jsonify({
            "error": (
                yolo_load_error
                or "Live vehicle detection is not available."
            ),
            "deployment_mode": "lightweight-demo"
        }), 503

    if "image" not in request.files:
        return jsonify({"error": "Please choose an image first."}), 400

    file = request.files["image"]
    if not file or not file.filename:
        return jsonify({"error": "Please choose an image first."}), 400

    try:
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        filename = secure_filename(file.filename) or "upload.jpg"
        stem, ext = os.path.splitext(filename)
        if not ext:
            ext = ".jpg"

        unique = hashlib.md5(
            (filename + str(datetime.now().timestamp())).encode("utf-8")
        ).hexdigest()[:10]

        save_name = f"{stem}_{unique}{ext}"
        save_path = os.path.join(UPLOAD_DIR, save_name)
        file.save(save_path)

        results = yolo_model(save_path)[0]
        boxes = results.boxes

        if boxes is None or len(boxes) == 0:
            vehicle_count = 0
        else:
            class_ids = boxes.cls.cpu().numpy().astype(int)
            vehicle_count = int(sum(c in VEHICLE_CLASS_IDS for c in class_ids))

        annotated_name = f"{stem}_{unique}_detected.jpg"
        annotated_path = os.path.join(UPLOAD_DIR, annotated_name)
        annotated = results.plot()

        try:
            import cv2
            cv2.imwrite(annotated_path, annotated)
        except Exception:
            from PIL import Image
            Image.fromarray(annotated[:, :, ::-1]).save(annotated_path)

        return jsonify({
            "vehicle_count": vehicle_count,
            "filename": save_name,
            "annotated_image_url": f"/static/uploads/{annotated_name}"
        })

    except Exception as e:
        print("YOLO detection error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/api/influence", methods=["GET"])
def influence():
    global last_hybrid_prediction

    try:
        speeds = last_hybrid_prediction
        if speeds is None:
            speeds = generate_demo_predictions(None, "10:00", "normal")
            last_hybrid_prediction = speeds.copy()

        lat = request.args.get("lat", type=float)
        lon = request.args.get("lon", type=float)
        edge = request.args.get("edge", type=int)
        place_name = str(request.args.get("place") or "").strip()

        nearby_meta = []
        if lat is not None and lon is not None:
            nearby_meta = nearest_edges(EDGE_FILE, lat, lon, k=30)
            indices = [item["index"] for item in nearby_meta]
            if not place_name:
                place_name = nearest_place_name(lat, lon) or "Selected location"
        elif edge is not None:
            df = edges_dataframe(EDGE_FILE)
            row = df.iloc[min(edge, len(df) - 1)]
            geom = str(row.get("geometry", ""))
            coords = parse_linestring(geom)
            if coords:
                mid = coords[len(coords) // 2]
                nearby_meta = nearest_edges(EDGE_FILE, mid[0], mid[1], k=30)
                indices = [item["index"] for item in nearby_meta]
                lat, lon = mid[0], mid[1]
                if not place_name:
                    place_name = nearest_place_name(lat, lon) or f"Road R{edge}"
            else:
                indices = list(range(min(30, len(speeds))))
                nearby_meta = [{"index": i, "distance_km": 0} for i in indices]
        else:
            # Default: around city center (Palayam / Statue belt)
            lat, lon = CITY_CENTER[0], CITY_CENTER[1]
            nearby_meta = nearest_edges(EDGE_FILE, lat, lon, k=30)
            indices = [item["index"] for item in nearby_meta]
            place_name = place_name or "Thiruvananthapuram center"

        df = edges_dataframe(EDGE_FILE)
        roads = []
        road_details = []
        for item in nearby_meta if nearby_meta else [{"index": i, "distance_km": None} for i in indices]:
            idx = int(item["index"])
            highway = ""
            label_place = ""
            mid_lat = mid_lon = None
            if 0 <= idx < len(df):
                row = df.iloc[idx]
                highway = str(row.get("highway") or "").split(";")[0] or "road"
                coords = parse_linestring(row.get("geometry"))
                if coords:
                    mid_pt = coords[len(coords) // 2]
                    mid_lat, mid_lon = mid_pt[0], mid_pt[1]
                    label_place = nearest_place_name(mid_lat, mid_lon) or ""
            place_bit = (label_place or "Road")[:14]
            hwy_bit = (highway or "road")[:8]
            # Always unique: React keys and matrix headers need distinct labels
            label = f"{place_bit} · {hwy_bit} · R{idx}"
            roads.append(label)
            road_details.append(
                {
                    "index": idx,
                    "label": label,
                    "place": label_place or None,
                    "highway": highway or None,
                    "lat": mid_lat,
                    "lon": mid_lon,
                    "distance_km": item.get("distance_km"),
                    "speed": float(speeds[idx]) if idx < len(speeds) else None,
                }
            )

        n = len(indices)
        matrix = []
        for a in range(n):
            row = []
            total = 0.0
            ia = indices[a]
            for b in range(n):
                ib = indices[b]
                dist = abs(float(speeds[ia]) - float(speeds[ib])) if ia < len(speeds) and ib < len(speeds) else 10.0
                adj = 1.35 if abs(a - b) <= 2 else 0.55
                self_w = 0.25 if a == b else 1.0
                v = float(np.exp(-dist / 8.0) * adj * self_w)
                row.append(v)
                total += v
            matrix.append([v / total if total else 0.0 for v in row])

        return jsonify({
            "city": CITY_META.get("name", "Thiruvananthapuram"),
            "place": place_name,
            "roads": roads,
            "road_details": road_details,
            "indices": indices,
            "matrix": matrix,
            "origin": {"lat": lat, "lon": lon, "edge": edge, "place": place_name},
            "legend": {
                "what": (
                    f"Heat map for roads near {place_name} in Thiruvananthapuram. "
                    "Each colored box is a pair of roads. "
                    "Darker orange = stronger connection. Lighter = weaker connection. "
                    "Darker does not mean more traffic jam."
                ),
                "darker": "Stronger connection between those two roads",
                "lighter": "Weaker connection",
            },
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ======================================================
# SIMPLE ROUTE MAP (same JSON as the full Leaflet map)
# ======================================================

@app.route("/api/route_map", methods=["POST"])
def route_map():
    return route_map_full()


# ======================================================
# RUN
# ======================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )


    app.run(

        host="0.0.0.0",

        port=port,

        debug=False

    )
