"""Build Leaflet-friendly JSON for the Next.js map from the OSM edge CSV."""

from __future__ import annotations

import heapq
import json
import os
import re
from collections import defaultdict

import pandas as pd

MAJOR_HIGHWAYS = ("motorway", "trunk", "primary", "secondary", "tertiary")
LINESTRING_RE = re.compile(r"LINESTRING\s+\(([^)]+)\)", re.IGNORECASE)

_edges_df = None
_map_roads = None
_cache_path = None
_mid_lats = None
_mid_lons = None
_mid_ids = None
_mid_index = None
_graph_cache = None
_graph_cache_path = None


def resolve_edge_file(base_dir: str) -> str:
    tvm = os.path.join(base_dir, "data", "tvm_edges.csv")
    ecity = os.path.join(base_dir, "data", "ecity_edges.csv")
    if os.path.isfile(tvm):
        return tvm
    return ecity


def load_city_meta(base_dir: str, default_center):
    path = os.path.join(base_dir, "data", "city_meta.json")
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    return {
        "name": "Thiruvananthapuram",
        "region": "Kerala",
        "center": list(default_center),
        "nodes": 0,
        "edges": 0,
    }


def parse_linestring(geometry) -> list:
    if geometry is None:
        return []
    text = str(geometry)
    match = LINESTRING_RE.search(text)
    inner = match.group(1) if match else (
        text.replace("LINESTRING (", "").replace("LINESTRING(", "").rstrip(")")
    )
    coords = []
    for pair in inner.split(","):
        parts = pair.strip().split()
        if len(parts) < 2:
            continue
        try:
            lon = float(parts[0])
            lat = float(parts[1])
        except ValueError:
            continue
        coords.append([lat, lon])
    return coords


def simplify_coords(coords, max_points=10):
    if len(coords) <= max_points:
        return coords
    step = (len(coords) - 1) / (max_points - 1)
    return [coords[round(i * step)] for i in range(max_points)]


def haversine_km(lat1, lon1, lat2, lon2):
    from math import asin, cos, radians, sin, sqrt

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    return 6371.0 * 2 * asin(sqrt(min(1.0, a)))


def _cross_track_km(lat, lon, s_lat, s_lon, e_lat, e_lon):
    """Approximate distance from point to the start-end segment."""
    total = haversine_km(s_lat, s_lon, e_lat, e_lon)
    if total < 0.05:
        return haversine_km(lat, lon, s_lat, s_lon)
    d_start = haversine_km(lat, lon, s_lat, s_lon)
    d_end = haversine_km(lat, lon, e_lat, e_lon)
    return min(d_start, d_end, (d_start + d_end - total) * 0.5)


def _in_corridor(lat, lon, s_lat, s_lon, e_lat, e_lon, max_km=1.2):
    pad_lat = max(0.008, abs(s_lat - e_lat) * 0.25 + 0.006)
    pad_lon = max(0.008, abs(s_lon - e_lon) * 0.25 + 0.006)
    in_box = (
        min(s_lat, e_lat) - pad_lat <= lat <= max(s_lat, e_lat) + pad_lat
        and min(s_lon, e_lon) - pad_lon <= lon <= max(s_lon, e_lon) + pad_lon
    )
    if not in_box:
        return False
    return _cross_track_km(lat, lon, s_lat, s_lon, e_lat, e_lon) <= max_km


