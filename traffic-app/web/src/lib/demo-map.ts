import { city } from "@/lib/city";
import { generateDemoSpeeds } from "@/lib/demo-predict";
import { TVM_PLACES, haversineKm } from "@/lib/places";
import { fetchDrivingRoutes, pathLengthKm, type DrivingRoute } from "@/lib/osrm";

export type DemoMapRoad = {
  index: number;
  color: string;
  coordinates: [number, number][];
  tooltip: string;
  speed?: number;
};

const CORRIDORS: string[][] = [
  ["airport", "chackai", "petta-bypass", "pettah", "thampanoor", "overbridge", "statue", "palayam", "secretariat"],
  [
    "east-fort",
    "pazhavangadi",
    "thampanoor",
    "thycaud",
    "palayam",
    "pmg",
    "pattom",
    "kesavadasapuram",
    "ulloor",
    "sreekaryam",
    "sreekaryam-jn",
    "karyavattom",
    "kazhakoottam",
    "technopark",
  ],
  ["palayam", "museum", "vellayambalam", "kowdiar", "sasthamangalam"],
  ["medical-college", "ulloor", "sreekaryam", "chekkalamukku", "engineering-college"],
];

const MODE_COLORS: Record<string, string> = {
  shortest: "#2563eb",
  fastest: "#f43e01",
  balanced: "#16a34a",
};

function speedColor(speed: number) {
  if (speed >= 25) return "#16a34a";
  if (speed >= 18) return "#d97706";
  return "#dc2626";
}

