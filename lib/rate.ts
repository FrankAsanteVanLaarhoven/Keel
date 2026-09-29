import { sqlGet, sqlRun } from "./sql";
import { ensureRecords } from "./db";

type RateStore = {
  get<T>(statement: string, params: unknown[]): Promise<T | undefined> | T | undefined;
  run(statement: string, params: unknown[]): Promise<void> | void;
};

async function sharedStore(): Promise<RateStore> {
  await ensureRecords();
  return {
    get: (statement, params) => sqlGet(statement, params),
    run: (statement, params) => sqlRun(statement, params),
  };
}

export async function takeToken(
  bucket: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
  store?: RateStore,
): Promise<{ ok: boolean; retryAfter: number }> {
  const db = store ?? (await sharedStore());
  const windowStart = now - (now % windowMs);
  await db.run(
    `INSERT INTO keel_rate (bucket, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
    [bucket, windowStart],
  );
  const row = await db.get<{ count: number }>(`SELECT count FROM keel_rate WHERE bucket = ? AND window_start = ?`, [bucket, windowStart]);
  await db.run(`DELETE FROM keel_rate WHERE window_start < ?`, [now - windowMs * 3]);
  const count = row?.count ?? 1;
  return { ok: count <= limit, retryAfter: Math.ceil((windowStart + windowMs - now) / 1000) };
}
