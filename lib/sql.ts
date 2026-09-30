import { AsyncLocalStorage } from "node:async_hooks";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Pool, type PoolClient, types as pgTypes } from "pg";

pgTypes.setTypeParser(20, (value) => Number(value));
pgTypes.setTypeParser(1700, (value) => Number(value));

export const dataDir =
  process.env.KEEL_DATA_DIR ||
  (process.env.VERCEL ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data"));

export function databaseUrl(): string | null {
  const value = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
  if (!value || value.includes("[SENSITIVE]")) return null;
  return value;
}

export function usesPostgres(): boolean {
  return databaseUrl() !== null;
}

export function bindPlaceholders(statement: string, postgres: boolean): string {
  if (!postgres) return statement;
  let index = 0;
  return statement.replace(/\?/g, () => `$${++index}`);
}

let pool: Pool | null = null;
let sqlite: DatabaseSync | null = null;
// One checked-out connection per request. A shared client would mix two deliveries.
const sqlTransaction = new AsyncLocalStorage<PoolClient>();
let sqliteHeld = false;
let sqliteQueue: Promise<void> = Promise.resolve();

export function authDatabase(): Pool | DatabaseSync {
  return usesPostgres() ? postgresPool() : sqliteDb();
}

export function postgresPool(): Pool {
  if (!pool) {
    const raw = databaseUrl() ?? "";
    const local = /@(?:localhost|127\.0\.0\.1)(?::|\/)/.test(raw);
    // Node treats sslmode=require as full verification. Neon’s certificate is not in that trust store.
    const connectionString = local
      ? raw
      : raw
          .replace(/([?&])sslmode=[^&]*/g, "$1")
          .replace("?&", "?")
          .replace(/[?&]$/, "");
    pool = new Pool({
      connectionString,
      max: process.env.VERCEL ? 1 : 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
      allowExitOnIdle: true,
      ssl: local ? undefined : { rejectUnauthorized: false },
    });
  }
  return pool;
}

function sqliteDb(): DatabaseSync {
  if (sqlite) return sqlite;
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "keel.db"), { timeout: 5000 });
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  sqlite = db;
  return db;
}

export function isDatabaseWaking(error: unknown): boolean {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const message = error instanceof Error ? error.message : String(error);
  return /timeout|ECONNRESET|ECONNREFUSED|EAI_AGAIN|Connection terminated|Connection ended|too many clients|the database system is starting|57P01|53300|08000|08006|57P03/i.test(`${code} ${message}`);
}

export function isUniqueViolation(error: unknown): boolean {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  const message = error instanceof Error ? error.message : String(error);
  return code === "23505" || /UNIQUE constraint failed/i.test(message);
}

export async function withTransaction<T>(run: () => Promise<T>): Promise<T> {
  if (usesPostgres()) {
    if (sqlTransaction.getStore()) return run();
    const client = await postgresPool().connect();
    try {
      await client.query("BEGIN");
      const value = await sqlTransaction.run(client, run);
      await client.query("COMMIT");
      return value;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch {
        /* the connection already closed */
      }
      throw error;
    } finally {
      client.release();
    }
  }
  if (sqliteHeld) return run();
  // One file connection. A second BEGIN on it fails, so writers wait their turn.
  const previous = sqliteQueue;
  let release: () => void = () => {};
  sqliteQueue = new Promise((resolve) => {
    release = resolve;
  });
  await previous;
  sqliteHeld = true;
  const db = sqliteDb();
  try {
    db.exec("BEGIN IMMEDIATE");
    try {
      const value = await run();
      db.exec("COMMIT");
      return value;
    } catch (error) {
      try {
        db.exec("ROLLBACK");
      } catch {
        /* the transaction already ended */
      }
      throw error;
    }
  } finally {
    sqliteHeld = false;
    release();
  }
}

async function withWake<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (!isDatabaseWaking(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return run();
  }
}

export async function sqlExec(statement: string): Promise<void> {
  const text = statement.trim();
  if (!text) return;
  if (!usesPostgres()) {
    sqliteDb().exec(text);
    return;
  }
  const parts = text
    .split(/;\s*(?:\n|$)/)
    .map((part) => part.trim().replace(/;$/, ""))
    .filter(Boolean);
  for (const part of parts) await withWake(() => postgresPool().query(part));
}

export async function sqlIgnore(statement: string): Promise<void> {
  try {
    await sqlExec(statement);
  } catch {
    /* the column or table is already there */
  }
}

function postgresQuery(statement: string, params: unknown[]) {
  const text = bindPlaceholders(statement, true);
  const client = sqlTransaction.getStore();
  if (client) return client.query(text, params);
  return withWake(() => postgresPool().query(text, params));
}

export async function sqlGet<T>(statement: string, params: unknown[] = []): Promise<T | undefined> {
  if (usesPostgres()) {
    const result = await postgresQuery(statement, params);
    return result.rows[0] as T | undefined;
  }
  return sqliteDb().prepare(statement).get(...(params as never[])) as T | undefined;
}

export async function sqlAll<T>(statement: string, params: unknown[] = []): Promise<T[]> {
  if (usesPostgres()) {
    const result = await postgresQuery(statement, params);
    return result.rows as T[];
  }
  return sqliteDb().prepare(statement).all(...(params as never[])) as T[];
}

export async function sqlRun(statement: string, params: unknown[] = []): Promise<void> {
  if (usesPostgres()) {
    await postgresQuery(statement, params);
    return;
  }
  sqliteDb().prepare(statement).run(...(params as never[]));
}
