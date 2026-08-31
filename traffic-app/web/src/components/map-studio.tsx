"use client";



import dynamic from "next/dynamic";

import { useEffect, useMemo, useState } from "react";

import { city } from "@/lib/city";

import { formatError } from "@/lib/format-error";

import type { MapRoad, PathOverlay } from "@/components/traffic-leaflet";

import { PlacePair } from "@/components/place-pair";

import type { Place } from "@/lib/places";



const TrafficLeaflet = dynamic(

  () => import("@/components/traffic-leaflet").then((m) => m.TrafficLeaflet),

  {

    ssr: false,

    loading: () => (

      <div className="flex h-[480px] items-center justify-center rounded-[10px] bg-parchment font-mono text-[12px] tracking-[0.12em] uppercase text-stone">

        Loading OpenStreetMap

      </div>

    ),

  },

);



type RouteAlternative = {

  id: string;

  label: string;

  path_line: [number, number][];

  distance_km: number;

  eta_min: number;

  edge_count: number;

  color: string;

  selected?: boolean;

};



type RoutePayload = {

  start_name: string;

  end_name: string;

  start_lat?: number;

  start_lon?: number;

  end_lat?: number;

  end_lon?: number;

  scenario?: string;

  route_mode?: string;

  center: [number, number];

  zoom: number;

  best_index?: number;

  best_speed?: number;

  best_label?: string;

  roads?: MapRoad[];

  route_line?: [number, number][];

  path_line?: [number, number][];

  distance_km?: number;

  direct_km?: number;

  eta_min?: number;

  road_count?: number;

  alternatives?: RouteAlternative[];

};



type Payload = {

  error?: string;

  center?: [number, number];

  zoom?: number;

  best_index?: number;

  best_speed?: number;

  best_label?: string;

  roads?: MapRoad[];

  route?: RoutePayload | null;

  edges?: number;

  nodes?: number;

};



const ROUTE_MODES = [

  { id: "fastest", label: "Fastest (traffic-aware)" },

  { id: "shortest", label: "Shortest distance" },

  { id: "balanced", label: "Balanced" },

] as const;



