import { getDb } from "./db";
import { casesAccepted, marksOf, streakOf, type ProgressRow } from "./progress";
import { leaderboardSql } from "./security";

export type StoredProgress = ProgressRow & { xp: number; detail: string | null; updatedAt: number };

export function listProgress(userId: string): StoredProgress[] {
  const rows = getDb()
    .prepare(
      `SELECT item_id, kind, score, xp, detail, day, updated_at
       FROM keel_progress WHERE user_id = ?`,
    )
    .all(userId) as {
    item_id: string;
    kind: string;
    score: number;
    xp: number;
    detail: string | null;
    day: string | null;
    updated_at: number;
  }[];
  return rows.map((row) => ({
    itemId: row.item_id,
    kind: row.kind,
    score: row.score,
    xp: row.xp,
    detail: row.detail,
    day: row.day,
    updatedAt: row.updated_at,
  }));
}

export function saveProgress(input: {
  userId: string;
  itemId: string;
  kind: string;
  correct: boolean;
  xp: number;
  detail: string | null;
  day: string;
}) {
  const db = getDb();
  const existing = db
    .prepare(`SELECT score, xp, detail FROM keel_progress WHERE user_id = ? AND item_id = ? AND kind = ?`)
    .get(input.userId, input.itemId, input.kind) as { score: number; xp: number; detail: string | null } | undefined;
  if (existing?.score === 1 && !input.correct) {
    return { saved: true, xp: existing.xp, kept: true };
  }
  const score = input.correct ? 1 : 0;
  const xp = input.correct ? Math.max(existing?.xp ?? 0, input.xp) : (existing?.xp ?? 0);
  const detail = input.correct || !existing ? input.detail : existing.detail;
  db.prepare(
    `INSERT INTO keel_progress (user_id, item_id, kind, score, xp, detail, day, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, item_id, kind) DO UPDATE SET
       score = excluded.score,
       xp = excluded.xp,
       detail = excluded.detail,
       day = excluded.day,
       updated_at = excluded.updated_at`,
  ).run(input.userId, input.itemId, input.kind, score, xp, detail, input.day, Date.now());
  return { saved: true, xp, kept: false };
}

export function progressSummary(userId: string, today: string) {
  const rows = listProgress(userId);
  const xp = rows.reduce((sum, row) => sum + row.xp, 0);
  return {
    rows,
    xp,
    cases: casesAccepted(rows),
    marks: marksOf(rows),
    streak: streakOf(
      rows.map((row) => row.day || ""),
      today,
    ),
  };
}

export function toggleLike(userId: string, sectionId: string): { mine: boolean; count: number } {
  const db = getDb();
  const existing = db.prepare(`SELECT 1 AS ok FROM keel_like WHERE user_id = ? AND section_id = ?`).get(userId, sectionId) as
    | { ok: number }
    | undefined;
  if (existing) db.prepare(`DELETE FROM keel_like WHERE user_id = ? AND section_id = ?`).run(userId, sectionId);
  else db.prepare(`INSERT INTO keel_like (user_id, section_id, created_at) VALUES (?, ?, ?)`).run(userId, sectionId, Date.now());
  const count = (
    db.prepare(`SELECT COUNT(*) AS count FROM keel_like WHERE section_id = ?`).get(sectionId) as { count: number }
  ).count;
  return { mine: !existing, count };
}

export function likeMap(userId?: string): Record<string, { count: number; mine: boolean }> {
  const db = getDb();
  const counts = db.prepare(`SELECT section_id, COUNT(*) AS count FROM keel_like GROUP BY section_id`).all() as {
    section_id: string;
    count: number;
  }[];
  const mine = new Set<string>();
  if (userId) {
    const rows = db.prepare(`SELECT section_id FROM keel_like WHERE user_id = ?`).all(userId) as { section_id: string }[];
    for (const row of rows) mine.add(row.section_id);
  }
  const out: Record<string, { count: number; mine: boolean }> = {};
  for (const row of counts) out[row.section_id] = { count: row.count, mine: mine.has(row.section_id) };
  for (const id of mine) if (!out[id]) out[id] = { count: 1, mine: true };
  return out;
}

export function leaderboard(weekStart: number | null, userId?: string) {
  const rows = getDb().prepare(leaderboardSql()).all(weekStart, weekStart) as {
    user_id: string;
    display_name: string;
    xp: number;
    cases: number;
  }[];
  return rows.map((row, index) => ({
    rank: index + 1,
    name: row.display_name,
    xp: row.xp,
    cases: row.cases,
    you: row.user_id === userId,
  }));
}

export function setConsent(userId: string, voice: boolean) {
  getDb()
    .prepare(
      `INSERT INTO keel_consent (user_id, voice, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET voice = excluded.voice, updated_at = excluded.updated_at`,
    )
    .run(userId, voice ? 1 : 0, Date.now());
}

export function getConsent(userId: string): boolean {
  const row = getDb().prepare(`SELECT voice FROM keel_consent WHERE user_id = ?`).get(userId) as { voice: number } | undefined;
  return row?.voice === 1;
}

export function getProfile(userId: string) {
  return (
    (getDb()
      .prepare(`SELECT display_name, role FROM keel_profile WHERE user_id = ?`)
      .get(userId) as { display_name: string; role: string } | undefined) ?? null
  );
}

export function setProfile(userId: string, displayName: string, role: "staff" | "student") {
  getDb()
    .prepare(
      `INSERT INTO keel_profile (user_id, display_name, role, created_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name, role = excluded.role`,
    )
    .run(userId, displayName, role, Date.now());
}

export function exportFor(userId: string) {
  const db = getDb();
  const profile = db
    .prepare(`SELECT display_name, role, created_at FROM keel_profile WHERE user_id = ?`)
    .get(userId) as { display_name: string; role: string; created_at: number } | undefined;
  const progress = db
    .prepare(`SELECT item_id, kind, score, xp, detail, day, updated_at FROM keel_progress WHERE user_id = ?`)
    .all(userId);
  const likes = db.prepare(`SELECT section_id, created_at FROM keel_like WHERE user_id = ?`).all(userId);
  const consent = getConsent(userId);
  return { profile: profile ?? null, progress, likes, voiceConsent: consent };
}
