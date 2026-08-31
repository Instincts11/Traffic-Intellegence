"use client";

import { useEffect, useRef, useState } from "react";
import {
  nearestListedPlace,
  searchPlacesOsm,
  snapPlace,
  watchLiveLocation,
  type Place,
} from "@/lib/places";

const DEBOUNCE_MS = 350;

function PlaceField({
  label,
  value,
  query,
  onQuery,
  onPick,
  onLocate,
  locating,
  origin,
}: {
  label: string;
  value: Place | null;
  query: string;
  onQuery: (q: string) => void;
  onPick: (place: Place) => void;
  onLocate?: () => void;
  locating?: boolean;
  origin: { lat: number; lon: number } | null;
}) {
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const pickedRef = useRef(false);
  const reqId = useRef(0);

  // Debounce typing, then search OSM via Flask
  useEffect(() => {
    const typed = query.trim();
    if (pickedRef.current) {
      pickedRef.current = false;
      setDebouncedQuery("");
      setHits([]);
      setSearching(false);
      setOpen(false);
      return;
    }
    if (!typed) {
      setDebouncedQuery("");
      setHits([]);
      setSearching(false);
      setOpen(false);
      return;
    }
    setSearching(true);
    const t = window.setTimeout(() => {
      setDebouncedQuery(typed);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setHits([]);
      setSearching(false);
      return;
    }
    const id = ++reqId.current;
    setSearching(true);
    void searchPlacesOsm(q, origin, 25).then((rows) => {
      if (id !== reqId.current) return;
      setHits(rows);
      setSearching(false);
      setOpen(true);
    });
  }, [debouncedQuery, origin]);

  const showDropdown = open && debouncedQuery.trim().length > 0;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={box} className="relative">
      <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
        {label}
      </span>
      <div className="mt-2 flex gap-2">
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onFocus={() => {
            if (debouncedQuery.trim()) setOpen(true);
          }}
          placeholder="Search OSM places — e.g. Palayam, Technopark…"
          className="w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"
          autoComplete="off"
        />
        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="shrink-0 rounded-pill bg-[#2a2a25] px-3 py-2.5 text-[12px] text-[#f3f3ee]"
          >
            {locating ? "Locating…" : "My location"}
          </button>
        )}
      </div>
      {showDropdown && (
        <ul className="relative z-30 mt-1 max-h-80 overflow-auto rounded-[5px] border border-khaki bg-parchment shadow-lg">
          <li className="sticky top-0 border-b border-khaki bg-bone px-3 py-2 font-mono text-[10px] tracking-[0.12em] uppercase text-ash">
            {searching
              ? "Searching OpenStreetMap…"
              : `${hits.length} OSM match${hits.length === 1 ? "" : "es"}`}
          </li>
          {!searching && hits.length === 0 && (
            <li className="px-3 py-2.5 text-[13px] text-stone">
              No OSM places match “{debouncedQuery.trim()}”
            </li>
          )}
          {hits.map((p) => {
            const selected = value?.id === p.id;
            return (
              <li key={p.id} className="border-b border-khaki last:border-0">
                <button
                  type="button"
                  className={`flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left text-[14px] ${
                    selected
                      ? "bg-ember-soft text-ember-deep"
                      : "text-foreground hover:bg-ember-soft"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    pickedRef.current = true;
                    onPick(p);
                    onQuery(`${p.name} · ${p.area}`);
                    setOpen(false);
                    setDebouncedQuery("");
                    setHits([]);
                  }}
                >
                  <span>
                    <strong className="font-medium">{p.name}</strong>
                    <span className="ml-2 font-mono text-[11px] tracking-[0.08em] uppercase text-ash">
                      {p.area}
                      {p.source ? ` · ${p.source}` : ""}
                    </span>
                  </span>
                  {p.distance_km != null && (
                    <span className="font-mono text-[11px] text-ember">
                      {Number(p.distance_km).toFixed(1)} km
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Detail({ title, place }: { title: string; place: Place | null }) {
  if (!place) {
    return (
      <div className="rounded-[5px] border border-dashed border-khaki bg-bone px-4 py-3">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">{title}</p>
        <p className="mt-1 text-[14px] text-ash">Not selected yet</p>
      </div>
    );
  }
  return (
    <div className="rounded-[5px] border border-khaki bg-bone px-4 py-3">
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-ember">{title}</p>
      <p className="mt-1 text-[18px] font-medium tracking-[-0.02em]">{place.name}</p>
      <p className="mt-1 text-[14px] text-stone">{place.area}</p>
      <p className="mt-2 font-mono text-[12px] text-ash">
        {place.lat.toFixed(4)}, {place.lon.toFixed(4)}
        {place.source ? ` · ${place.source}` : ""}
        {place.distance_km != null ? ` · ${Number(place.distance_km).toFixed(1)} km from you` : ""}
      </p>
    </div>
  );
}

export function PlacePair({
  start,
  end,
  onStart,
  onEnd,
  showEnd = true,
  startLabel = "Start place",
  endLabel = "End place",
}: {
  start: Place | null;
  end: Place | null;
  onStart: (place: Place) => void;
  onEnd: (place: Place) => void;
  showEnd?: boolean;
  startLabel?: string;
  endLabel?: string;
}) {
  const [origin, setOrigin] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState("");
  const [locating, setLocating] = useState(false);
  const [startQ, setStartQ] = useState("");
  const [endQ, setEndQ] = useState("");
  const followGps = useRef(false);
  const stopWatch = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => stopWatch.current?.();
  }, []);

  async function pickStart(place: Place) {
    followGps.current = false;
    const snapped = await snapPlace(place);
    onStart(snapped);
  }

  async function pickEnd(place: Place) {
    const snapped = await snapPlace(place);
    onEnd(snapped);
  }

  function locate() {
    followGps.current = true;
    setLocating(true);
    setGpsStatus("Asking for live location…");
    stopWatch.current?.();
    stopWatch.current = watchLiveLocation(
      async (coords) => {
        setOrigin(coords);
        setLocating(false);
        const nearby = nearestListedPlace(coords);
        const mine: Place = {
          id: "gps",
          name: "My location",
          area: "GPS",
          lat: coords.lat,
          lon: coords.lon,
          edge_index: 0,
          distance_km: 0,
          source: "gps",
        };
        const snapped = await snapPlace(mine);
        if (followGps.current) {
          onStart(snapped);
          setStartQ(`${snapped.name} · GPS`);
          setGpsStatus(
            nearby
              ? `Live GPS on. Nearest listed place: ${nearby.name}.`
              : "Live GPS on.",
          );
        }
      },
      (message) => {
        setLocating(false);
        setGpsStatus(message);
      },
    );
  }

  return (
    <div>
      <div className={`grid gap-4 ${showEnd ? "md:grid-cols-2" : ""}`}>
        <PlaceField
          label={startLabel}
          value={start}
          query={startQ}
          onQuery={setStartQ}
          onPick={pickStart}
          onLocate={locate}
          locating={locating}
          origin={origin}
        />
        {showEnd && (
          <PlaceField
            label={endLabel}
            value={end}
            query={endQ}
            onQuery={setEndQ}
            onPick={pickEnd}
            origin={origin}
          />
        )}
      </div>
      <div className={`mt-4 grid gap-3 ${showEnd ? "md:grid-cols-2" : ""}`}>
        <Detail title={startLabel} place={start} />
        {showEnd && <Detail title={endLabel} place={end} />}
      </div>
      <p className="mt-3 font-mono text-[12px] text-ash">
        {gpsStatus ||
          "Type a place name. Results come from OpenStreetMap (Nominatim + Overpass), debounced while you type."}
      </p>
    </div>
  );
}
