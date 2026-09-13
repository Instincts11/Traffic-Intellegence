import { city } from "@/lib/city";
import { generateDemoSpeeds } from "@/lib/demo-predict";
import type { DemoMapRoad } from "@/lib/demo-map";

type OsmWay = {
  id: number;
  highway: string;
  name: string;
  coordinates: [number, number][];
};

let cachedWays: OsmWay[] | null = null;

function hash32(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function speedColor(speed: number) {
  if (speed >= 25) return "#16a34a";
  if (speed >= 18) return "#d97706";
  return "#dc2626";
}

function simplify(coords: [number, number][], minDeg = 0.00022): [number, number][] {
  if (coords.length <= 2) return coords;
  const kept: [number, number][] = [coords[0]];
  for (const pt of coords.slice(1, -1)) {
    const prev = kept[kept.length - 1];
    if (Math.abs(pt[0] - prev[0]) >= minDeg || Math.abs(pt[1] - prev[1]) >= minDeg) {
      kept.push(pt);
    }
  }
  kept.push(coords[coords.length - 1]);
  return kept.length >= 2 ? kept : coords.slice(0, 2);
}

function parseOverpass(payload: { elements?: { type?: string; id?: number; tags?: Record<string, string>; geometry?: { lat: number; lon: number }[] }[] }): OsmWay[] {
  const ways: OsmWay[] = [];
  for (const el of payload.elements || []) {
    if (el.type !== "way" || !el.geometry || el.geometry.length < 2) continue;
    const coordinates = simplify(
      el.geometry.map((p) => [Number(p.lat), Number(p.lon)] as [number, number]),
    );
    if (coordinates.length < 2) continue;
    const tags = el.tags || {};
    ways.push({
      id: Number(el.id) || ways.length,
      highway: tags.highway || "road",
      name: tags.name || tags.ref || "",
      coordinates,
    });
  }
  return ways;
}

async function fetchWays(url: string, query: string): Promise<OsmWay[]> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  return parseOverpass(await res.json());
}

export async function loadCityRoads(scenario = "normal", time = "10:00"): Promise<DemoMapRoad[]> {
  const { south, west, north, east } = city.bounds;
  const query = `[out:json][timeout:20];way["highway"~"^(trunk|primary|secondary|tertiary)$"](${south},${west},${north},${east});out geom;`;
  if (!cachedWays) {
    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ];
    for (const url of endpoints) {
      try {
        const ways = await fetchWays(url, query);
        if (ways.length) {
          cachedWays = ways;
          break;
        }
      } catch {
        /* try next mirror */
      }
    }
  }
  const ways = cachedWays || [];
  const speeds = generateDemoSpeeds(new Date().toISOString().slice(0, 10), time, scenario, Math.max(256, ways.length + 8));
  return ways.map((way, index) => {
    const speed = speeds[hash32(`${way.id}-${scenario}`) % speeds.length];
    const label = way.name || way.highway;
    return {
      index,
      speed,
      color: speedColor(speed),
      coordinates: way.coordinates,
      tooltip: `${label} · ${speed.toFixed(1)} km/h`,
    };
  });
}
