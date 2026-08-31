"""Named Thiruvananthapuram places, snapped to the OSM drive graph."""

from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request

from utils.map_payload import nearest_edges

LANDMARKS = [
    {"id": "east-fort", "name": "East Fort", "area": "Fort", "lat": 8.4828, "lon": 76.9478},
    {"id": "west-fort", "name": "West Fort", "area": "Fort", "lat": 8.484, "lon": 76.941},
    {"id": "chalai", "name": "Chalai Market", "area": "Fort", "lat": 8.4815, "lon": 76.9485},
    {"id": "attukal", "name": "Attukal", "area": "Fort", "lat": 8.47, "lon": 76.948},
    {"id": "manacaud", "name": "Manacaud", "area": "South", "lat": 8.475, "lon": 76.945},
    {"id": "killipalam", "name": "Killipalam", "area": "South", "lat": 8.4785, "lon": 76.955},
    {"id": "karamana", "name": "Karamana", "area": "South", "lat": 8.4825, "lon": 76.962},
    {"id": "thirumala", "name": "Thirumala", "area": "South", "lat": 8.49, "lon": 76.975},
    {"id": "pappanamcode", "name": "Pappanamcode", "area": "South", "lat": 8.474, "lon": 76.98},
    {"id": "nemom", "name": "Nemom", "area": "South", "lat": 8.455, "lon": 76.985},
    {"id": "balaramapuram", "name": "Balaramapuram", "area": "South", "lat": 8.43, "lon": 77.04},
    {"id": "neyyattinkara", "name": "Neyyattinkara", "area": "South", "lat": 8.4, "lon": 77.087},
    {"id": "punnakkamugal", "name": "Punnakkamugal", "area": "South", "lat": 8.465, "lon": 76.97},
    {"id": "vallakkadavu", "name": "Vallakkadavu", "area": "West", "lat": 8.478, "lon": 76.935},
    {"id": "beemapally", "name": "Beemapally", "area": "Coast", "lat": 8.465, "lon": 76.93},
    {"id": "poonthura", "name": "Poonthura", "area": "Coast", "lat": 8.455, "lon": 76.925},
    {"id": "thampanoor", "name": "Thampanoor", "area": "Central", "lat": 8.4872, "lon": 76.949},
    {"id": "railway", "name": "Central Railway Station", "area": "Thampanoor", "lat": 8.4874, "lon": 76.9492},
    {"id": "ksrtc", "name": "KSRTC Bus Station", "area": "Thampanoor", "lat": 8.488, "lon": 76.9485},
    {"id": "overbridge", "name": "Overbridge", "area": "Central", "lat": 8.4915, "lon": 76.9492},
    {"id": "general-hospital", "name": "General Hospital", "area": "Central", "lat": 8.498, "lon": 76.942},
    {"id": "sreekanteswaram", "name": "Sreekanteswaram", "area": "Central", "lat": 8.49, "lon": 76.942},
    {"id": "pazhavangadi", "name": "Pazhavangadi", "area": "Fort", "lat": 8.4855, "lon": 76.9455},
    {"id": "kaithamukku", "name": "Kaithamukku", "area": "Central", "lat": 8.4925, "lon": 76.9425},
    {"id": "trivandrum-club", "name": "Trivandrum Club", "area": "Central", "lat": 8.5, "lon": 76.948},
    {"id": "statue", "name": "Statue Junction", "area": "Palayam", "lat": 8.5022, "lon": 76.9515},
    {"id": "palayam", "name": "Palayam", "area": "Central", "lat": 8.5055, "lon": 76.9518},
    {"id": "secretariat", "name": "Secretariat", "area": "Palayam", "lat": 8.5074, "lon": 76.955},
    {"id": "mg-road", "name": "MG Road", "area": "Palayam", "lat": 8.508, "lon": 76.951},
    {"id": "bakery", "name": "Bakery Junction", "area": "Palayam", "lat": 8.5085, "lon": 76.9485},
    {"id": "pmg", "name": "PMG Junction", "area": "Palayam", "lat": 8.512, "lon": 76.948},
    {"id": "museum", "name": "Napier Museum", "area": "Museum", "lat": 8.509, "lon": 76.9565},
    {"id": "zoo", "name": "Zoo", "area": "Museum", "lat": 8.5105, "lon": 76.9555},
    {"id": "kanakakunnu", "name": "Kanakakunnu Palace", "area": "Museum", "lat": 8.5085, "lon": 76.96},
    {"id": "lms", "name": "LMS Junction", "area": "Palayam", "lat": 8.505, "lon": 76.9555},
    {"id": "agh", "name": "AG's Office", "area": "Palayam", "lat": 8.5045, "lon": 76.9495},
    {"id": "university-college", "name": "University College", "area": "Palayam", "lat": 8.5065, "lon": 76.954},
    {"id": "press-club", "name": "Press Club", "area": "Palayam", "lat": 8.5035, "lon": 76.9525},
    {"id": "vellayambalam", "name": "Vellayambalam", "area": "East", "lat": 8.5088, "lon": 76.9655},
    {"id": "kowdiar", "name": "Kowdiar", "area": "East", "lat": 8.5244, "lon": 76.961},
    {"id": "kowdiar-palace", "name": "Kowdiar Palace", "area": "East", "lat": 8.526, "lon": 76.9585},
    {"id": "sasthamangalam", "name": "Sasthamangalam", "area": "East", "lat": 8.517, "lon": 76.968},
    {"id": "vazhuthacaud", "name": "Vazhuthacaud", "area": "East", "lat": 8.512, "lon": 76.96},
    {"id": "nanthencode", "name": "Nanthencode", "area": "East", "lat": 8.528, "lon": 76.955},
    {"id": "nandancode", "name": "Nandancode", "area": "North", "lat": 8.53, "lon": 76.945},
    {"id": "kuravankonam", "name": "Kuravankonam", "area": "East", "lat": 8.52, "lon": 76.955},
    {"id": "amritha", "name": "Amrita Hospital", "area": "East", "lat": 8.545, "lon": 76.88},
    {"id": "jagathy", "name": "Jagathy", "area": "East", "lat": 8.515, "lon": 76.975},
    {"id": "pipinmoodu", "name": "Pipinmoodu", "area": "East", "lat": 8.525, "lon": 76.97},
    {"id": "peroorkada", "name": "Peroorkada", "area": "East", "lat": 8.545, "lon": 76.966},
    {"id": "vazhayila", "name": "Vazhayila", "area": "East", "lat": 8.55, "lon": 76.975},
    {"id": "mannanthala", "name": "Mannanthala", "area": "East", "lat": 8.555, "lon": 76.955},
    {"id": "vattiyoorkavu", "name": "Vattiyoorkavu", "area": "East", "lat": 8.54, "lon": 76.985},
    {"id": "kudappanakunnu", "name": "Kudappanakunnu", "area": "East", "lat": 8.535, "lon": 76.975},
    {"id": "ptp-nagar", "name": "PTP Nagar", "area": "East", "lat": 8.505, "lon": 76.975},
    {"id": "thycaud", "name": "Thycaud", "area": "Central", "lat": 8.495, "lon": 76.955},
    {"id": "vazhuthacaud-j", "name": "Cotton Hill", "area": "East", "lat": 8.51, "lon": 76.958},
    {"id": "pattom", "name": "Pattom", "area": "North", "lat": 8.5218, "lon": 76.9395},
    {"id": "dpi", "name": "DPI Junction", "area": "Pattom", "lat": 8.515, "lon": 76.942},
    {"id": "kesavadasapuram", "name": "Kesavadasapuram", "area": "North", "lat": 8.5355, "lon": 76.936},
    {"id": "medical-college", "name": "Medical College", "area": "Ulloor", "lat": 8.5238, "lon": 76.928},
    {"id": "ulloor", "name": "Ulloor", "area": "North", "lat": 8.541, "lon": 76.9285},
    {"id": "plamoodu", "name": "Plamoodu", "area": "North", "lat": 8.518, "lon": 76.945},
    {"id": "murinjapalam", "name": "Murinjapalam", "area": "North", "lat": 8.528, "lon": 76.932},
    {"id": "chempazhanthy", "name": "Chempazhanthy", "area": "North", "lat": 8.555, "lon": 76.925},
    {"id": "sreekaryam", "name": "Sreekaryam", "area": "North", "lat": 8.5485, "lon": 76.9165},
    {"id": "chekkalamukku", "name": "Chekkalamukku", "area": "North", "lat": 8.545, "lon": 76.91},
    {"id": "powdikonam", "name": "Powdikonam", "area": "North", "lat": 8.56, "lon": 76.925},
    {"id": "pothencode", "name": "Pothencode", "area": "North", "lat": 8.605, "lon": 76.9},
    {"id": "attipra", "name": "Attipra", "area": "North", "lat": 8.57, "lon": 76.895},
    {"id": "anayara", "name": "Anayara", "area": "West", "lat": 8.508, "lon": 76.92},
    {"id": "kannammoola", "name": "Kannammoola", "area": "West", "lat": 8.505, "lon": 76.925},
    {"id": "pattoor", "name": "Pattoor", "area": "North", "lat": 8.51, "lon": 76.935},
    {"id": "vanchiyoor", "name": "Vanchiyoor", "area": "Central", "lat": 8.495, "lon": 76.945},
    {"id": "chalakuzhy", "name": "Chalakuzhy", "area": "North", "lat": 8.525, "lon": 76.935},
    {"id": "gnv", "name": "Gowreesapattom", "area": "North", "lat": 8.532, "lon": 76.942},
    {"id": "pettah", "name": "Pettah", "area": "West", "lat": 8.495, "lon": 76.9365},
    {"id": "chackai", "name": "Chackai", "area": "West", "lat": 8.492, "lon": 76.918},
    {"id": "airport", "name": "Thiruvananthapuram Airport", "area": "Chackai", "lat": 8.4821, "lon": 76.92},
    {"id": "shanghumugham", "name": "Shanghumugham Beach", "area": "Coast", "lat": 8.481, "lon": 76.912},
    {"id": "vellayani", "name": "Vellayani", "area": "South", "lat": 8.44, "lon": 76.99},
    {"id": "kovalam", "name": "Kovalam Beach", "area": "Coast", "lat": 8.4004, "lon": 76.9787},
    {"id": "vizhinjam", "name": "Vizhinjam Port", "area": "Coast", "lat": 8.3765, "lon": 76.991},
    {"id": "poovar", "name": "Poovar", "area": "Coast", "lat": 8.318, "lon": 77.072},
    {"id": "thumba", "name": "Thumba / VSSC", "area": "Coast", "lat": 8.535, "lon": 76.86},
    {"id": "veli", "name": "Veli Tourist Village", "area": "Coast", "lat": 8.51, "lon": 76.89},
    {"id": "akkulam", "name": "Akkulam", "area": "West", "lat": 8.515, "lon": 76.9},
    {"id": "kumarichantha", "name": "Kumarichantha", "area": "West", "lat": 8.5, "lon": 76.925},
    {"id": "sreevaraham", "name": "Sreevaraham", "area": "West", "lat": 8.48, "lon": 76.935},
    {"id": "petta-junction", "name": "Enchakkal", "area": "West", "lat": 8.485, "lon": 76.925},
    {"id": "kazhakoottam", "name": "Kazhakkoottam", "area": "IT corridor", "lat": 8.5688, "lon": 76.8715},
    {"id": "technopark", "name": "Technopark Phase 1", "area": "Kazhakkoottam", "lat": 8.5583, "lon": 76.8756},
    {"id": "technopark-3", "name": "Technopark Phase 3", "area": "Kulathoor", "lat": 8.547, "lon": 76.881},
    {"id": "karyavattom", "name": "Karyavattom Campus", "area": "University", "lat": 8.564, "lon": 76.8865},
    {"id": "kulathoor", "name": "Kulathoor", "area": "IT corridor", "lat": 8.555, "lon": 76.88},
    {"id": "infosys", "name": "Infosys Campus", "area": "Technopark", "lat": 8.5455, "lon": 76.878},
    {"id": "technocity", "name": "Technocity", "area": "Pallipuram", "lat": 8.59, "lon": 76.855},
    {"id": "pallipuram", "name": "Pallipuram", "area": "IT corridor", "lat": 8.585, "lon": 76.86},
    {"id": "menamkulam", "name": "Menamkulam", "area": "IT corridor", "lat": 8.575, "lon": 76.865},
    {"id": "kariavattom-jn", "name": "Kariavattom Junction", "area": "University", "lat": 8.562, "lon": 76.89},
    {"id": "engineering-college", "name": "College of Engineering", "area": "Kulathoor", "lat": 8.545, "lon": 76.905},
    {"id": "sreekaryam-jn", "name": "Sreekaryam Junction", "area": "North", "lat": 8.55, "lon": 76.91},
    {"id": "kadakampally", "name": "Kadakampally", "area": "West", "lat": 8.505, "lon": 76.905},
    {"id": "petta-bypass", "name": "Chackai Bypass", "area": "West", "lat": 8.495, "lon": 76.91},
    {"id": "sreekaryam-medical", "name": "RCC / SCTIMST", "area": "Medical College", "lat": 8.52, "lon": 76.925},
    {"id": "satelmond", "name": "Satelmond Palace", "area": "East", "lat": 8.52, "lon": 76.96},
    {"id": "golf-links", "name": "Golf Links", "area": "Kowdiar", "lat": 8.522, "lon": 76.965},
    {"id": "vivekananda-nagar", "name": "Vivekananda Nagar", "area": "East", "lat": 8.53, "lon": 76.968},
    {"id": "pangode", "name": "Pangode Military", "area": "East", "lat": 8.505, "lon": 76.985},
    {"id": "thiruvallam", "name": "Thiruvallam", "area": "South", "lat": 8.44, "lon": 76.96},
    {"id": "kalliyoor", "name": "Kalliyoor", "area": "South", "lat": 8.42, "lon": 76.995},
    {"id": "malayinkeezhu", "name": "Malayinkeezhu", "area": "South", "lat": 8.49, "lon": 77.02},
    {"id": "vilappilsala", "name": "Vilappilsala", "area": "East", "lat": 8.52, "lon": 77.01},
    {"id": "nedumangad", "name": "Nedumangad", "area": "East", "lat": 8.603, "lon": 77.002},
    {"id": "arvikkara", "name": "Aruvikkara", "area": "East", "lat": 8.565, "lon": 77.02},
    {"id": "venjaramoodu", "name": "Venjaramoodu", "area": "North", "lat": 8.665, "lon": 76.91},
    {"id": "attingal", "name": "Attingal", "area": "North", "lat": 8.698, "lon": 76.815},
    {"id": "varkala", "name": "Varkala", "area": "Coast", "lat": 8.7379, "lon": 76.7165},
    {"id": "kazhakuttam-railway", "name": "Kazhakkoottam Railway", "area": "IT corridor", "lat": 8.566, "lon": 76.868},
    {"id": "lulu-mall", "name": "Lulu Mall Trivandrum", "area": "Akkulam", "lat": 8.5125, "lon": 76.898},
    {"id": "gorky-bhavan", "name": "Gorky Bhavan", "area": "Vazhuthacaud", "lat": 8.511, "lon": 76.9585},
    {"id": "smv", "name": "SMV High School", "area": "Fort", "lat": 8.4845, "lon": 76.946},
    {"id": "connemara", "name": "Connemara Market", "area": "Palayam", "lat": 8.5048, "lon": 76.9505},
    {"id": "ayurveda-college", "name": "Ayurveda College", "area": "Poojappura", "lat": 8.49, "lon": 76.968},
    {"id": "poojappura", "name": "Poojappura", "area": "South", "lat": 8.488, "lon": 76.97},
    {"id": "kunnukuzhy", "name": "Kunnukuzhy", "area": "North", "lat": 8.515, "lon": 76.935},
    {"id": "edapazhanji", "name": "Edapazhanji", "area": "East", "lat": 8.505, "lon": 76.97},
    {"id": "kumarapuram", "name": "Kumarapuram", "area": "Medical College", "lat": 8.525, "lon": 76.925},
    {"id": "medical-college-jn", "name": "Medical College Junction", "area": "Ulloor", "lat": 8.522, "lon": 76.93},
    {"id": "kesavadasapuram-jn", "name": "Kesavadasapuram Junction", "area": "North", "lat": 8.536, "lon": 76.935},
    {"id": "sreekaryam-bypass", "name": "Sreekaryam Bypass", "area": "North", "lat": 8.552, "lon": 76.905},
]


