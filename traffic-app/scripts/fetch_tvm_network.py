"""Download Thiruvananthapuram drive network from OpenStreetMap via OSMnx."""
from __future__ import annotations

import json
from pathlib import Path

import osmnx as ox
import pandas as pd

CENTER = (8.5241, 76.9366)  # Palayam / city core
DIST_M = 4500
KEEP_HIGHWAYS = {
    "motorway",
    "motorway_link",
    "trunk",
    "trunk_link",
    "primary",
    "primary_link",
    "secondary",
    "secondary_link",
    "tertiary",
    "tertiary_link",
    "unclassified",
    "residential",
    "living_street",
}


def highway_label(value) -> str:
    if isinstance(value, list):
        return str(value[0]) if value else ""
    return "" if pd.isna(value) else str(value)


def linestring_wkt(geom) -> str | None:
    if geom is None or geom.is_empty:
        return None
    if geom.geom_type == "MultiLineString":
        geom = max(geom.geoms, key=lambda g: g.length)
    if geom.geom_type != "LineString":
        return None
    pairs = ", ".join(f"{x} {y}" for x, y in geom.coords)
    return f"LINESTRING ({pairs})"


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_csv = root / "data" / "tvm_edges.csv"
    out_meta = root / "data" / "city_meta.json"
    out_csv.parent.mkdir(parents=True, exist_ok=True)

    print(f"Fetching drive network around {CENTER} ({DIST_M} m)…")
    ox.settings.use_cache = True
    ox.settings.log_console = True
    graph = ox.graph_from_point(
        CENTER,
        dist=DIST_M,
        network_type="drive",
        simplify=True,
    )
    nodes_gdf, edges_gdf = ox.graph_to_gdfs(graph)
    edges_gdf = edges_gdf.reset_index()

    rows = []
    for i, row in edges_gdf.iterrows():
        hwy = highway_label(row.get("highway"))
        if hwy not in KEEP_HIGHWAYS:
            continue
        wkt = linestring_wkt(row.geometry)
        if not wkt:
            continue
        rows.append(
            {
                "u": int(row["u"]),
                "v": int(row["v"]),
                "length": float(row.get("length") or 0),
                "highway": hwy,
                "geometry": wkt,
                "edge_id": len(rows) + 1,
            }
        )

    df = pd.DataFrame(rows)
    df.to_csv(out_csv, index=False)

    meta = {
        "name": "Thiruvananthapuram",
        "region": "Kerala",
        "center": list(CENTER),
        "dist_m": DIST_M,
        "nodes": int(len(nodes_gdf)),
        "edges": int(len(df)),
        "csv": str(out_csv.name),
    }
    out_meta.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Wrote {len(df)} edges, {len(nodes_gdf)} nodes -> {out_csv}")


if __name__ == "__main__":
    main()
