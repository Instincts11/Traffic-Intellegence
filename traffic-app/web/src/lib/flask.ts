import { NextResponse } from "next/server";

export const FLASK_URL = process.env.FLASK_URL || "http://127.0.0.1:5000";

const DOWN = {
  error:
    "Flask backend is not running. In a second terminal: cd traffic-app && python app.py (http://127.0.0.1:5000).",
};

const PROXY_TIMEOUT_MS = 8000;

export async function proxyFlask(request: Request, apiPath: string) {
  const target = `${FLASK_URL}${apiPath}${new URL(request.url).search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const init: RequestInit & { duplex?: string } = {
    method: request.method,
    headers,
    signal: AbortSignal.timeout(PROXY_TIMEOUT_MS),
  };

  try {
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = Buffer.from(await request.arrayBuffer());
      init.duplex = "half";
    }

    const res = await fetch(target, init);
    const type = (res.headers.get("content-type") || "").toLowerCase();
    const body = await res.arrayBuffer();

    if (res.status >= 500 && !type.includes("application/json")) {
      return NextResponse.json(DOWN, { status: 503 });
    }

    const preview = Buffer.from(body.slice(0, 24)).toString("utf8").trimStart().toLowerCase();
    if (preview.startsWith("<!doctype") || preview.startsWith("<html")) {
      return NextResponse.json(DOWN, { status: 503 });
    }

    const out = new NextResponse(body, { status: res.status });
    if (type) out.headers.set("content-type", type);
    return out;
  } catch {
    return NextResponse.json(DOWN, { status: 503 });
  }
}
