import type { DatabaseSync } from "node:sqlite";

export function takeToken(
  db: DatabaseSync,
  bucket: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): { ok: boolean; retryAfter: number } {
  const windowStart = now - (now % windowMs);
  db.prepare(
    `INSERT INTO keel_rate (bucket, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
  ).run(bucket, windowStart);
  const row = db.prepare(`SELECT count FROM keel_rate WHERE bucket = ? AND window_start = ?`).get(bucket, windowStart) as
    | { count: number }
    | undefined;
  db.prepare(`DELETE FROM keel_rate WHERE window_start < ?`).run(now - windowMs * 3);
  const count = row?.count ?? 1;
  return { ok: count <= limit, retryAfter: Math.ceil((windowStart + windowMs - now) / 1000) };
}
