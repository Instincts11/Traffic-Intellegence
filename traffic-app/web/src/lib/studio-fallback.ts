import { city } from "@/lib/city";
import { generateDemoSpeeds, placeSpeedIndex } from "@/lib/demo-predict";
import {
  TVM_PLACES,
  filterPlaces,
  haversineKm,
  nearestListedPlace,
  type Place,
} from "@/lib/places";

export type InfluencePayload = {
  city: string;
  place: string;
  roads: string[];
  road_details: {
    index: number;
    label: string;
    place: string | null;
    highway: string | null;
    lat: number;
    lon: number;
    distance_km: number | null;
    speed: number | null;
  }[];
  indices: number[];
  matrix: number[][];
  origin: { lat: number | null; lon: number | null; edge: number | null; place: string };
  legend: { what: string; darker: string; lighter: string };
  source: string;
};

function num(value: string | null, fallback?: number) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function nearbyPlaces(lat: number, lon: number, k = 30): Place[] {
  return TVM_PLACES.map((p) => ({
    ...p,
    distance_km: Math.round(haversineKm(lat, lon, p.lat, p.lon) * 100) / 100,
  }))
    .sort((a, b) => (a.distance_km ?? 0) - (b.distance_km ?? 0))
    .slice(0, k);
}

function gpsOrigin(lat: number, lon: number): Place {
  const near = nearestListedPlace({ lat, lon });
  return {
    id: "gps",
    name: "My location",
    area: "GPS",
    lat,
    lon,
    edge_index: near?.edge_index ?? 0,
    edge_id: near?.id ?? null,
    distance_km: 0,
    snap_km: near?.distance_km ?? 0,
    source: "gps",
  };
}

export function fallbackPlacesSearch(query: string, lat?: number, lon?: number, limit = 25) {
  const origin = lat != null && lon != null ? { lat, lon } : null;
  const q = query.trim();

  if (!q && origin) {
    const places = nearbyPlaces(origin.lat, origin.lon, Math.max(1, Math.min(limit, 8))).map(
      (p) => ({ ...p, source: p.source || "studio" }),
    );
    return {
      origin: gpsOrigin(origin.lat, origin.lon),
      places,
      count: TVM_PLACES.length,
      source: "studio",
    };
  }

  const places = filterPlaces(q, origin, limit).map((p) => ({
    ...p,
    source: p.source || "studio",
  }));
  return {
    origin: origin ? gpsOrigin(origin.lat, origin.lon) : null,
    places,
    count: places.length,
    source: "studio",
  };
}

export function fallbackNearest(lat: number, lon: number, limit = 8) {
  return fallbackPlacesSearch("", lat, lon, limit);
}

export function fallbackInfluence(input: {
  lat?: number | null;
  lon?: number | null;
  edge?: number | null;
  place?: string | null;
}): InfluencePayload {
  const named = String(input.place || "").trim();
  let lat = input.lat ?? null;
  let lon = input.lon ?? null;

  if (lat == null || lon == null) {
    const match = named
      ? TVM_PLACES.find((p) => p.name.toLowerCase() === named.toLowerCase())
      : null;
    lat = match?.lat ?? city.center[0];
    lon = match?.lon ?? city.center[1];
  }

  const placeName = named || nearestListedPlace({ lat, lon })?.name || city.name;
  const nearby = nearbyPlaces(lat, lon, 30);
  const speeds = generateDemoSpeeds(
    new Date().toISOString().slice(0, 10),
    "10:00",
    "normal",
  );

  const roads: string[] = [];
  const road_details: InfluencePayload["road_details"] = [];
  const indices: number[] = [];

  nearby.forEach((p) => {
    const idx = placeSpeedIndex(p, speeds.length);
    const highway = (p.area || "road").toLowerCase().slice(0, 8);
    const placeBit = p.name.slice(0, 14);
    const label = `${placeBit} · ${highway} · R${idx}`;
    roads.push(label);
    indices.push(idx);
    road_details.push({
      index: idx,
      label,
      place: p.name,
      highway,
      lat: p.lat,
      lon: p.lon,
      distance_km: p.distance_km ?? null,
      speed: speeds[idx] ?? null,
    });
  });

  const n = indices.length;
  const matrix: number[][] = [];
  for (let a = 0; a < n; a++) {
    const row: number[] = [];
    let total = 0;
    const ia = indices[a];
    for (let b = 0; b < n; b++) {
      const ib = indices[b];
      const dist =
        ia < speeds.length && ib < speeds.length
          ? Math.abs(speeds[ia] - speeds[ib])
          : 10;
      const adj = Math.abs(a - b) <= 2 ? 1.35 : 0.55;
      const selfW = a === b ? 0.25 : 1;
      const v = Math.exp(-dist / 8) * adj * selfW;
      row.push(v);
      total += v;
    }
    matrix.push(row.map((v) => (total ? v / total : 0)));
  }

  return {
    city: city.name,
    place: placeName,
    roads,
    road_details,
    indices,
    matrix,
    origin: { lat, lon, edge: input.edge ?? null, place: placeName },
    legend: {
      what: `Heat map for roads near ${placeName} in ${city.name}. Each colored box is a pair of roads. Darker orange = stronger connection. Lighter = weaker connection. Darker does not mean more traffic jam.`,
      darker: "Stronger connection between those two roads",
      lighter: "Weaker connection",
    },
    source: "studio",
  };
}

export function fallbackForApi(apiPath: string, search: URLSearchParams) {
  if (apiPath === "/api/places") {
    return fallbackPlacesSearch(
      search.get("q") || "",
      num(search.get("lat")),
      num(search.get("lon")),
      Math.max(1, Math.min(50, num(search.get("limit"), 25) ?? 25)),
    );
  }
  if (apiPath === "/api/places/catalog") {
    return {
      count: TVM_PLACES.length,
      source: "studio",
      file: "TVM_PLACES",
    };
  }
  if (apiPath === "/api/nearest") {
    const lat = num(search.get("lat"));
    const lon = num(search.get("lon"));
    if (lat == null || lon == null) {
      return { error: "lat and lon are required." };
    }
    return fallbackNearest(lat, lon);
  }
  if (apiPath === "/api/influence") {
    return fallbackInfluence({
      lat: num(search.get("lat")),
      lon: num(search.get("lon")),
      edge: num(search.get("edge")),
      place: search.get("place"),
    });
  }
  return null;
}

export function isStudioApi(apiPath: string) {
  return (
    apiPath === "/api/places" ||
    apiPath === "/api/places/catalog" ||
    apiPath === "/api/nearest" ||
    apiPath === "/api/influence"
  );
}
