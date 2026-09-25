import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const dataDir = process.env.KEEL_DATA_DIR || path.join(process.cwd(), ".data");

let database: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (database) return database;
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "keel.db"));
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS keel_profile (
      user_id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_progress (
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      score INTEGER NOT NULL,
      xp INTEGER NOT NULL,
      detail TEXT,
      day TEXT,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, item_id, kind)
    );
    CREATE TABLE IF NOT EXISTS keel_like (
      user_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, section_id)
    );
    CREATE TABLE IF NOT EXISTS keel_consent (
      user_id TEXT PRIMARY KEY,
      voice INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_rate (
      bucket TEXT NOT NULL,
      window_start INTEGER NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (bucket, window_start)
    );
    CREATE INDEX IF NOT EXISTS keel_progress_user ON keel_progress(user_id);
    CREATE INDEX IF NOT EXISTS keel_like_section ON keel_like(section_id);
  `);
  database = db;
  return db;
}

export function insertProfile(userId: string, displayName: string) {
  getDb()
    .prepare(
      `INSERT INTO keel_profile (user_id, display_name, role, created_at)
       VALUES (?, ?, 'student', ?)
       ON CONFLICT(user_id) DO NOTHING`,
    )
    .run(userId, displayName || "Learner", Date.now());
}

export function wipeUser(userId: string) {
  const db = getDb();
  const safe = userId.replace(/[\\%_]/g, "");
  db.prepare(`DELETE FROM keel_profile WHERE user_id = ?`).run(userId);
  db.prepare(`DELETE FROM keel_progress WHERE user_id = ?`).run(userId);
  db.prepare(`DELETE FROM keel_like WHERE user_id = ?`).run(userId);
  db.prepare(`DELETE FROM keel_consent WHERE user_id = ?`).run(userId);
  db.prepare(`DELETE FROM keel_rate WHERE bucket LIKE ?`).run(`user:${safe}:%`);
}
