const INPUT_SIZE = 640;
const CONF_THRES = 0.08;
const IOU_THRES = 0.5;
const ORT_VERSION = "1.21.0";
const ORT_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
const MODEL_URL = "/models/yolov8n.onnx";

const COCO_NAMES = [
  "person",
  "bicycle",
  "car",
  "motorcycle",
  "airplane",
  "bus",
  "train",
  "truck",
];

const VEHICLE_CLASS_IDS = new Set([1, 2, 3, 5, 7]);

type Detection = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

type OrtTensor = {
  data: Float32Array | number[];
  dims: number[];
};

type OrtSession = {
  inputNames: string[];
  outputNames: string[];
  run: (feeds: Record<string, unknown>) => Promise<Record<string, OrtTensor>>;
};

type OrtNS = {
  env: { wasm: { wasmPaths: string; numThreads: number; simd?: boolean } };
  Tensor: new (type: string, data: Float32Array, dims: number[]) => unknown;
  InferenceSession: { create: (path: string, opts?: object) => Promise<OrtSession> };
};

declare global {
  interface Window {
    ort?: OrtNS;
  }
}

let sessionPromise: Promise<OrtSession> | null = null;

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

async function getSession() {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      await loadScript(`${ORT_BASE}ort.min.js`);
      const ort = window.ort;
      if (!ort) throw new Error("ONNX Runtime failed to load.");
      ort.env.wasm.wasmPaths = ORT_BASE;
      ort.env.wasm.numThreads = 1;
      return ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ["wasm"],
      });
    })();
  }
  return sessionPromise;
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

function sourceSize(src: HTMLImageElement | HTMLCanvasElement) {
  if (src instanceof HTMLImageElement) {
    return { w: src.naturalWidth || src.width, h: src.naturalHeight || src.height };
  }
  return { w: src.width, h: src.height };
}

function letterbox(
  img: HTMLImageElement | HTMLCanvasElement,
  mode: "contain" | "cover" = "contain",
) {
  const { w: iw, h: ih } = sourceSize(img);
  const scale =
    mode === "cover"
      ? Math.max(INPUT_SIZE / iw, INPUT_SIZE / ih)
      : Math.min(INPUT_SIZE / iw, INPUT_SIZE / ih);
  const nw = Math.round(iw * scale);
  const nh = Math.round(ih * scale);
  const dx = (INPUT_SIZE - nw) / 2;
  const dy = (INPUT_SIZE - nh) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare the image.");
  ctx.fillStyle = "rgb(114,114,114)";
  ctx.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
  ctx.drawImage(img, dx, dy, nw, nh);

  const rgba = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
  const float = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);
  let p = 0;
  for (let c = 0; c < 3; c++) {
    for (let i = 0; i < INPUT_SIZE * INPUT_SIZE; i++) {
      float[p++] = rgba[i * 4 + c] / 255;
    }
  }
  return { float, scale, dx, dy, iw, ih };
}

function iou(a: Detection, b: Detection) {
  const ax2 = a.bbox[0] + a.bbox[2];
  const ay2 = a.bbox[1] + a.bbox[3];
  const bx2 = b.bbox[0] + b.bbox[2];
  const by2 = b.bbox[1] + b.bbox[3];
  const ix = Math.max(0, Math.min(ax2, bx2) - Math.max(a.bbox[0], b.bbox[0]));
  const iy = Math.max(0, Math.min(ay2, by2) - Math.max(a.bbox[1], b.bbox[1]));
  const inter = ix * iy;
  const union = a.bbox[2] * a.bbox[3] + b.bbox[2] * b.bbox[3] - inter;
  return union <= 0 ? 0 : inter / union;
}

function nms(hits: Detection[]) {
  const sorted = [...hits].sort((a, b) => b.score - a.score);
  const keep: Detection[] = [];
  for (const hit of sorted) {
    if (keep.every((k) => iou(hit, k) < IOU_THRES)) keep.push(hit);
  }
  return keep;
}

