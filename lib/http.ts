import { takeToken } from "./rate";
import { getDb } from "./db";
import { clientBucket, readJson, sameOrigin } from "./security";

export function json(data: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store",
      pragma: "no-cache",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

export async function guard(request: Request, bucket: string, limit: number, windowMs: number, userId?: string) {
  if (!sameOrigin(request)) return { error: json({ error: "origin" }, 403), body: null as unknown };
  let body: unknown = {};
  if (request.method !== "GET") {
    try {
      body = await readJson(request);
    } catch {
      return { error: json({ error: "body" }, 400), body: null as unknown };
    }
  }
  const rate = takeToken(getDb(), `${clientBucket(request, userId)}:${bucket}`, limit, windowMs);
  if (!rate.ok) {
    return {
      error: json({ error: "rate" }, 429, { "retry-after": String(rate.retryAfter) }),
      body: null as unknown,
    };
  }
  return { error: null, body };
}
