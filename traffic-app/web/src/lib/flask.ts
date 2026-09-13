import { NextResponse } from "next/server";
import { fallbackForApi, isStudioApi } from "@/lib/studio-fallback";

export const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";

const DOWN = {
  error:
    "Flask backend is not running. In a second terminal: cd traffic-app && python app.py (http://127.0.0.1:5000).",
};

const PROXY_TIMEOUT_MS = 8000;
const STUDIO_TIMEOUT_MS = 800;

function studioJson(apiPath: string, request: Request) {
  return fallbackForApi(apiPath, new URL(request.url).searchParams);
}

function unavailable(apiPath: string, request: Request) {
  const payload = studioJson(apiPath, request);
  if (!payload) return NextResponse.json(DOWN, { status: 503 });
  if ("error" in payload && !("places" in payload) && !("matrix" in payload)) {
    return NextResponse.json(payload, { status: 400 });
  }
  return NextResponse.json(payload);
}

export async function proxyFlask(request: Request, apiPath: string) {
  const target = `${FLASK_URL}${apiPath}${new URL(request.url).search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const timeoutMs = isStudioApi(apiPath) ? STUDIO_TIMEOUT_MS : PROXY_TIMEOUT_MS;
  const init: RequestInit & { duplex?: string } = {
    method: request.method,
    headers,
    signal: AbortSignal.timeout(timeoutMs),
  };

  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = Buffer.from(await request.arrayBuffer());
      init.duplex = "half";
    }

    const res = await fetch(target, init);
    const type = (res.headers.get("content-type") || "").toLowerCase();
    const body = await res.arrayBuffer();

    if (res.status >= 500) {
      if (isStudioApi(apiPath)) return unavailable(apiPath, request);
      if (!type.includes("application/json")) {
        return NextResponse.json(DOWN, { status: 503 });
      }
    }

    const preview = Buffer.from(body.slice(0, 24)).toString("utf8").trimStart().toLowerCase();
    if (preview.startsWith("<!doctype") || preview.startsWith("<html")) {
      if (isStudioApi(apiPath)) return unavailable(apiPath, request);
      return NextResponse.json(DOWN, { status: 503 });
    }

    const out = new NextResponse(body, { status: res.status });
    if (type) out.headers.set("content-type", type);
    return out;
  } catch {
    if (isStudioApi(apiPath)) return unavailable(apiPath, request);
    return NextResponse.json(DOWN, { status: 503 });
  }
}
