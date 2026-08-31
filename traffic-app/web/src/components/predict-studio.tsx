"use client";

import { useMemo, useState } from "react";
import { formatError } from "@/lib/format-error";
import { PlacePair } from "@/components/place-pair";
import { TVM_PLACES, type Place } from "@/lib/places";

type LocationSpeed = {
  id?: string;
  name: string;
  area: string;
  speed: number | null;
  lat?: number;
  lon?: number;
};

type HybridResponse = {
  error?: string;
  locations?: LocationSpeed[];
  speeds?: number[];
  unit?: string;
  date?: string;
  time?: string;
  scenario?: string;
};

type PpoResponse = {
  error?: string;
  start?: number;
  end?: number;
  date?: string;
  time?: string;
  scenario?: string;
  recommended_route_index?: number;
  predicted_speed?: number;
  note?: string;
  start_name?: string;
  end_name?: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function speedColor(speed: number) {
  if (speed >= 25) return "text-[#16a34a]";
  if (speed >= 18) return "text-[#d97706]";
  return "text-ember";
}

function speedLabel(speed: number) {
  if (speed >= 25) return "Clear";
  if (speed >= 18) return "Moderate";
  return "Congested";
}

function fallbackLocations(speeds: number[]): LocationSpeed[] {
  return TVM_PLACES.map((p, i) => {
    let h = 0;
    for (const c of p.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const idx = p.edge_index > 0 ? p.edge_index : h % Math.max(speeds.length, 1);
    return {
      id: p.id,
      name: p.name,
      area: p.area,
      lat: p.lat,
      lon: p.lon,
      speed: speeds.length ? Number(speeds[idx % speeds.length]) : null,
    };
  });
}

export function PredictStudio() {
  const [date, setDate] = useState(todayIso);
  const [time, setTime] = useState("10:00");
  const [scenario, setScenario] = useState("normal");
  const [start, setStart] = useState<Place | null>(null);
  const [end, setEnd] = useState<Place | null>(null);
  const [hybridMeta, setHybridMeta] = useState("");
  const [locations, setLocations] = useState<LocationSpeed[]>([]);
  const [ppoText, setPpoText] = useState("");
  const [busy, setBusy] = useState<"hybrid" | "ppo" | null>(null);

  const ranked = useMemo(() => {
    return [...locations].sort((a, b) => a.name.localeCompare(b.name));
  }, [locations]);

  const chart = useMemo(() => {
    const sample = ranked.filter((r) => r.speed != null);
    if (sample.length < 2) return "";
    const values = sample.map((r) => Number(r.speed));
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * 640;
        const y = 160 - ((v - min) / (max - min || 1)) * 130;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }, [ranked]);

  async function runHybrid() {
    if (!date) {
      alert("Please select a valid date.");
      return;
    }
    if (!time) {
      alert("Please select a valid time.");
      return;
    }
    setBusy("hybrid");
    try {
      const res = await fetch("/api/hybrid_predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          scenario,
        }),
      });
      const data = (await res.json()) as HybridResponse;
      if (data.error) {
        setHybridMeta("❌ Error: " + data.error);
        setLocations([]);
        return;
      }
      const next =
        data.locations && data.locations.length
          ? data.locations
          : fallbackLocations(data.speeds || []);
      setLocations(next);
      setHybridMeta(
        `Hybrid GAT–LSTM · ${next.length} places · ${data.scenario} · ${data.date} ${data.time}`,
      );
    } catch (err) {
      setHybridMeta("❌ Error: " + formatError(err));
      setLocations([]);
    } finally {
      setBusy(null);
    }
  }

  async function runPpo() {
    if (!start || !end) {
      alert("Choose a start place and an end place.");
      return;
    }
    if (!date) {
      alert("Please select a valid date.");
      return;
    }
    if (!time) {
      alert("Please select a valid time.");
      return;
    }
    setBusy("ppo");
    try {
      const res = await fetch("/api/ppo_route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: start.edge_index,
          end: end.edge_index,
          start_lat: start.lat,
          start_lon: start.lon,
          end_lat: end.lat,
          end_lon: end.lon,
          start_name: start.name,
          end_name: end.name,
          date,
          time,
          scenario,
        }),
      });
      const data = (await res.json()) as PpoResponse;
      if (data.error) {
        setPpoText("❌ Error: " + data.error);
        return;
      }
      const startLoc = locations.find((l) => l.id === start.id);
      const endLoc = locations.find((l) => l.id === end.id);
      setPpoText(
        [
          "PPO route recommendation",
          "",
          `From  : ${data.start_name || start.name} (${start.area})`,
          `To    : ${data.end_name || end.name} (${end.area})`,
          `When  : ${data.date} ${data.time} · ${data.scenario}`,
          "",
          startLoc?.speed != null
            ? `Start speed : ${Number(startLoc.speed).toFixed(1)} km/h`
            : null,
          endLoc?.speed != null
            ? `End speed   : ${Number(endLoc.speed).toFixed(1)} km/h`
            : null,
          `Best speed  : ${Number(data.predicted_speed).toFixed(1)} km/h`,
          "",
          `Best road between ${start.name} and ${end.name} based on predicted speed.`,
        ]
          .filter(Boolean)
          .join("\n"),
      );
    } catch (err) {
      setPpoText("❌ Error: " + formatError(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[10px] bg-surface p-6 md:p-8">
        <p className="eyebrow">Hybrid GAT-LSTM</p>
        <h2 className="mt-2 text-[28px] font-light tracking-[-0.02em]">
          Multi-road prediction
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-stone">
          Speeds are predicted per named place in Thiruvananthapuram, not anonymous road indices.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
              Time
            </span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"
            />
          </label>
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
        </div>
        <button
          type="button"
          onClick={runHybrid}
          disabled={busy !== null}
          className="mt-6 rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white hover:bg-ember-hover disabled:opacity-60"
        >
          {busy === "hybrid" ? "Predicting…" : "Predict"}
        </button>
        {hybridMeta && (
          <p className="mt-6 font-mono text-[12px] text-stone">{hybridMeta}</p>
        )}
        {chart && (
          <svg viewBox="0 0 640 180" className="mt-4 w-full">
            <path d={chart} fill="none" stroke="#f43e01" strokeWidth="2.2" />
          </svg>
        )}
        {ranked.length > 0 && (
          <div className="mt-6 max-h-[420px] overflow-auto rounded-[10px] border border-khaki">
            {ranked.map((row) => {
              const speed = row.speed == null ? null : Number(row.speed);
              return (
                <div
                  key={row.id || row.name}
                  className="flex items-center justify-between gap-4 border-b border-khaki bg-bone px-4 py-3 last:border-0"
                >
                  <div>
                    <p className="text-[16px] font-medium tracking-[-0.02em]">{row.name}</p>
                    <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-ash">
                      {row.area}
                    </p>
                  </div>
                  {speed == null ? (
                    <p className="font-mono text-[13px] text-ash">—</p>
                  ) : (
                    <div className="text-right">
                      <p className={`font-mono text-[18px] ${speedColor(speed)}`}>
                        {speed.toFixed(1)} km/h
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ash">
                        {speedLabel(speed)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[10px] bg-surface p-6 md:p-8">
        <p className="eyebrow">PPO</p>
        <h2 className="mt-2 text-[28px] font-light tracking-[-0.02em]">
          Recommended route
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] text-stone">
          Choose a start place and an end place. PPO picks the fastest predicted corridor between them.
        </p>
        <div className="mt-8">
          <PlacePair start={start} end={end} onStart={setStart} onEnd={setEnd} />
        </div>
        <button
          type="button"
          onClick={runPpo}
          disabled={busy !== null}
          className="mt-6 rounded-pill bg-obsidian px-5 py-2.5 text-[15px] text-on-dark disabled:opacity-60"
        >
          {busy === "ppo" ? "Routing…" : "Recommend Route"}
        </button>
        {ppoText && (
          <pre className="mt-6 overflow-auto rounded-[5px] bg-bone p-4 font-mono text-[12px] leading-relaxed text-stone whitespace-pre-wrap">
            {ppoText}
          </pre>
        )}
      </section>
    </div>
  );
}
