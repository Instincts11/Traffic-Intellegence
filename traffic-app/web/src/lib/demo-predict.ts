import { TVM_PLACES, type Place } from "@/lib/places";

export type DemoLocation = {
  id: string;
  name: string;
  area: string;
  speed: number;
  lat: number;
  lon: number;
};

function hash32(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number) {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function clip(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function makeTimestamp(date: string, time: string) {
  const day = date || new Date().toISOString().slice(0, 10);
  const parts = String(time || "10:00").split(":");
  const hh = (parts[0] || "10").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  return `${day}T${hh}:${mm}`;
}

/** Matches Flask generate_demo_predictions: date + time + scenario → speeds. */
export function generateDemoSpeeds(date: string, time: string, scenario: string, count = 256) {
  const timestamp = makeTimestamp(date, time);
  const seed = hash32(`${timestamp}-${scenario}`);
  const rng = mulberry32(seed);

  let base = 27;
  let hour = 10;
  try {
    hour = parseInt(String(time).split(":")[0], 10);
    if (!Number.isFinite(hour)) hour = 10;
  } catch {
    hour = 10;
  }

  if (hour >= 7 && hour <= 10) base -= 7;
  else if (hour >= 16 && hour <= 20) base -= 9;
  else if (hour >= 22 || hour <= 5) base += 8;

  const key = String(scenario || "normal").toLowerCase();
  if (key === "accident") base -= 10;
  else if (key === "rain" || key === "rainy") base -= 6;
  else if (key === "heavy" || key === "heavy traffic" || key === "congestion") base -= 9;
  else if (key === "clear" || key === "light") base += 4;

  const speeds = new Array<number>(count);
  for (let i = 0; i < count; i++) {
    speeds[i] = clip(base + gaussian(rng) * 5, 5, 55);
  }
  return speeds;
}

export function placeSpeedIndex(place: { id: string; edge_index?: number }, roadCount: number) {
  if (place.edge_index && place.edge_index > 0) {
    return place.edge_index % roadCount;
  }
  return hash32(place.id) % Math.max(roadCount, 1);
}

export function demoLocations(date: string, time: string, scenario: string): DemoLocation[] {
  const speeds = generateDemoSpeeds(date, time, scenario);
  return TVM_PLACES.map((p) => ({
    id: p.id,
    name: p.name,
    area: p.area,
    lat: p.lat,
    lon: p.lon,
    speed: speeds[placeSpeedIndex(p, speeds.length)],
  }));
}

function alongCorridor(start: Place, end: Place, p: { lat: number; lon: number }) {
  const pad = 0.012;
  const minLat = Math.min(start.lat, end.lat) - pad;
  const maxLat = Math.max(start.lat, end.lat) + pad;
  const minLon = Math.min(start.lon, end.lon) - pad;
  const maxLon = Math.max(start.lon, end.lon) + pad;
  return p.lat >= minLat && p.lat <= maxLat && p.lon >= minLon && p.lon <= maxLon;
}

export function demoPpoRoute(input: {
  start: Place;
  end: Place;
  date: string;
  time: string;
  scenario: string;
  locations?: { id?: string; name: string; speed: number | null; lat?: number; lon?: number }[];
}) {
  const { start, end, date, time, scenario } = input;
  const rows =
    input.locations && input.locations.some((l) => l.speed != null)
      ? input.locations
      : demoLocations(date, time, scenario);

  const candidates = rows.filter(
    (p) =>
      p.speed != null &&
      p.lat != null &&
      p.lon != null &&
      alongCorridor(start, end, { lat: p.lat, lon: p.lon }),
  );

  const pool = candidates.length ? candidates : rows.filter((p) => p.speed != null);
  let best = pool[0];
  for (const row of pool) {
    if (Number(row.speed) > Number(best.speed)) best = row;
  }

  const predicted = Number(best?.speed ?? 22);
  const corridor = best?.name && best.name !== start.name && best.name !== end.name ? best.name : null;

  return {
    start_name: start.name,
    end_name: end.name,
    date,
    time,
    scenario,
    predicted_speed: predicted,
    recommended_route_index: best ? placeSpeedIndex({ id: best.id || best.name }, 256) : 0,
    note: corridor
      ? `Best predicted corridor ${start.name} → ${end.name} via ${corridor} (${predicted.toFixed(1)} km/h).`
      : `Best road between ${start.name} and ${end.name} based on predicted speed.`,
  };
}
