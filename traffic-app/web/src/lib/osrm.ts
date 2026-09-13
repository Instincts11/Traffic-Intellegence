import { haversineKm } from "@/lib/places";

export type DrivingRoute = {
  id: string;
  distanceKm: number;
  durationMin: number;
  path: [number, number][];
};

function toLatLon(coords: [number, number][]): [number, number][] {
  return coords.map(([lon, lat]) => [lat, lon]);
}

export async function fetchDrivingRoutes(
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
): Promise<DrivingRoute[]> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start.lon},${start.lat};${end.lon},${end.lat}` +
    `?overview=full&geometries=geojson&alternatives=true&steps=false`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
  const data = (await res.json()) as {
    code?: string;
    routes?: {
      distance: number;
      duration: number;
      geometry?: { coordinates?: [number, number][] };
    }[];
  };
  if (data.code && data.code !== "Ok") throw new Error(data.code);
  const routes = (data.routes || [])
    .map((r, i) => {
      const coords = r.geometry?.coordinates || [];
      if (coords.length < 2) return null;
      return {
        id: `osrm-${i}`,
        distanceKm: Math.round((r.distance / 1000) * 10) / 10,
        durationMin: Math.round((r.duration / 60) * 10) / 10,
        path: toLatLon(coords),
      } as DrivingRoute;
    })
    .filter((row): row is DrivingRoute => Boolean(row));
  if (!routes.length) throw new Error("OSRM returned no geometry");
  return routes;
}

export function pathLengthKm(path: [number, number][]) {
  let km = 0;
  for (let i = 1; i < path.length; i++) {
    km += haversineKm(path[i - 1][0], path[i - 1][1], path[i][0], path[i][1]);
  }
  return Math.round(km * 10) / 10;
}
