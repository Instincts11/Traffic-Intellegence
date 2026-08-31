"use client";

import { useEffect, useRef } from "react";
import type { LatLngBounds, Map as LeafletMap, MapOptions } from "leaflet";
import * as LeafletNS from "leaflet";
import "leaflet/dist/leaflet.css";
import { city } from "@/lib/city";

type LeafletApi = typeof import("leaflet");

function leaflet(): LeafletApi {
  const mod = LeafletNS as unknown as LeafletApi & { default?: LeafletApi };
  return (mod.default ?? mod) as LeafletApi;
}

export type MapRoad = {
  index: number;
  color: string;
  coordinates: [number, number][];
  tooltip: string;
};

export type PathOverlay = {
  id: string;
  label: string;
  path: [number, number][];
  color: string;
  weight?: number;
  dashArray?: string;
  selected?: boolean;
};

export function TrafficLeaflet({
  mapKey,
  roads,
  center,
  zoom,
  bestIndex,
  bestSpeed,
  bestLabel,
  markers = [],
  routeLine,
  pathLine,
  pathOverlays = [],
  pathOnly = false,
  height = 480,
  fitToRoute = false,
}: {
  mapKey: string;
  roads: MapRoad[];
  center: [number, number];
  zoom: number;
  bestIndex?: number;
  bestSpeed?: number;
  bestLabel?: string;
  markers?: { lat: number; lon: number; label: string; color: string }[];
  routeLine?: [number, number][];
  pathLine?: [number, number][];
  pathOverlays?: PathOverlay[];
  pathOnly?: boolean;
  height?: number;
  fitToRoute?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    const L = leaflet();
    let cancelled = false;
    let map: LeafletMap | null = null;
    let resizeTimer: number | undefined;

    const tagged = node as HTMLDivElement & { _leaflet_id?: number };
    if (tagged._leaflet_id) {
      tagged.replaceChildren();
      delete tagged._leaflet_id;
    }

    const options: MapOptions = {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      preferCanvas: false,
    };

    map = L.map(node, options);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    if (!map.getPane("placePins")) {
      map.createPane("placePins");
      const pane = map.getPane("placePins");
      if (pane) pane.style.zIndex = "650";
    }

    const group = L.layerGroup().addTo(map);

    const overlays: PathOverlay[] =
      pathOverlays.length > 0
        ? pathOverlays
        : pathLine && pathLine.length >= 2
          ? [
              {
                id: "primary",
                label: "Route",
                path: pathLine,
                color: "#f43e01",
                selected: true,
              },
            ]
          : [];

    const draw = () => {
      if (cancelled || !map || !map.getContainer().isConnected) return;

      group.clearLayers();

      if (!pathOnly) {
        for (const road of roads.slice(0, 2000)) {
          if (road.coordinates.length < 2) continue;
          L.polyline(road.coordinates, {
            color: road.color,
            weight: 4,
            opacity: 0.88,
          })
            .bindTooltip(road.tooltip)
            .addTo(group);
        }

        const best = roads.find((r) => r.index === bestIndex);
        if (best && best.coordinates.length > 1 && bestIndex !== -1) {
          const tip =
            bestLabel || `Best road · ${Number(bestSpeed ?? 0).toFixed(2)} km/h`;
          L.polyline(best.coordinates, {
            color: "#2563eb",
            weight: 8,
            opacity: 1,
          })
            .bindTooltip(tip)
            .addTo(group);
        }
      } else {
        for (const road of roads) {
          if (road.coordinates.length < 2) continue;
          L.polyline(road.coordinates, {
            color: road.color,
            weight: 6,
            opacity: 0.95,
          })
            .bindTooltip(road.tooltip)
            .addTo(group);
        }
      }

      for (const overlay of overlays) {
        if (overlay.path.length < 2) continue;
        L.polyline(overlay.path, {
          color: overlay.color,
          weight: overlay.selected ? 6 : overlay.weight ?? 4,
          opacity: overlay.selected ? 0.95 : 0.55,
          dashArray: overlay.dashArray ?? (overlay.selected ? "12 8" : "8 10"),
          lineCap: "round",
          lineJoin: "round",
        })
          .bindTooltip(overlay.label)
          .addTo(group);
      }

      if (routeLine && routeLine.length >= 2) {
        const pts = routeLine.map(
          ([lat, lon]) => [Number(lat), Number(lon)] as [number, number],
        );
        // Underlay so the dash reads on busy basemap tiles
        L.polyline(pts, {
          color: "#ffffff",
          weight: 8,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(group);
        L.polyline(pts, {
          color: "#4b5563",
          weight: 5,
          opacity: 1,
          dashArray: "14 10",
          lineCap: "round",
          lineJoin: "round",
        })
          .bindTooltip("Direct path between start and end")
          .addTo(group);
      }

      for (const marker of markers) {
        L.circleMarker([marker.lat, marker.lon], {
          pane: "placePins",
          radius: 12,
          color: "#ffffff",
          fillColor: marker.color,
          fillOpacity: 1,
          weight: 3,
        })
          .bindTooltip(marker.label)
          .addTo(group);

        const isStart = marker.label.toLowerCase().startsWith("start");
        const name = marker.label.replace(/^(Start|End):\s*/i, "");
        const badge = isStart ? "START" : "END";
        const bg = isStart ? "#16a34a" : "#1f2937";
        L.marker([marker.lat, marker.lon], {
          pane: "placePins",
          icon: L.divIcon({
            className: "traffic-place-pin",
            html: `<div style="transform:translate(-50%,-118%);white-space:nowrap;text-align:center">
              <div style="display:inline-block;background:${bg};color:#fff;font:700 11px/1.2 ui-sans-serif,system-ui,sans-serif;letter-spacing:.08em;padding:6px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.28)">${badge}</div>
              <div style="margin-top:4px;display:inline-block;background:#fff;color:#1f2937;font:600 12px/1.2 ui-sans-serif,system-ui,sans-serif;padding:4px 8px;border-radius:6px;border:1px solid #d6d3d1;box-shadow:0 1px 4px rgba(0,0,0,.12)">${name}</div>
            </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(group);
      }

      const fitLines = [
        ...(routeLine ?? []),
        ...overlays.flatMap((o) => o.path),
      ];

      if (fitToRoute && (markers.length >= 2 || fitLines.length >= 2)) {
        let bounds: LatLngBounds | null = null;
        if (markers.length >= 2) {
          bounds = L.latLngBounds(
            markers.map((m) => [m.lat, m.lon] as [number, number]),
          );
        }
        for (const pt of fitLines) {
          bounds = bounds ? bounds.extend(pt) : L.latLngBounds([pt, pt]);
        }
        if (bounds) {
          map.fitBounds(bounds.pad(0.14), { animate: false });
        }
      } else {
        map.setView(center, zoom, { animate: false });
      }

      map.invalidateSize();
    };

    map.whenReady(() => {
      if (!cancelled) draw();
    });

    const onResize = () => {
      if (map && !cancelled) map.invalidateSize();
    };
    window.addEventListener("resize", onResize);
    resizeTimer = window.setTimeout(onResize, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      if (map) {
        map.remove();
        map = null;
      }
      mapRef.current = null;
      if (tagged._leaflet_id) {
        tagged.replaceChildren();
        delete tagged._leaflet_id;
      }
    };
  }, [
    mapKey,
    roads,
    center,
    zoom,
    bestIndex,
    bestSpeed,
    bestLabel,
    markers,
    routeLine,
    pathLine,
    pathOverlays,
    pathOnly,
    fitToRoute,
  ]);

  return (
    <div
      className="relative overflow-hidden rounded-[10px] border border-khaki bg-parchment"
      style={{ height }}
    >
      <div
        ref={el}
        className="traffic-leaflet h-full w-full"
        style={{ height, width: "100%" }}
        aria-label={`${city.name} traffic map`}
      />
    </div>
  );
}