def _snap(place: dict, edge_file: str) -> dict:
    hits = nearest_edges(edge_file, place["lat"], place["lon"], k=1)
    hit = hits[0] if hits else {}
    out = dict(place)
    out["edge_index"] = hit.get("index", 0)
    out["edge_id"] = hit.get("edge_id")
    out["snap_km"] = round(float(hit.get("distance_km") or 0), 3)
    return out


_USER_AGENT = "TrafficAI-StudentProject/1.0 (full-stack AI traffic app)"
_TVM_BBOX = (8.30, 76.70, 8.80, 77.15)  # south, west, north, east
_osm_cache = None
_osm_cache_path = None


def _haversine(lat1, lon1, lat2, lon2):
    from math import asin, cos, radians, sin, sqrt

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    return 6371.0 * 2 * asin(sqrt(min(1.0, a)))


def _nominatim(query: str, limit=12):
    """Live OpenStreetMap Nominatim search, bounded to Thiruvananthapuram."""
    south, west, north, east = _TVM_BBOX
    params = urllib.parse.urlencode(
        {
            "q": f"{query}, Thiruvananthapuram, Kerala, India",
            "format": "json",
            "addressdetails": 1,
            "limit": str(limit),
            "viewbox": f"{west},{north},{east},{south}",
            "bounded": 1,
            "countrycodes": "in",
        }
    )
    req = urllib.request.Request(
        "https://nominatim.openstreetmap.org/search?" + params,
        headers={"User-Agent": _USER_AGENT},
    )
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
    except Exception:
        return []

    found = []
    seen = set()
    for i, row in enumerate(rows):
        try:
            lat = float(row["lat"])
            lon = float(row["lon"])
        except (KeyError, TypeError, ValueError):
            continue
        if not (south <= lat <= north and west <= lon <= east):
            continue
        name = (row.get("display_name") or query).split(",")[0].strip()
        if not name:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        addr = row.get("address") or {}
        area = (
            addr.get("suburb")
            or addr.get("neighbourhood")
            or addr.get("village")
            or addr.get("town")
            or addr.get("city_district")
            or addr.get("county")
            or row.get("type")
            or "OSM"
        )
        found.append(
            {
                "id": f"osm-{row.get('place_id', i)}",
                "name": name,
                "area": str(area).replace("_", " ").title(),
                "lat": lat,
                "lon": lon,
                "source": "nominatim",
            }
        )
    return found


