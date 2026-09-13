const VEHICLE_CLASSES = new Set(["bicycle", "car", "motorcycle", "bus", "truck"]);

const TF_SRC = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
const COCO_SRC =
  "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js";

type CocoPrediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

type CocoModel = {
  detect: (img: HTMLImageElement) => Promise<CocoPrediction[]>;
};

type CocoSsdGlobal = {
  load: (opts?: { base?: string }) => Promise<CocoModel>;
};

declare global {
  interface Window {
    cocoSsd?: CocoSsdGlobal;
    tf?: { ready: () => Promise<void> };
  }
}

let modelPromise: Promise<CocoModel> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await loadScript(TF_SRC);
      await loadScript(COCO_SRC);
      await window.tf?.ready();
      if (!window.cocoSsd) {
        throw new Error("On-device detector failed to load.");
      }
      return window.cocoSsd.load({ base: "lite_mobilenet_v2" });
    })();
  }
  return modelPromise;
}

function fileToImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the uploaded image."));
    };
    img.src = url;
  });
}

function drawDetections(img: HTMLImageElement, hits: CocoPrediction[]) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw detections.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  hits.forEach((hit) => {
    const [x, y, w, h] = hit.bbox;
    ctx.strokeStyle = "#f43e01";
    ctx.lineWidth = Math.max(2, canvas.width / 400);
    ctx.strokeRect(x, y, w, h);

    const label = `${hit.class} ${Math.round(hit.score * 100)}%`;
    ctx.font = `${Math.max(12, canvas.width / 64)}px ui-monospace, monospace`;
    const pad = 4;
    const tw = ctx.measureText(label).width;
    const th = 16;
    ctx.fillStyle = "#f43e01";
    ctx.fillRect(x, Math.max(0, y - th - pad), tw + pad * 2, th + pad);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, x + pad, Math.max(12, y - pad));
  });

  return canvas.toDataURL("image/jpeg", 0.88);
}

export type BrowserDetectResult = {
  vehicle_count: number;
  annotated_image_url: string;
  by_class: Record<string, number>;
};

export async function detectVehiclesInBrowser(file: File): Promise<BrowserDetectResult> {
  const model = await getModel();
  const img = await fileToImage(file);
  const predictions = await model.detect(img);
  const hits = predictions.filter(
    (p) => VEHICLE_CLASSES.has(p.class) && p.score >= 0.4,
  );
  const by_class: Record<string, number> = {};
  hits.forEach((h) => {
    by_class[h.class] = (by_class[h.class] || 0) + 1;
  });
  return {
    vehicle_count: hits.length,
    annotated_image_url: drawDetections(img, hits),
    by_class,
  };
}
