import { takeToken } from "./rate";
import { clientBucket, readJson, sameOrigin } from "./security";
import { isDatabaseWaking } from "./sql";

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

export async function guard(request: Request, bucket: string, limit: number, windowMs: number, userId?: string, max = 20_000) {
  if (!sameOrigin(request)) return { error: json({ error: "origin" }, 403), body: null as unknown };
  let body: unknown = {};
  if (request.method !== "GET") {
    try {
      body = await readJson(request, max);
    } catch {
      return { error: json({ error: "body" }, 400), body: null as unknown };
    }
  }
  const rate = await takeToken(`${clientBucket(request, userId)}:${bucket}`, limit, windowMs);
  if (!rate.ok) {
    return {
      error: json({ error: "rate" }, 429, { "retry-after": String(rate.retryAfter) }),
      body: null as unknown,
    };
  }
  return { error: null, body };
}

export async function settle(run: () => Promise<Response>): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    if (isDatabaseWaking(error)) return json({ error: "waking" }, 503);
    return json({ error: "unavailable" }, 500);
  }
}