export function MapStudio() {

  const [start, setStart] = useState<Place | null>(null);

  const [end, setEnd] = useState<Place | null>(null);

  const [scenario, setScenario] = useState("normal");

  const [routeMode, setRouteMode] = useState("fastest");

  const [showAlternatives, setShowAlternatives] = useState(true);

  const [status, setStatus] = useState("Loading Thiruvananthapuram network…");

  const [busy, setBusy] = useState(false);

  const [payload, setPayload] = useState<Payload>({

    center: city.center,

    zoom: city.zoom,

    roads: [],

  });



  async function loadBase() {

    try {

      const res = await fetch("/api/network");

      const data = (await res.json()) as Payload;

      if (data.error) throw new Error(data.error);

      setPayload((prev) => ({ ...prev, ...data, route: prev.route }));

      setStatus(

        `✅ ${city.name} OSM graph · ${data.edges ?? data.roads?.length ?? 0} edges. Select start & end, then generate.`,

      );

    } catch (err) {

      setStatus("❌ Error: " + formatError(err));

    }

  }



  async function generate() {

    if (!start || !end) {

      alert("Choose a start place and an end place first.");

      return;

    }

    setBusy(true);

    try {

      const res = await fetch("/api/route_map_full", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          start_lat: start.lat,

          start_lon: start.lon,

          end_lat: end.lat,

          end_lon: end.lon,

          start_name: start.name,

          end_name: end.name,

          scenario,

          route_mode: routeMode,

          time: "10:00",

        }),

      });

      const data = (await res.json()) as Payload;

      if (data.error) {

        alert("Error: " + data.error);

        setStatus("❌ Error: " + data.error);

        return;

      }

      setPayload(data);

      const route = data.route;

      setStatus(

        route

          ? `✅ ${route.start_name} → ${route.end_name} · ${route.scenario ?? scenario} · ${route.distance_km ?? "—"} km (${route.eta_min ?? "—"} min) · direct ${route.direct_km ?? "—"} km`

          : `✅ ${city.name} traffic map generated.`,

      );

    } catch (err) {

      alert("Error: " + formatError(err));

      setStatus("❌ Error: " + formatError(err));

    } finally {

      setBusy(false);

    }

  }



  useEffect(() => {

    void loadBase();

  }, []);



  const hasFull = (payload.roads?.length ?? 0) > 0;

  const route = payload.route;

  const hasRoute =

    route &&

    ((route.path_line?.length ?? 0) >= 2 ||

      (route.route_line?.length ?? 0) >= 2);

  const directLine = useMemo(
    () =>
      start && end
        ? ([
            [start.lat, start.lon],
            [end.lat, end.lon],
          ] as [number, number][])
        : undefined,
    [start, end],
  );

  const placeMarkers = useMemo(
    () => [
      ...(start
        ? [{ lat: start.lat, lon: start.lon, label: `Start: ${start.name}`, color: "#16a34a" }]
        : []),
      ...(end
        ? [{ lat: end.lat, lon: end.lon, label: `End: ${end.name}`, color: "#111827" }]
        : []),
    ],
    [start, end],
  );



  const pathOverlays = useMemo((): PathOverlay[] => {

    if (!route?.alternatives?.length) {

      if (route?.path_line && route.path_line.length >= 2) {

        return [

          {

            id: route.route_mode ?? "primary",

            label: route.best_label ?? "Selected route",

            path: route.path_line,

            color: "#f43e01",

            selected: true,

          },

        ];

      }

      return [];

    }

    return route.alternatives

      .filter((alt) => showAlternatives || alt.selected)

      .map((alt) => ({

        id: alt.id,

        label: `${alt.label} · ${alt.distance_km} km · ${alt.eta_min} min`,

        path: alt.path_line,

        color: alt.color,

        selected: alt.selected,

      }));

  }, [route, showAlternatives]);



  return (

    <div className="rounded-[10px] bg-surface p-6 md:p-8">

      <p className="eyebrow">{city.region} · OSM drive graph</p>

      <h2 className="mt-2 text-[28px] font-light tracking-[-0.02em]">

        {city.name} road network

      </h2>

      <p className="mt-3 max-w-2xl text-[15px] text-stone">

        Pick start and end places, choose a scenario and routing strategy, then generate.

        You get the full city map plus a route view with start/end markers, the direct line,

        and up to three path options (shortest, fastest, balanced).

      </p>

      <div className="mt-8">

        <PlacePair start={start} end={end} onStart={setStart} onEnd={setEnd} />

      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <label className="block">

          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">

            Scenario

          </span>

          <select

            value={scenario}

            onChange={(e) => setScenario(e.target.value)}

            className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"

          >

            <option value="normal">Normal</option>

            <option value="rain">Rain</option>

            <option value="event">Event</option>

            <option value="accident">Accident</option>

            <option value="heavy">Heavy traffic</option>

            <option value="clear">Clear</option>

          </select>

        </label>

        <label className="block">

          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">

            Primary route

          </span>

          <select

            value={routeMode}

            onChange={(e) => setRouteMode(e.target.value)}

            className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"

          >

            {ROUTE_MODES.map((m) => (

              <option key={m.id} value={m.id}>

                {m.label}

              </option>

            ))}

          </select>

        </label>

      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">

        <button

          id="generate-map-btn"

          type="button"

          onClick={generate}

          disabled={busy || !start || !end}

          className="rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white hover:bg-ember-hover disabled:opacity-60"

        >

          {busy ? "Generating…" : "Generate maps"}

        </button>

        <label className="flex items-center gap-2 text-[14px] text-stone">

          <input

            type="checkbox"

            checked={showAlternatives}

            onChange={(e) => setShowAlternatives(e.target.checked)}

            className="rounded border-khaki"

          />

          Show all route options on map

        </label>

      </div>

      {status && (

        <pre className="mt-4 rounded-[5px] bg-bone p-4 font-mono text-[12px] text-stone whitespace-pre-wrap">

          {status}

        </pre>

      )}



      {hasFull && (

        <div className="mt-10">

          <p className="eyebrow">Full city</p>

          <h3 className="mt-1 text-[22px] font-light tracking-[-0.02em]">

            All predicted speeds · {city.name}

          </h3>

          <p className="mt-2 text-[14px] text-stone">

            {payload.best_label || "City-wide view"} ·{" "}

            {payload.best_speed != null

              ? `${Number(payload.best_speed).toFixed(1)} km/h (blue highlight)`

              : ""}

          </p>

          <div className="mt-4">

            <TrafficLeaflet

              mapKey="full-city"

              roads={payload.roads || []}

              center={payload.center || city.center}

              zoom={payload.zoom || city.zoom}

              bestIndex={payload.best_index}

              bestSpeed={payload.best_speed}

              bestLabel={payload.best_label}

              markers={placeMarkers}

              routeLine={directLine}

              height={480}

            />

          </div>

        </div>

      )}



      {directLine && start && end && (
        <div className="mt-10">
          <p className="eyebrow">Direct path</p>
          <h3 className="mt-1 text-[22px] font-light tracking-[-0.02em]">
            {start.name} → {end.name}
          </h3>
          <p className="mt-2 text-[14px] text-stone">
            Grey dashed line is the straight path between the two places. Green pin is
            start, black pin is end.
          </p>
          <div className="mt-4">
            <TrafficLeaflet
              mapKey={`direct-${start.name}-${end.name}`}
              roads={[]}
              center={[
                (start.lat + end.lat) / 2,
                (start.lon + end.lon) / 2,
              ]}
              zoom={13}
              markers={placeMarkers}
              routeLine={directLine}
              pathOnly
              fitToRoute
              height={420}
            />
          </div>
        </div>
      )}

      {hasRoute && route && (

        <div className="mt-10">

          <p className="eyebrow">Your route</p>

          <h3 className="mt-1 text-[22px] font-light tracking-[-0.02em]">

            {route.start_name} → {route.end_name}

          </h3>

          <p className="mt-2 text-[14px] text-stone">

            {route.scenario ?? scenario} · {route.distance_km ?? "—"} km driving ·{" "}

            {route.eta_min ?? "—"} min est. · direct {route.direct_km ?? "—"} km ·{" "}

            {route.road_count ?? route.roads?.length ?? 0} road segments

          </p>



          {route.alternatives && route.alternatives.length > 0 && (

            <div className="mt-4 grid gap-3 sm:grid-cols-3">

              {route.alternatives.map((alt) => (

                <div

                  key={alt.id}

                  className={`rounded-[8px] border px-4 py-3 ${

                    alt.selected

                      ? "border-ember bg-bone"

                      : "border-khaki bg-parchment"

                  }`}

                >

                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ash">

                    {alt.selected ? "Selected" : "Alternative"}

                  </p>

                  <p className="mt-1 text-[15px] font-medium">{alt.label}</p>

                  <p className="mt-1 font-mono text-[13px] text-stone">

                    {alt.distance_km} km · {alt.eta_min} min · {alt.edge_count} edges

                  </p>

                </div>

              ))}

            </div>

          )}



          <div className="mt-4">

            <TrafficLeaflet

              mapKey={`route-${route.start_name}-${route.end_name}-${route.route_mode}`}

              roads={route.roads ?? []}

              center={route.center}

              zoom={route.zoom}

              bestIndex={route.best_index}

              bestSpeed={route.best_speed}

              bestLabel={route.best_label}

              markers={placeMarkers}

              routeLine={directLine ?? route.route_line}

              pathOverlays={pathOverlays}

              pathOnly

              fitToRoute

              height={520}

            />

          </div>

          <p className="mt-3 text-[13px] text-stone">

            Gray dashed = direct distance. Colored dashed = driving routes. Green marker =

            start, black = end. Road colors follow predicted speed under the chosen scenario.

          </p>

        </div>

      )}

    </div>

  );

}


