"use client";

import { useState } from "react";
import { city } from "@/lib/city";
import { formatError } from "@/lib/format-error";
import { PlacePair } from "@/components/place-pair";
import type { Place } from "@/lib/places";

type RoadDetail = {
  index: number;
  label: string;
  place?: string | null;
  highway?: string | null;
  distance_km?: number | null;
  speed?: number | null;
};

export function InfluenceStudio() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [roads, setRoads] = useState<string[]>([]);
  const [details, setDetails] = useState<RoadDetail[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [scale, setScale] = useState({ min: 0, max: 1 });
  const [place, setPlace] = useState<Place | null>(null);
  const [focusPlace, setFocusPlace] = useState(city.name);
  const [legend, setLegend] = useState<string | null>(null);

  async function load() {
    setBusy(true);
    setStatus("Fetching location-specific influence heat map…");
    setMatrix([]);
    try {
      const params = new URLSearchParams();
      if (place) {
        params.set("lat", String(place.lat));
        params.set("lon", String(place.lon));
        params.set("edge", String(place.edge_index));
        params.set("place", place.name);
      }
      const res = await fetch(`/api/influence?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const nextRoads: string[] = data.roads || [];
      const nextMatrix: number[][] = data.matrix || [];
      const nextDetails: RoadDetail[] = data.road_details || [];
      if (!nextRoads.length || !nextMatrix.length) {
        setStatus("No influence data returned.");
        return;
      }
      let min = Infinity;
      let max = -Infinity;
      nextMatrix.forEach((row) => {
        row.forEach((v) => {
          if (typeof v === "number") {
            if (v < min) min = v;
            if (v > max) max = v;
          }
        });
      });
      if (!isFinite(min) || !isFinite(max)) {
        min = 0;
        max = 1;
      }
      setRoads(nextRoads);
      setDetails(nextDetails);
      setMatrix(nextMatrix);
      setScale({ min, max });
      setFocusPlace(data.place || place?.name || city.name);
      setLegend(data.legend?.what || null);
      setStatus(
        `✅ Heat map for ${data.place || place?.name || city.name} · ${nextRoads.length} nearest roads in ${data.city || city.name}.`,
      );
    } catch (err) {
      setStatus("❌ Error: " + formatError(err));
    } finally {
      setBusy(false);
    }
  }

  const range = scale.max - scale.min || 1;

  return (
    <div className="rounded-[10px] bg-surface p-6 md:p-8">
      <p className="eyebrow">{city.name} · simple guide</p>
      <h2 className="mt-2 text-[28px] font-light tracking-[-0.02em]">
        Road connection heat map
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] text-stone">
        This page shows which roads near your place are linked in the traffic
        model. Search a place, load the heat map, then read the colors.
      </p>

      <div className="mt-6 rounded-[8px] border border-[#f5c4b0] bg-[#fde4da] px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#9e2701]">
          How to read one box
        </p>
        <p className="mt-2 text-[16px] font-medium text-[#2a2a25]">
          Row name = road being affected · Column name = road that affects it
        </p>
        <p className="mt-1 text-[14px] text-[#5c4038]">
          Higher number + deeper orange = stronger link. Lower number + pale box =
          weaker link. Not traffic jam.
        </p>
        <div className="mt-4 flex items-center gap-3 text-[12px] font-mono text-[#7a5248]">
          <span>Weaker (pale)</span>
          <span
            className="h-4 flex-1 max-w-[220px] rounded-sm"
            style={{
              background:
                "linear-gradient(to right, #fde8df, #f43e01, #9e2701)",
            }}
          />
          <span>Stronger (dark)</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[8px] border border-khaki bg-bone px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ash">
            What this page does
          </p>
          <p className="mt-1 text-[14px] text-stone">
            Finds 30 roads near your place and shows how strongly they connect to
            each other.
          </p>
        </div>
        <div className="rounded-[8px] border border-khaki bg-bone px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ash">
            How to read the table
          </p>
          <p className="mt-1 text-[14px] text-stone">
            Each row and column is a road. One colored box = one pair of roads.
          </p>
        </div>
        <div className="rounded-[8px] border border-khaki bg-bone px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-ash">
            Not the Map page
          </p>
          <p className="mt-1 text-[14px] text-stone">
            Map page colors = speed. This page colors = connection strength only.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PlacePair
          start={place}
          end={null}
          onStart={setPlace}
          onEnd={() => undefined}
          showEnd={false}
          startLabel={`Place in ${city.name}`}
        />
      </div>
      <button
        id="loadInfluence"
        type="button"
        onClick={load}
        disabled={busy}
        className="mt-6 rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white hover:bg-ember-hover disabled:opacity-60"
      >
        {busy ? "Loading…" : "Load heat map"}
      </button>
      <pre
        id="influenceStatus"
        className="mt-4 rounded-[5px] bg-bone p-4 font-mono text-[12px] text-stone whitespace-pre-wrap"
      >
        {status ||
          `Search a place in ${city.name} (example: Palayam), then click Load heat map.`}
      </pre>

      {legend && (
        <p className="mt-4 max-w-3xl text-[14px] text-stone">{legend}</p>
      )}

      {matrix.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow">Showing roads near</p>
          <h3 className="mt-1 text-[22px] font-light tracking-[-0.02em]">
            {focusPlace}
          </h3>
          <p className="mt-2 text-[14px] text-stone">
            {roads.length} roads · look for dark orange boxes = strongest links
          </p>
          <div className="mt-3 flex items-center gap-3 text-[12px] font-mono text-ash">
            <span>Weaker (pale)</span>
            <span
              className="h-3 flex-1 max-w-[180px] rounded-sm"
              style={{
                background:
                  "linear-gradient(to right, #fde8df, #f43e01, #9e2701)",
              }}
            />
            <span>Stronger (dark)</span>
          </div>
        </div>
      )}

      <div id="heatmapContainer" className="heatmap mt-6 overflow-auto">
        {matrix.length > 0 && (
          <table className="min-w-max border-collapse text-[11px] font-mono">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-bone px-2 py-1 text-left text-ash">
                  ↓ influenced · influencer →
                </th>
                {roads.map((r, i) => (
                  <th
                    key={`col-${details[i]?.index ?? i}-${i}`}
                    className="max-w-[88px] truncate px-2 py-1 font-medium text-ash"
                    title={r}
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={`row-${details[i]?.index ?? i}-${i}`}>
                  <th
                    className="sticky left-0 z-10 max-w-[140px] truncate bg-bone px-2 py-1 text-left font-medium text-stone"
                    title={
                      details[i]
                        ? `${details[i].place || details[i].label} · ${details[i].highway || "road"} · R${details[i].index}`
                        : roads[i]
                    }
                  >
                    {roads[i] || `R${i}`}
                  </th>
                  {row.map((val, j) => {
                    const v = typeof val === "number" ? val : 0;
                    const norm = Math.min(1, Math.max(0, (v - scale.min) / range));
                    // Pale peach (weak) → deep ember (strong) — opaque so dark theme won't invert
                    const r = Math.round(253 - norm * (253 - 158));
                    const g = Math.round(232 - norm * (232 - 39));
                    const b = Math.round(223 - norm * (223 - 1));
                    return (
                      <td
                        key={`cell-${i}-${j}`}
                        className="px-2 py-1 text-center"
                        title={`${roads[j] || "column"} affects ${roads[i] || "row"} → ${v.toFixed(3)}`}
                        style={{
                          backgroundColor: `rgb(${r}, ${g}, ${b})`,
                          color: norm > 0.55 ? "#fff7f2" : "#2a2a25",
                        }}
                      >
                        {v.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {details.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow">Roads in this heat map</p>
          <div className="mt-3 max-h-[280px] overflow-auto rounded-[8px] border border-khaki">
            {details.map((d, i) => (
              <div
                key={`detail-${d.index}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-khaki bg-bone px-4 py-2.5 last:border-0"
              >
                <div>
                  <p className="text-[15px] font-medium">{d.place || d.label}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ash">
                    {d.highway || "road"} · R{d.index}
                    {d.distance_km != null
                      ? ` · ${Number(d.distance_km).toFixed(2)} km from focus`
                      : ""}
                  </p>
                </div>
                {d.speed != null && (
                  <p className="font-mono text-[14px] text-ember">
                    {Number(d.speed).toFixed(1)} km/h
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