def _midpoint(coords):
    if not coords:
        return None
    return coords[len(coords) // 2]


def _dedupe_line(line, min_km=0.008):
    if not line:
        return line
    out = [list(line[0])]
    for pt in line[1:]:
        if haversine_km(out[-1][0], out[-1][1], pt[0], pt[1]) >= min_km:
            out.append(list(pt))
    return out


def _build_drive_graph(edge_file: str):
    global _graph_cache, _graph_cache_path
    if _graph_cache is not None and _graph_cache_path == edge_file:
        return _graph_cache

    df = edges_dataframe(edge_file)
    if "u" not in df.columns or "v" not in df.columns:
        _graph_cache = ({}, {}, {}, {})
        _graph_cache_path = edge_file
        return _graph_cache

    graph = defaultdict(list)
    edge_coords = {}
    node_coords = {}
    edge_uv = {}
    for i, row in df.iterrows():
        coords = parse_linestring(row.get("geometry"))
        if len(coords) < 2:
            continue
        try:
            u = int(row["u"])
            v = int(row["v"])
        except (TypeError, ValueError):
            continue
        idx = int(i)
        if pd.notna(row.get("length")):
            length = float(row["length"]) / 1000.0
        else:
            length = haversine_km(
                coords[0][0], coords[0][1], coords[-1][0], coords[-1][1]
            )
        graph[u].append((v, idx, length))
        graph[v].append((u, idx, length))
        edge_coords[idx] = coords
        edge_uv[idx] = (u, v)
        node_coords[u] = coords[0]
        node_coords[v] = coords[-1]

    _graph_cache = (graph, edge_coords, node_coords, edge_uv)
    _graph_cache_path = edge_file
    return _graph_cache


def _nearest_graph_node(edge_file: str, lat: float, lon: float):
    hits = nearest_edges(edge_file, lat, lon, k=8)
    if not hits:
        return None

    df = edges_dataframe(edge_file)
    best_node = None
    best_d = float("inf")
    for hit in hits:
        row = df.iloc[hit["index"]]
        coords = parse_linestring(row.get("geometry"))
        if len(coords) < 2:
            continue
        try:
            pairs = ((int(row["u"]), coords[0]), (int(row["v"]), coords[-1]))
        except (TypeError, ValueError):
            continue
        for node, point in pairs:
            d = haversine_km(lat, lon, point[0], point[1])
            if d < best_d:
                best_d = d
                best_node = node
    return best_node


def _edge_travel_cost(edge_idx, length_km, speeds, weight_mode):
    speed = float(speeds[edge_idx]) if edge_idx < len(speeds) else 20.0
    speed = max(speed, 4.0)
    if weight_mode == "shortest":
        return length_km
    time_h = length_km / speed
    if weight_mode == "fastest":
        return time_h
    if weight_mode == "balanced":
        return 0.35 * length_km + 0.65 * time_h * 25.0
    return length_km


def _dijkstra(graph, start, goal, speeds, weight_mode="shortest"):
    if start == goal:
        return [], 0.0

    dist = {start: 0.0}
    prev = {}
    prev_edge = {}
    heap = [(0.0, start)]
    visited = set()

    while heap:
        d, node = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        if node == goal:
            break
        for nbr, edge_idx, length_km in graph.get(node, []):
            cost = _edge_travel_cost(edge_idx, length_km, speeds, weight_mode)
            nd = d + cost
            if nd < dist.get(nbr, float("inf")):
                dist[nbr] = nd
                prev[nbr] = node
                prev_edge[nbr] = edge_idx
                heapq.heappush(heap, (nd, nbr))

    if goal not in prev:
        return None, 0.0

    path_edges = []
    node = goal
    while node != start:
        path_edges.append((prev_edge[node], prev[node], node))
        node = prev[node]
    path_edges.reverse()
    return path_edges, dist.get(goal, 0.0)


def _orient_segment(coords, from_node, to_node, node_coords):
    segment = list(coords)
    nc_from = node_coords.get(from_node)
    nc_to = node_coords.get(to_node)
    if not nc_from or not nc_to:
        return segment
    d_fwd = haversine_km(
        nc_from[0], nc_from[1], segment[0][0], segment[0][1]
    ) + haversine_km(nc_to[0], nc_to[1], segment[-1][0], segment[-1][1])
    d_rev = haversine_km(
        nc_from[0], nc_from[1], segment[-1][0], segment[-1][1]
    ) + haversine_km(nc_to[0], nc_to[1], segment[0][0], segment[0][1])
    if d_rev < d_fwd:
        segment.reverse()
    return segment


def _chain_path_coords(path_edges, edge_coords, node_coords, s_lat, s_lon, e_lat, e_lon):
    if not path_edges:
        return [[s_lat, s_lon], [e_lat, e_lon]]

    line: list[list[float]] = []
    for edge_idx, from_node, to_node in path_edges:
        coords = edge_coords.get(edge_idx)
        if not coords:
            continue
        segment = _orient_segment(coords, from_node, to_node, node_coords)
        if line:
            last = line[-1]
            if (
                segment
                and haversine_km(
                    last[0], last[1], segment[0][0], segment[0][1]
                )
                < 0.015
            ):
                segment = segment[1:]
        line.extend(segment)

    if not line:
        return [[s_lat, s_lon], [e_lat, e_lon]]

    if haversine_km(s_lat, s_lon, line[0][0], line[0][1]) > 0.03:
        line.insert(0, [s_lat, s_lon])
    if haversine_km(e_lat, e_lon, line[-1][0], line[-1][1]) > 0.03:
        line.append([e_lat, e_lon])
    return _dedupe_line(line)


def _path_metrics(path_edges, edge_coords, speeds):
    distance_km = 0.0
    eta_min = 0.0
    for edge_idx, _from_node, _to_node in path_edges:
        coords = edge_coords.get(edge_idx)
        seg_len = 0.0
        if coords and len(coords) >= 2:
            for i in range(1, len(coords)):
                seg_len += haversine_km(
                    coords[i - 1][0],
                    coords[i - 1][1],
                    coords[i][0],
                    coords[i][1],
                )
        else:
            seg_len = 0.05
        distance_km += seg_len
        speed = float(speeds[edge_idx]) if edge_idx < len(speeds) else 20.0
        speed = max(speed, 4.0)
        eta_min += seg_len / speed * 60.0
    return round(distance_km, 2), round(eta_min, 1)


ROUTE_MODES = ("shortest", "fastest", "balanced")
ROUTE_MODE_LABELS = {
    "shortest": "Shortest distance",
    "fastest": "Fastest (traffic-aware)",
    "balanced": "Balanced time & distance",
}


def _compute_route(edge_file, speeds, s_lat, s_lon, e_lat, e_lon, weight_mode):
    graph, edge_coords, node_coords, _edge_uv = _build_drive_graph(edge_file)
    if not graph:
        return None

    start = _nearest_graph_node(edge_file, s_lat, s_lon)
    goal = _nearest_graph_node(edge_file, e_lat, e_lon)
    if start is None or goal is None:
        return None

    path_edges, _cost = _dijkstra(
        graph, start, goal, speeds, weight_mode=weight_mode
    )
    if path_edges is None:
        return None

    path_line = _chain_path_coords(
        path_edges, edge_coords, node_coords, s_lat, s_lon, e_lat, e_lon
    )
    distance_km, eta_min = _path_metrics(path_edges, edge_coords, speeds)
    path_indices = [edge_idx for edge_idx, _, _ in path_edges]
    return {
        "id": weight_mode,
        "label": ROUTE_MODE_LABELS.get(weight_mode, weight_mode),
        "path_line": path_line,
        "distance_km": distance_km,
        "eta_min": eta_min,
        "path_indices": path_indices,
        "edge_count": len(path_indices),
    }


def speed_color(speed: float) -> str:
    if speed >= 25:
        return "#16a34a"
    if speed >= 18:
        return "#d97706"
    return "#dc2626"


def edges_dataframe(edge_file: str) -> pd.DataFrame:
    global _edges_df, _cache_path, _map_roads
    global _mid_lats, _mid_lons, _mid_ids, _mid_index
    global _graph_cache, _graph_cache_path
    if _edges_df is None or _cache_path != edge_file:
        _edges_df = pd.read_csv(edge_file)
        _cache_path = edge_file
        _map_roads = None
        _mid_lats = _mid_lons = _mid_ids = _mid_index = None
        _graph_cache = None
        _graph_cache_path = None
    return _edges_df


def edge_midpoints(edge_file: str):
    """Lat/lon midpoint of every edge, for snapping places and GPS."""
    global _mid_lats, _mid_lons, _mid_ids, _mid_index
    import numpy as np

    df = edges_dataframe(edge_file)
    if _mid_lats is not None:
        return _mid_lats, _mid_lons, _mid_ids, _mid_index

    lats = []
    lons = []
    ids = []
    indices = []
    geometries = df["geometry"].tolist() if "geometry" in df.columns else []
    edge_ids = (
        df["edge_id"].astype(str).tolist()
        if "edge_id" in df.columns
        else [str(i + 1) for i in range(len(df))]
    )
    for i, geometry in enumerate(geometries):
        coords = parse_linestring(geometry)
        if len(coords) < 1:
            continue
        mid = coords[len(coords) // 2]
        lats.append(mid[0])
        lons.append(mid[1])
        ids.append(edge_ids[i] if i < len(edge_ids) else str(i + 1))
        indices.append(i)
    _mid_lats = np.asarray(lats, dtype=float)
    _mid_lons = np.asarray(lons, dtype=float)
    _mid_ids = ids
    _mid_index = np.asarray(indices, dtype=int)
    return _mid_lats, _mid_lons, _mid_ids, _mid_index


def nearest_edges(edge_file: str, lat: float, lon: float, k=1):
    import numpy as np

    lats, lons, ids, indices = edge_midpoints(edge_file)
    if len(lats) == 0:
        return []
    dlat = np.radians(lats - lat)
    dlon = np.radians(lons - lon)
    a = (
        np.sin(dlat / 2) ** 2
        + np.cos(np.radians(lat)) * np.cos(np.radians(lats)) * np.sin(dlon / 2) ** 2
    )
    dist_km = 6371.0 * 2 * np.arcsin(np.sqrt(np.clip(a, 0, 1)))
    k = max(1, min(int(k), len(dist_km)))
    order = np.argpartition(dist_km, k - 1)[:k]
    order = order[np.argsort(dist_km[order])]
    out = []
    for i in order:
        out.append(
            {
                "index": int(indices[i]),
                "edge_id": ids[int(i)],
                "lat": float(lats[i]),
                "lon": float(lons[i]),
                "distance_km": float(dist_km[i]),
            }
        )
    return out


def map_roads(edge_file: str, limit=2800):
    global _map_roads
    df = edges_dataframe(edge_file)
    if _map_roads is not None:
        return _map_roads

    if "geometry" not in df.columns:
        _map_roads = []
        return _map_roads

    geometries = df["geometry"].tolist()
    highways = (
        df["highway"].astype(str).tolist()
        if "highway" in df.columns
        else [""] * len(df)
    )
    edge_ids = (
        df["edge_id"].astype(str).tolist()
        if "edge_id" in df.columns
        else [str(i + 1) for i in range(len(df))]
    )

    roads = []
    for i, geometry in enumerate(geometries):
        coords = parse_linestring(geometry)
        if len(coords) < 2:
            continue
        roads.append(
            {
                "index": i,
                "edge_id": edge_ids[i],
                "highway": highways[i],
                "coordinates": coords,
            }
        )

    major = [r for r in roads if any(k in r["highway"] for k in MAJOR_HIGHWAYS)]
    pool = major or roads
    if len(pool) > limit:
        step = max(1, len(pool) // limit)
        pool = pool[::step][:limit]
    _map_roads = pool
    return _map_roads


def network_payload(edge_file: str, meta: dict, center, zoom: int):
    roads = map_roads(edge_file)
    return {
        "center": meta.get("center") or list(center),
        "zoom": zoom,
        "nodes": meta.get("nodes", 0),
        "edges": meta.get("edges") or len(edges_dataframe(edge_file)),
        "roads": [
            {
                "index": r["index"],
                "edge_id": r["edge_id"],
                "coordinates": simplify_coords(r["coordinates"]),
                "color": "#9c9c90",
                "tooltip": f"Road R{r['index']}",
            }
            for r in roads
        ],
    }


def _build_road_list(edges, speeds, best_index, name_fn=None, detail=10):
    roads = []
    for edge in edges:
        idx = edge["index"]
        speed = float(speeds[idx]) if idx < len(speeds) else 20.0
        label = name_fn(idx, speed) if name_fn else f"Road R{idx} | {speed:.2f} km/h"
        roads.append(
            {
                "index": idx,
                "edge_id": edge["edge_id"],
                "speed": speed,
                "color": "#2563eb" if idx == best_index else speed_color(speed),
                "coordinates": simplify_coords(edge["coordinates"], detail),
                "tooltip": label,
            }
        )
    return roads


def traffic_map_payload(
    edge_file: str,
    speeds,
    meta: dict,
    center,
    zoom: int,
    route=None,
):
    all_edges = map_roads(edge_file)
    n = min(len(speeds), len(edges_dataframe(edge_file)))

    best_index = 0
    best_speed = float(speeds[0]) if n else 0.0
    for i in range(1, n):
        value = float(speeds[i])
        if value > best_speed:
            best_speed = value
            best_index = i

    full_roads = _build_road_list(all_edges, speeds, best_index)

    payload = {
        "center": meta.get("center") or list(center),
        "zoom": zoom,
        "best_index": best_index,
        "best_speed": best_speed,
        "best_label": f"Fastest road in {meta.get('name', 'city')}",
        "roads": full_roads,
        "route": None,
    }

    if not route:
        return payload

    s_lat = float(route["start_lat"])
    s_lon = float(route["start_lon"])
    e_lat = float(route["end_lat"])
    e_lon = float(route["end_lon"])
    start_name = route.get("start_name") or "Start"
    end_name = route.get("end_name") or "End"
    route_mode = str(route.get("route_mode") or "fastest").lower()
    if route_mode not in ROUTE_MODES:
        route_mode = "fastest"
    scenario = str(route.get("scenario") or "normal")

    edge_by_index = {e["index"]: e for e in all_edges}
    alternatives = []
    for mode in ROUTE_MODES:
        computed = _compute_route(
            edge_file, speeds, s_lat, s_lon, e_lat, e_lon, mode
        )
        if computed:
            alternatives.append(computed)

    selected = next(
        (a for a in alternatives if a["id"] == route_mode),
        alternatives[0] if alternatives else None,
    )

    direct_km = round(haversine_km(s_lat, s_lon, e_lat, e_lon), 2)
    route_line = [[s_lat, s_lon], [e_lat, e_lon]]

    if not selected:
        payload["route"] = {
            "start_name": start_name,
            "end_name": end_name,
            "start_lat": s_lat,
            "start_lon": s_lon,
            "end_lat": e_lat,
            "end_lon": e_lon,
            "scenario": scenario,
            "route_mode": route_mode,
            "center": [(s_lat + e_lat) / 2, (s_lon + e_lon) / 2],
            "zoom": 13,
            "route_line": route_line,
            "path_line": route_line,
            "distance_km": direct_km,
            "direct_km": direct_km,
            "eta_min": round(direct_km / 25 * 60, 1),
            "roads": [],
            "road_count": 0,
            "alternatives": [],
            "best_index": -1,
            "best_speed": 0,
            "best_label": "No graph route — showing direct line",
        }
        return payload

    path_indices = selected["path_indices"]
    path_index_set = set(path_indices)
    path_edges_only = [
        edge_by_index[idx] for idx in path_indices if idx in edge_by_index
    ]

    corridor_best = path_indices[0]
    corridor_best_speed = (
        float(speeds[corridor_best]) if corridor_best < len(speeds) else 0.0
    )
    for idx in path_indices[1:]:
        speed = float(speeds[idx]) if idx < len(speeds) else 0.0
        if speed > corridor_best_speed:
            corridor_best = idx
            corridor_best_speed = speed

    def corridor_label(idx, speed):
        return f"{start_name} → {end_name} · {speed:.2f} km/h"

    route_roads = _build_road_list(
        path_edges_only,
        speeds,
        corridor_best,
        name_fn=corridor_label,
        detail=32,
    )

    alt_payload = []
    alt_colors = {
        "shortest": "#2563eb",
        "fastest": "#f43e01",
        "balanced": "#16a34a",
    }
    for alt in alternatives:
        alt_payload.append(
            {
                "id": alt["id"],
                "label": alt["label"],
                "path_line": alt["path_line"],
                "distance_km": alt["distance_km"],
                "eta_min": alt["eta_min"],
                "edge_count": alt["edge_count"],
                "color": alt_colors.get(alt["id"], "#9c9c90"),
                "selected": alt["id"] == selected["id"],
            }
        )

    scenario_note = scenario.capitalize()
    payload["route"] = {
        "start_name": start_name,
        "end_name": end_name,
        "start_lat": s_lat,
        "start_lon": s_lon,
        "end_lat": e_lat,
        "end_lon": e_lon,
        "scenario": scenario,
        "route_mode": selected["id"],
        "center": [(s_lat + e_lat) / 2, (s_lon + e_lon) / 2],
        "zoom": 13,
        "best_index": corridor_best,
        "best_speed": corridor_best_speed,
        "best_label": (
            f"{selected['label']} · {scenario_note} · "
            f"{start_name} → {end_name}"
        ),
        "roads": route_roads,
        "route_line": route_line,
        "path_line": selected["path_line"],
        "distance_km": selected["distance_km"],
        "direct_km": direct_km,
        "eta_min": selected["eta_min"],
        "road_count": len(path_edges_only),
        "alternatives": alt_payload,
    }
    return payload