function parseOutput(
  tensor: OrtTensor,
  meta: { scale: number; dx: number; dy: number; iw: number; ih: number },
) {
  const dims = tensor.dims;
  const raw = tensor.data;
  const data = raw instanceof Float32Array ? raw : Float32Array.from(raw);

  let channels: number;
  let anchors: number;
  let planar = true;
  if (dims.length === 3) {
    if (dims[1] <= dims[2]) {
      channels = dims[1];
      anchors = dims[2];
      planar = true;
    } else {
      anchors = dims[1];
      channels = dims[2];
      planar = false;
    }
  } else {
    channels = 84;
    anchors = Math.floor(data.length / channels);
  }

  const numClasses = channels - 4;
  const hits: Detection[] = [];

  const at = (ch: number, i: number) =>
    planar ? data[ch * anchors + i] : data[i * channels + ch];

  for (let i = 0; i < anchors; i++) {
    let best = 0;
    let bestCls = 2;
    for (const c of VEHICLE_CLASS_IDS) {
      if (c >= numClasses) continue;
      const s = at(4 + c, i);
      if (s > best) {
        best = s;
        bestCls = c;
      }
    }
    if (best < CONF_THRES) continue;

    const cx = at(0, i);
    const cy = at(1, i);
    const w = at(2, i);
    const h = at(3, i);
    const x1 = (cx - w / 2 - meta.dx) / meta.scale;
    const y1 = (cy - h / 2 - meta.dy) / meta.scale;
    const x2 = (cx + w / 2 - meta.dx) / meta.scale;
    const y2 = (cy + h / 2 - meta.dy) / meta.scale;
    const bx = Math.max(0, Math.min(meta.iw, x1));
    const by = Math.max(0, Math.min(meta.ih, y1));
    const bw = Math.max(0, Math.min(meta.iw, x2) - bx);
    const bh = Math.max(0, Math.min(meta.ih, y2) - by);
    if (bw < 4 || bh < 4) continue;

    hits.push({
      bbox: [bx, by, bw, bh],
      class: COCO_NAMES[bestCls] || `class ${bestCls}`,
      score: best,
    });
  }

  return hits;
}

function cropCanvas(
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  enhance = false,
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop the image.");
  if (enhance) ctx.filter = "contrast(1.35) saturate(1.15) brightness(1.05)";
  ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function detectionWindows(w: number, h: number) {
  const windows: { x: number; y: number; w: number; h: number; cover: boolean }[] = [
    { x: 0, y: 0, w, h, cover: false },
  ];
  const cw = Math.round(w * 0.55);
  const ch = Math.round(h * 0.55);
  for (const y of [0, h - ch]) {
    for (const x of [0, w - cw]) {
      windows.push({ x, y, w: cw, h: ch, cover: true });
    }
  }
  windows.push(
    { x: Math.round(w * 0.08), y: Math.round(h * 0.52), w: Math.round(w * 0.5), h: Math.round(h * 0.48), cover: true },
    { x: Math.round(w * 0.18), y: Math.round(h * 0.58), w: Math.round(w * 0.42), h: Math.round(h * 0.42), cover: true },
    { x: Math.round(w * 0.22), y: Math.round(h * 0.62), w: Math.round(w * 0.36), h: Math.round(h * 0.38), cover: true },
  );
  return windows;
}

async function inferWindow(
  session: OrtSession,
  img: HTMLImageElement,
  win: { x: number; y: number; w: number; h: number; cover: boolean },
) {
  const ort = window.ort;
  if (!ort) throw new Error("ONNX Runtime failed to load.");
  const full =
    win.x === 0 && win.y === 0 && win.w === (img.naturalWidth || img.width) &&
    win.h === (img.naturalHeight || img.height);
  const src = full ? img : cropCanvas(img, win.x, win.y, win.w, win.h, true);
  const prepared = letterbox(src, win.cover ? "cover" : "contain");
  const input = new ort.Tensor("float32", prepared.float, [1, 3, INPUT_SIZE, INPUT_SIZE]);
  const feeds: Record<string, unknown> = {};
  feeds[session.inputNames[0] || "images"] = input;
  const out = await session.run(feeds);
  const hits = parseOutput(out[session.outputNames[0]], prepared);
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  return hits.map((hit) => {
    const x = Math.max(0, hit.bbox[0] + win.x);
    const y = Math.max(0, hit.bbox[1] + win.y);
    const w = Math.min(iw - x, hit.bbox[2]);
    const h = Math.min(ih - y, hit.bbox[3]);
    return { ...hit, bbox: [x, y, w, h] as Detection["bbox"] };
  });
}

function drawDetections(img: HTMLImageElement, hits: Detection[]) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw detections.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const font = Math.max(11, Math.round(canvas.width / 72));
  hits.forEach((hit) => {
    const [x, y, w, h] = hit.bbox;
    ctx.strokeStyle = "#f43e01";
    ctx.lineWidth = Math.max(2, canvas.width / 420);
    ctx.strokeRect(x, y, w, h);

    const label = `${hit.class} ${Math.round(hit.score * 100)}%`;
    ctx.font = `${font}px ui-monospace, monospace`;
    const pad = 3;
    const tw = ctx.measureText(label).width;
    const th = font + 4;
    const ly = Math.max(th, y);
    ctx.fillStyle = "#f43e01";
    ctx.fillRect(x, ly - th - pad, tw + pad * 2, th + pad);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, x + pad, ly - pad - 2);
  });

  return canvas.toDataURL("image/jpeg", 0.9);
}

export type BrowserDetectResult = {
  vehicle_count: number;
  annotated_image_url: string;
  by_class: Record<string, number>;
};

export async function detectVehiclesInBrowser(file: File): Promise<BrowserDetectResult> {
  const [session, img] = await Promise.all([getSession(), fileToImage(file)]);
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const all: Detection[] = [];
  for (const win of detectionWindows(iw, ih)) {
    const hits = await inferWindow(session, img, win);
    all.push(...hits);
  }
  const hits = nms(all);

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