function hash32(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nearestPlace(lat: number, lon: number) {
  let best = TVM_PLACES[0];
  let bestKm = Infinity;
  for (const p of TVM_PLACES) {
    const d = haversineKm(lat, lon, p.lat, p.lon);
    if (d < bestKm) {
      best = p;
      bestKm = d;
    }
  }
  return best;
}

function colorPath(path: [number, number][], speeds: number[], startName: string, endName: string): DemoMapRoad[] {
  if (path.length < 2) return [];
  const chunk = Math.max(2, Math.floor(path.length / 12));
  const roads: DemoMapRoad[] = [];
  let idx = 0;
  for (let i = 0; i < path.length - 1; i += chunk) {
    const slice = path.slice(i, Math.min(path.length, i + chunk + 1));
    if (slice.length < 2) continue;
    const speed = speeds[hash32(`${startName}-${endName}-${i}`) % speeds.length];
    roads.push({
      index: idx,
      speed,
      color: speedColor(speed),
      coordinates: slice,
      tooltip: `${startName} → ${endName} · ${speed.toFixed(1)} km/h`,
    });
    idx += 1;
  }
  return roads;
}

function corridorFallbackPath(startLat: number, startLon: number, endLat: number, endLon: number): [number, number][] {
  const start = nearestPlace(startLat, startLon);
  const end = nearestPlace(endLat, endLon);
  const byId = new Map(TVM_PLACES.map((p) => [p.id, p]));
  let bestChain: string[] | null = null;
  let bestScore = Infinity;
  for (const chain of CORRIDORS) {
    const si = chain.indexOf(start.id);
    const ei = chain.indexOf(end.id);
    if (si < 0 || ei < 0) continue;
    const score = Math.abs(si - ei);
    if (score < bestScore) {
      bestScore = score;
      bestChain = si <= ei ? chain.slice(si, ei + 1) : chain.slice(ei, si + 1).reverse();
    }
  }
  const mids = (bestChain || [])
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const path: [number, number][] = [[startLat, startLon]];
  for (const p of mids) {
    path.push([p.lat, p.lon]);
  }
  path.push([endLat, endLon]);
  return path;
}

function decorateRoutes(
  driving: DrivingRoute[],
  scenario: string,
  routeMode: string,
  startName: string,
  endName: string,
  time: string,
  date: string,
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
) {
  const speeds = generateDemoSpeeds(date, time, scenario);
  const trafficFactor =
    scenario === "accident" ? 1.35 : scenario === "rain" || scenario === "heavy" ? 1.22 : scenario === "clear" ? 0.9 : 1;

  const scored = driving.map((r) => {
    const driveKm = r.distanceKm || pathLengthKm(r.path);
    const driveMin = Math.max(1, r.durationMin) * trafficFactor;
    return { ...r, driveKm, driveMin };
  });

  const shortest = [...scored].sort((a, b) => a.driveKm - b.driveKm)[0];
  const fastest = [...scored].sort((a, b) => a.driveMin - b.driveMin)[0];
  const balanced =
    scored.find((r) => r !== shortest && r !== fastest) ||
    scored[Math.floor(scored.length / 2)] ||
    fastest;

  const picked = [
    { id: "shortest", label: "Shortest distance", row: shortest },
    { id: "fastest", label: "Fastest (traffic-aware)", row: fastest },
    { id: "balanced", label: "Balanced", row: balanced },
  ];
  const seen = new Set<string>();
  const unique = picked.filter((item) => {
    const key = `${item.row.driveKm}-${item.row.path.length}-${item.row.path[1]?.join(",")}`;
    if (item.id !== "fastest" && seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!unique.some((item) => item.id === routeMode) && unique[0]) {
    unique[0] = { ...unique[0], id: routeMode, label: unique[0].label };
  }

  const alternatives = unique.map((item) => ({
    id: item.id,
    label: item.label,
    path_line: item.row.path,
    distance_km: item.row.driveKm,
    eta_min: Math.round(item.row.driveMin * 10) / 10,
    edge_count: Math.max(1, item.row.path.length - 1),
    color: MODE_COLORS[item.id],
    selected: item.id === routeMode,
  }));

  const selected = alternatives.find((a) => a.id === routeMode) || alternatives[0];
  const routeRoads = selected ? colorPath(selected.path_line, speeds, startName, endName) : [];
  const directKm = Math.round(haversineKm(startLat, startLon, endLat, endLon) * 100) / 100;

  return {
    center: city.center,
    zoom: city.zoom,
    best_index: -1,
    best_speed: undefined as number | undefined,
    best_label: `${startName} → ${endName} on OSM roads`,
    roads: routeRoads,
    edges: routeRoads.length,
    nodes: selected?.path_line.length ?? 0,
    source: "osrm",
    route: {
      start_name: startName,
      end_name: endName,
      start_lat: startLat,
      start_lon: startLon,
      end_lat: endLat,
      end_lon: endLon,
      scenario,
      route_mode: routeMode,
      center: [(startLat + endLat) / 2, (startLon + endLon) / 2] as [number, number],
      zoom: 13,
      best_index: -1,
      best_speed: undefined as number | undefined,
      best_label: selected ? `${startName} → ${endName}` : "Direct line",
      route_line: [
        [startLat, startLon],
        [endLat, endLon],
      ] as [number, number][],
      path_line: selected?.path_line ?? [
        [startLat, startLon],
        [endLat, endLon],
      ],
      distance_km: selected?.distance_km ?? directKm,
      direct_km: directKm,
      eta_min: selected?.eta_min ?? Math.round((directKm / 22) * 60 * 10) / 10,
      roads: routeRoads,
      road_count: routeRoads.length,
      alternatives,
    },
  };
}

export function fallbackNetwork() {
  return {
    center: city.center,
    zoom: city.zoom,
    nodes: TVM_PLACES.length,
    edges: 0,
    roads: [] as DemoMapRoad[],
    source: "studio",
  };
}

export function fallbackRouteMapSync(input: {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startName?: string;
  endName?: string;
  scenario?: string;
  routeMode?: string;
  date?: string;
  time?: string;
}) {
  const path = corridorFallbackPath(input.startLat, input.startLon, input.endLat, input.endLon);
  const km = pathLengthKm(path);
  const durationMin = Math.max(1, (km / 22) * 60);
  return decorateRoutes(
    [{ id: "corridor", distanceKm: km, durationMin, path }],
    input.scenario || "normal",
    String(input.routeMode || "fastest").toLowerCase(),
    input.startName || nearestPlace(input.startLat, input.startLon).name,
    input.endName || nearestPlace(input.endLat, input.endLon).name,
    input.time || "10:00",
    input.date || new Date().toISOString().slice(0, 10),
    input.startLat,
    input.startLon,
    input.endLat,
    input.endLon,
  );
}

export async function fallbackRouteMap(input: {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startName?: string;
  endName?: string;
  scenario?: string;
  routeMode?: string;
  date?: string;
  time?: string;
}) {
  const startName = input.startName || nearestPlace(input.startLat, input.startLon).name;
  const endName = input.endName || nearestPlace(input.endLat, input.endLon).name;
  let driving: DrivingRoute[] = [];
  try {
    driving = await fetchDrivingRoutes(
      { lat: input.startLat, lon: input.startLon },
      { lat: input.endLat, lon: input.endLon },
    );
  } catch {
    driving = [];
  }
  if (!driving.length) {
    return fallbackRouteMapSync(input);
  }
  return decorateRoutes(
    driving,
    input.scenario || "normal",
    String(input.routeMode || "fastest").toLowerCase(),
    startName,
    endName,
    input.time || "10:00",
    input.date || new Date().toISOString().slice(0, 10),
    input.startLat,
    input.startLon,
    input.endLat,
    input.endLon,
  );
}
