"use client";

import { FormEvent, useState } from "react";
import { formatError } from "@/lib/format-error";
import { PlacePair } from "@/components/place-pair";
import type { Place } from "@/lib/places";

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
    setResult("Uploading image and running YOLOv8 detection...");
    if (!file) {
      setResult("❌ Please choose an image first.");
      return;
    }
    setBusy(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/yolo_detect", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const count = data.vehicle_count;
      const annotatedUrl = data.annotated_image_url as string | undefined;
      let text = "✅ YOLOv8 Detection Complete\n\n";
      if (count !== undefined) text += `Detected vehicles: ${count}\n`;
      if (place) {
        text += `Location: ${place.name} (${place.area}) · road R${place.edge_index}\n`;
      }
      if (annotatedUrl) {
        setDetectedUrl(annotatedUrl);
        text += "\nShowing annotated image on the right.";
      }
      setResult(text);
    } catch (err) {
      setResult("❌ Error: " + formatError(err));
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
          <img id="previewDetected" src={detectedUrl} alt="YOLO annotated" className="preview-img w-full rounded-[10px]" />
        )}
      </div>
    </div>
  );
}
