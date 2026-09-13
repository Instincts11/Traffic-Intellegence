import { NextResponse } from "next/server";
import { fallbackForApi, isStudioApi } from "@/lib/studio-fallback";

export const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";

const DOWN = {
  error:
    "Flask backend is not running. In a second terminal: cd traffic-app && python app.py (http://127.0.0.1:5000).",
};

const PROXY_TIMEOUT_MS = 8000;
const STUDIO_TIMEOUT_MS = 800;

function unavailable(
  apiPath: string,
  request: Request,
  extra?: Record<string, unknown> | null,
) {
  const payload = fallbackForApi(apiPath, new URL(request.url).searchParams, extra);
  if (!payload) return NextResponse.json(DOWN, { status: 503 });
  if ("error" in payload && !("places" in payload) && !("matrix" in payload) && !("roads" in payload)) {
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

  let extra: Record<string, unknown> | null = null;

  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      const buf = Buffer.from(await request.arrayBuffer());
      init.body = buf;
      init.duplex = "half";
      try {
        extra = JSON.parse(buf.toString("utf8")) as Record<string, unknown>;
      } catch {
        extra = null;
      }
    }

    const res = await fetch(target, init);
    const type = (res.headers.get("content-type") || "").toLowerCase();
    const body = await res.arrayBuffer();

    if (res.status >= 500) {
      if (isStudioApi(apiPath)) return unavailable(apiPath, request, extra);
      if (!type.includes("application/json")) {
        return NextResponse.json(DOWN, { status: 503 });
      }
    }

    const preview = Buffer.from(body.slice(0, 24)).toString("utf8").trimStart().toLowerCase();
    if (preview.startsWith("<!doctype") || preview.startsWith("<html")) {
      if (isStudioApi(apiPath)) return unavailable(apiPath, request, extra);
      return NextResponse.json(DOWN, { status: 503 });
    }

    const out = new NextResponse(body, { status: res.status });
    if (type) out.headers.set("content-type", type);
    return out;
  } catch {
    if (isStudioApi(apiPath)) return unavailable(apiPath, request, extra);
    return NextResponse.json(DOWN, { status: 503 });
  }
}
