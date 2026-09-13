"use client";

import { FormEvent, useState } from "react";
import { fetchJson } from "@/lib/api";
import { detectVehiclesInBrowser } from "@/lib/detect-browser";
import { formatError } from "@/lib/format-error";
import { PlacePair } from "@/components/place-pair";
import type { Place } from "@/lib/places";

type YoloResponse = {
  error?: string;
  vehicle_count?: number;
  annotated_image_url?: string;
};

function formatResult(
  count: number,
  place: Place | null,
  source: "api" | "browser",
  byClass?: Record<string, number>,
) {
  const lines = [
    source === "api"
      ? "✅ YOLOv8 Detection Complete"
      : "✅ Vehicle detection complete (on-device)",
    "",
    `Detected vehicles: ${count}`,
  ];
  if (byClass && Object.keys(byClass).length) {
    lines.push(
      Object.entries(byClass)
        .sort((a, b) => b[1] - a[1])
        .map(([name, n]) => `  ${name}: ${n}`)
        .join("\n"),
    );
  }
  if (place) {
    lines.push(`Location: ${place.name} (${place.area})`);
  }
  lines.push("", "Showing annotated image on the right.");
  return lines.filter(Boolean).join("\n");
}

export function DetectStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [detectedUrl, setDetectedUrl] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);

  function onFile(next: File | null) {
    setFile(next);
    setDetectedUrl("");
    if (!next) {
      setOriginalUrl("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setOriginalUrl(String(e.target?.result || ""));
    reader.readAsDataURL(next);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setResult("❌ Please choose an image first.");
      return;
    }
    setBusy(true);
    setDetectedUrl("");
    setResult("Uploading image and running vehicle detection…");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await fetchJson<YoloResponse>("/api/yolo_detect", {
        method: "POST",
        body: formData,
      }, 20000);
      const count = Number(data.vehicle_count || 0);
      if (data.annotated_image_url) setDetectedUrl(data.annotated_image_url);
      setResult(formatResult(count, place, "api"));
    } catch {
      try {
        setResult("Live API is unavailable. Running vehicle detection in your browser…");
        const local = await detectVehiclesInBrowser(file);
        setDetectedUrl(local.annotated_image_url);
        setResult(formatResult(local.vehicle_count, place, "browser", local.by_class));
      } catch (err) {
        setResult("❌ Error: " + formatError(err));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[10px] bg-surface p-6 md:p-8">
      <p className="eyebrow">YOLOv8</p>
      <h2 className="mt-2 text-[28px] font-light tracking-[-0.02em]">
        Upload image for detection
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] text-stone">
        If the hosted detector is offline, this page runs an on-device model in your browser.
      </p>
      <div className="mt-8">
        <PlacePair
          start={place}
          end={null}
          onStart={setPlace}
          onEnd={() => undefined}
          showEnd={false}
          startLabel="Camera location"
        />
      </div>
      <form id="uploadForm" onSubmit={onSubmit} className="mt-6 flex flex-wrap items-end gap-3">
        <label className="block flex-1">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
            Image
          </span>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            required
            onChange={(e) => onFile(e.target.files?.[0] || null)}
            className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px]"
          />
        </label>
        <button
          className="rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white hover:bg-ember-hover disabled:opacity-60"
          type="submit"
          disabled={busy}
        >
          {busy ? "Detecting…" : "Detect"}
        </button>
      </form>
      {result && (
        <pre
          id="uploadResult"
          className="mt-6 rounded-[5px] bg-bone p-4 font-mono text-[12px] leading-relaxed text-stone whitespace-pre-wrap"
        >
          {result}
        </pre>
      )}
      <div className="img-preview-wrapper mt-6 grid gap-4 md:grid-cols-2">
        {originalUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img id="previewOriginal" src={originalUrl} alt="Original upload" className="preview-img w-full rounded-[10px]" />
        )}
        {detectedUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img id="previewDetected" src={detectedUrl} alt="Detected vehicles" className="preview-img w-full rounded-[10px]" />
        )}
      </div>
    </div>
  );
}
