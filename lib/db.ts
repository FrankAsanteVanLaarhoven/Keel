import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const dataDir =
  process.env.KEEL_DATA_DIR ||
  (process.env.VERCEL ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data"));

let database: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (database) return database;
  mkdirSync(dataDir, { recursive: true });
  const db = new DatabaseSync(path.join(dataDir, "keel.db"), { timeout: 5000 });
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
      teacher_feedback TEXT,
      verified INTEGER DEFAULT 0,
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
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      createdAt DATE NOT NULL,
      updatedAt DATE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expiresAt DATE NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      createdAt DATE NOT NULL,
      updatedAt DATE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt DATE,
      refreshTokenExpiresAt DATE,
      scope TEXT,
      password TEXT,
      createdAt DATE NOT NULL,
      updatedAt DATE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt DATE NOT NULL,
      createdAt DATE,
      updatedAt DATE
    );
    CREATE TABLE IF NOT EXISTS keel_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      entity_id TEXT,
      metadata TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS keel_progress_user ON keel_progress(user_id);
    CREATE INDEX IF NOT EXISTS keel_like_section ON keel_like(section_id);
    CREATE INDEX IF NOT EXISTS keel_analytics_event ON keel_analytics(event_type);
    CREATE INDEX IF NOT EXISTS session_userId ON session(userId);
    CREATE INDEX IF NOT EXISTS account_userId ON account(userId);
    CREATE INDEX IF NOT EXISTS verification_identifier ON verification(identifier);
  `);
  try {
    db.exec("ALTER TABLE keel_progress ADD COLUMN teacher_feedback TEXT");
  } catch {}
  try {
    db.exec("ALTER TABLE keel_progress ADD COLUMN verified INTEGER DEFAULT 0");
  } catch {}
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

export function recordAnalytics(eventType: string, entityId?: string, metadata?: Record<string, unknown>) {
  try {
    getDb()
      .prepare(
        `INSERT INTO keel_analytics (event_type, entity_id, metadata, created_at)
         VALUES (?, ?, ?, ?)`
      )
      .run(eventType, entityId ?? null, metadata ? JSON.stringify(metadata) : null, Date.now());
  } catch {}
}

export function getAnalyticsOverview() {
  const db = getDb();
  const totalEvents = db.prepare(`SELECT count(*) as count FROM keel_analytics`).get() as { count?: number } | undefined;
  const totalProfiles = db.prepare(`SELECT count(*) as count FROM keel_profile`).get() as { count?: number } | undefined;
  const totalProgress = db.prepare(`SELECT count(*) as count FROM keel_progress`).get() as { count?: number } | undefined;
  const avgXp = db.prepare(`SELECT coalesce(avg(xp), 0) as avgXp FROM keel_progress`).get() as { avgXp?: number } | undefined;
  return {
    totalEvents: totalEvents?.count || 0,
    totalProfiles: totalProfiles?.count || 0,
    totalProgress: totalProgress?.count || 0,
    avgXp: Math.round(avgXp?.avgXp || 0),
  };
}

export type CohortSubmissionRecord = {
  userId: string;
  displayName: string;
  email: string | null;
  role: string;
  itemId: string;
  kind: string;
  score: number;
  xp: number;
  detail: string | null;
  day: string | null;
  updatedAt: number;
  teacherFeedback: string | null;
  verified: number;
};

export function getCohortSubmissions(kindFilter?: string): CohortSubmissionRecord[] {
  const db = getDb();
  const query = kindFilter
    ? `SELECT p.user_id, coalesce(pr.display_name, u.name, 'Learner') as display_name, u.email,
              coalesce(pr.role, 'student') as role, p.item_id, p.kind, p.score, p.xp, p.detail, p.day,
              p.updated_at, p.teacher_feedback, coalesce(p.verified, 0) as verified
       FROM keel_progress p
       LEFT JOIN keel_profile pr ON p.user_id = pr.user_id
       LEFT JOIN user u ON p.user_id = u.id
       WHERE p.kind = ?
       ORDER BY p.updated_at DESC`
    : `SELECT p.user_id, coalesce(pr.display_name, u.name, 'Learner') as display_name, u.email,
              coalesce(pr.role, 'student') as role, p.item_id, p.kind, p.score, p.xp, p.detail, p.day,
              p.updated_at, p.teacher_feedback, coalesce(p.verified, 0) as verified
       FROM keel_progress p
       LEFT JOIN keel_profile pr ON p.user_id = pr.user_id
       LEFT JOIN user u ON p.user_id = u.id
       ORDER BY p.updated_at DESC`;
  const rows = (kindFilter ? db.prepare(query).all(kindFilter) : db.prepare(query).all()) as {
    user_id: string;
    display_name: string;
    email: string | null;
    role: string;
    item_id: string;
    kind: string;
    score: number;
    xp: number;
    detail: string | null;
    day: string | null;
    updated_at: number;
    teacher_feedback: string | null;
    verified: number;
  }[];
  return rows.map((r) => ({
    userId: r.user_id,
    displayName: r.display_name,
    email: r.email,
    role: r.role,
    itemId: r.item_id,
    kind: r.kind,
    score: r.score,
    xp: r.xp,
    detail: r.detail,
    day: r.day,
    updatedAt: r.updated_at,
    teacherFeedback: r.teacher_feedback,
    verified: r.verified,
  }));
}

export function updateTeacherEvaluation(input: {
  userId: string;
  itemId: string;
  kind: string;
  score: number;
  xp?: number;
  teacherFeedback?: string | null;
  verified?: number;
}) {
  const db = getDb();
  db.prepare(
    `UPDATE keel_progress
     SET score = ?,
         xp = CASE WHEN ? IS NOT NULL THEN ? ELSE xp END,
         teacher_feedback = ?,
         verified = ?,
         updated_at = ?
     WHERE user_id = ? AND item_id = ? AND kind = ?`,
  ).run(
    input.score,
    input.xp ?? null,
    input.xp ?? 0,
    input.teacherFeedback ?? null,
    input.verified ?? 1,
    Date.now(),
    input.userId,
    input.itemId,
    input.kind,
  );
}

