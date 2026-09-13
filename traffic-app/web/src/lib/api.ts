export function isHtmlBody(text: string) {
  const head = text.slice(0, 160).trimStart().toLowerCase();
  return (
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.includes("currently unavailable")
  );
}

export function apiUnavailableMessage(status?: number) {
  if (status === 502 || status === 503 || status === 504) {
    return "Traffic API is unavailable (the prediction service is down or waking up).";
  }
  return "Traffic API did not return JSON.";
}

export async function fetchJson<T>(
  input: string,
  init?: RequestInit,
  timeoutMs = 12000,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    const text = await res.text();
    const type = (res.headers.get("content-type") || "").toLowerCase();
    const looksJson = type.includes("application/json") || text.startsWith("{") || text.startsWith("[");
    if (!looksJson || isHtmlBody(text)) {
      throw new Error(apiUnavailableMessage(res.status));
    }
    let data: T;
    try {
      data = JSON.parse(text) as T;
    } catch {
      throw new Error(apiUnavailableMessage(res.status));
    }
    if (!res.ok) {
      const err = (data as { error?: string }).error;
      throw new Error(err || apiUnavailableMessage(res.status));
    }
    return data;
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" || err.name === "TimeoutError")
    ) {
      throw new Error("Traffic API timed out.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