def _overpass_places():
    """Pull named place nodes/ways for Thiruvananthapuram from Overpass (OSM)."""
    south, west, north, east = _TVM_BBOX
    query = f"""
    [out:json][timeout:55];
    (
      node["place"~"city|town|suburb|neighbourhood|village|hamlet|locality|quarter|isolated_dwelling"]({south},{west},{north},{east});
      way["place"~"city|town|suburb|neighbourhood|village|hamlet|locality|quarter"]({south},{west},{north},{east});
      node["highway"="bus_stop"]["name"]({south},{west},{north},{east});
      node["amenity"~"hospital|college|university|school|bus_station|ferry_terminal"]["name"]({south},{west},{north},{east});
      node["railway"="station"]["name"]({south},{west},{north},{east});
      node["aeroway"="aerodrome"]["name"]({south},{west},{north},{east});
      node["tourism"~"attraction|museum|hotel"]["name"]({south},{west},{north},{east});
      node["shop"="mall"]["name"]({south},{west},{north},{east});
    );
    out center tags;
    """
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=query.encode("utf-8"),
        headers={"User-Agent": _USER_AGENT, "Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        payload = json.loads(resp.read().decode("utf-8"))

    places = []
    seen = set()
    for el in payload.get("elements", []):
        tags = el.get("tags") or {}
        name = (tags.get("name") or tags.get("name:en") or "").strip()
        if not name:
            continue
        if "lat" in el and "lon" in el:
            lat, lon = float(el["lat"]), float(el["lon"])
        elif "center" in el:
            lat, lon = float(el["center"]["lat"]), float(el["center"]["lon"])
        else:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        kind = tags.get("place") or tags.get("amenity") or tags.get("railway") or tags.get("tourism") or tags.get("highway") or tags.get("aeroway") or tags.get("shop") or "place"
        places.append(
            {
                "id": f"osm-{el.get('type', 'n')}-{el.get('id')}",
                "name": name,
                "area": str(kind).replace("_", " ").title(),
                "lat": lat,
                "lon": lon,
                "source": "overpass",
            }
        )
    places.sort(key=lambda p: p["name"].lower())
    return places


def load_osm_places(base_dir: str | None = None, refresh=False):
    """Cached OSM place catalog for Thiruvananthapuram (Overpass)."""
    global _osm_cache, _osm_cache_path
    if base_dir is None:
        base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    path = os.path.join(base_dir, "tvm_osm_places.json")
    _osm_cache_path = path

    if not refresh and _osm_cache is not None:
        return _osm_cache

    if not refresh and os.path.isfile(path):
        try:
            with open(path, encoding="utf-8") as fh:
                cached = json.load(fh)
            if isinstance(cached, list) and cached:
                _osm_cache = cached
                return _osm_cache
        except Exception:
            pass

    try:
        places = _overpass_places()
        if places:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(places, fh, ensure_ascii=False)
            _osm_cache = places
            return _osm_cache
    except Exception as exc:
        print("OSM Overpass fetch failed:", exc)

    # Fall back to landmarks if Overpass is unreachable
    _osm_cache = [
        {**p, "source": "landmark"}
        for p in LANDMARKS
    ]
    return _osm_cache


def _place_pool(base_dir=None):
    """OSM catalog + curated landmarks (deduped by name)."""
    pool = []
    seen = set()
    for p in load_osm_places(base_dir):
        key = p["name"].lower()
        if key in seen:
            continue
        seen.add(key)
        pool.append(dict(p))
    for p in LANDMARKS:
        key = p["name"].lower()
        if key in seen:
            continue
        seen.add(key)
        pool.append({**p, "source": "landmark"})
    return pool


def search_places(edge_file: str, query="", lat=None, lon=None, limit=25, live=True):
    q_raw = (query or "").strip()
    q = q_raw.lower()
    if " · " in q:
        q = q.split(" · ")[0].strip()
        q_raw = q_raw.split(" · ")[0].strip()

    # Empty query: no dropdown dump
    if not q and (lat is None or lon is None):
        return {"origin": None, "places": [], "count": 0, "source": "none"}

    data_dir = os.path.join(os.path.dirname(edge_file), "") if edge_file else None
    # edge_file is .../data/tvm_edges.csv → data dir is dirname
    base_dir = os.path.dirname(edge_file) if edge_file else None

    if not q and lat is not None and lon is not None:
        pool = _place_pool(base_dir)
        for p in pool:
            p["distance_km"] = round(_haversine(lat, lon, p["lat"], p["lon"]), 2)
        pool.sort(key=lambda p: p.get("distance_km", 1e9))
        origin_hits = nearest_edges(edge_file, lat, lon, k=1)
        origin = None
        if origin_hits:
            hit = origin_hits[0]
            origin = {
                "id": "gps",
                "name": "My location",
                "area": "GPS",
                "lat": lat,
                "lon": lon,
                "edge_index": hit["index"],
                "edge_id": hit["edge_id"],
                "distance_km": 0,
                "snap_km": round(hit["distance_km"], 3),
                "source": "gps",
            }
        snapped = [_snap(p, edge_file) for p in pool[: max(1, min(limit, 8))]]
        return {
            "origin": origin,
            "places": snapped,
            "count": len(pool),
            "source": "osm",
        }

    # Prefer live Nominatim for typed search; merge with cached OSM catalog matches
    matches = []
    seen = set()

    if live and len(q) >= 2:
        for extra in _nominatim(q_raw, limit=max(8, min(limit, 15))):
            key = extra["name"].lower()
            if key in seen:
                continue
            seen.add(key)
            matches.append(extra)

    for p in _place_pool(base_dir):
        name_l = p["name"].lower()
        area_l = str(p.get("area") or "").lower()
        if q not in name_l and q not in area_l:
            continue
        key = name_l
        if key in seen:
            continue
        seen.add(key)
        matches.append(dict(p))

    matches.sort(
        key=lambda p: (
            0 if p["name"].lower().startswith(q) else 1,
            0 if p.get("source") == "nominatim" else 1,
            p["name"].lower(),
        )
    )

    origin = None
    if lat is not None and lon is not None:
        origin_hits = nearest_edges(edge_file, lat, lon, k=1)
        if origin_hits:
            hit = origin_hits[0]
            origin = {
                "id": "gps",
                "name": "My location",
                "area": "GPS",
                "lat": lat,
                "lon": lon,
                "edge_index": hit["index"],
                "edge_id": hit["edge_id"],
                "distance_km": 0,
                "snap_km": round(hit["distance_km"], 3),
                "source": "gps",
            }
        for p in matches:
            p["distance_km"] = round(_haversine(lat, lon, p["lat"], p["lon"]), 2)
        matches.sort(key=lambda p: (p.get("distance_km", 1e9), p["name"]))

    if origin and ("my location" in q or "gps" in q):
        combined = [origin] + [p for p in matches if p["id"] != "gps"]
    else:
        combined = matches

    snapped = [_snap(p, edge_file) for p in combined[:limit]]
    return {
        "origin": origin,
        "places": snapped,
        "count": len(combined),
        "source": "osm",
    }


def nearest_place_name(lat: float, lon: float):
    best = None
    best_d = 1e9
    pool = list(LANDMARKS)
    try:
        pool = _place_pool() + LANDMARKS
    except Exception:
        pass
    seen = set()
    for place in pool:
        key = place["name"].lower()
        if key in seen:
            continue
        seen.add(key)
        dist = _haversine(lat, lon, place["lat"], place["lon"])
        if dist < best_d:
            best_d = dist
            best = place["name"]
    return best


def location_speeds(edge_file: str, speeds):
    """Predicted speed at each named city place (snapped to nearest OSM edge)."""
    rows = []
    n = len(speeds)
    for place in LANDMARKS:
        snapped = _snap(place, edge_file)
        idx = int(snapped.get("edge_index") or 0)
        speed = float(speeds[idx]) if n and idx < n else None
        rows.append(
            {
                "id": place["id"],
                "name": place["name"],
                "area": place["area"],
                "lat": place["lat"],
                "lon": place["lon"],
                "edge_index": idx,
                "speed": None if speed is None else round(speed, 2),
            }
        )
    rows.sort(key=lambda row: row["name"])
    return rows
