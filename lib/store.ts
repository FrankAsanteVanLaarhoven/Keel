import { sqlAll, sqlGet, sqlRun } from "./sql";
import { ensureRecords } from "./db";
import { casesAccepted, marksOf, streakOf, type ProgressRow } from "./progress";
import { leaderboardSql } from "./security";

export type StoredProgress = ProgressRow & { xp: number; detail: string | null; updatedAt: number };

export async function listProgress(userId: string): Promise<StoredProgress[]> {
  await ensureRecords();
  const rows = await sqlAll<{
    item_id: string;
    kind: string;
    score: number;
    xp: number;
    detail: string | null;
    day: string | null;
    updated_at: number;
  }>(
    `SELECT item_id, kind, score, xp, detail, day, updated_at
     FROM keel_progress WHERE user_id = ?`,
    [userId],
  );
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

export async function saveProgress(input: {
  userId: string;
  itemId: string;
  kind: string;
  correct: boolean;
  xp: number;
  detail: string | null;
  day: string;
}) {
  await ensureRecords();
  const existing = await sqlGet<{ score: number; xp: number; detail: string | null }>(
    `SELECT score, xp, detail FROM keel_progress WHERE user_id = ? AND item_id = ? AND kind = ?`,
    [input.userId, input.itemId, input.kind],
  );
  if (existing?.score === 1 && !input.correct) {
    return { saved: true, xp: existing.xp, kept: true };
  }
  const score = input.correct ? 1 : 0;
  const xp = input.correct ? Math.max(existing?.xp ?? 0, input.xp) : (existing?.xp ?? 0);
  const detail = input.correct || !existing ? input.detail : existing.detail;
  await sqlRun(
    `INSERT INTO keel_progress (user_id, item_id, kind, score, xp, detail, day, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, item_id, kind) DO UPDATE SET
       score = excluded.score,
       xp = excluded.xp,
       detail = excluded.detail,
       day = excluded.day,
       updated_at = excluded.updated_at`,
    [input.userId, input.itemId, input.kind, score, xp, detail, input.day, Date.now()],
  );
  return { saved: true, xp, kept: false };
}

export async function progressSummary(userId: string, today: string) {
  const rows = await listProgress(userId);
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

export async function toggleLike(userId: string, sectionId: string): Promise<{ mine: boolean; count: number }> {
  await ensureRecords();
  const existing = await sqlGet<{ ok: number }>(`SELECT 1 AS ok FROM keel_like WHERE user_id = ? AND section_id = ?`, [userId, sectionId]);
  if (existing) await sqlRun(`DELETE FROM keel_like WHERE user_id = ? AND section_id = ?`, [userId, sectionId]);
  else await sqlRun(`INSERT INTO keel_like (user_id, section_id, created_at) VALUES (?, ?, ?)`, [userId, sectionId, Date.now()]);
  const count = (await sqlGet<{ count: number }>(`SELECT COUNT(*) AS count FROM keel_like WHERE section_id = ?`, [sectionId]))?.count ?? 0;
  return { mine: !existing, count };
}

export async function likeMap(userId?: string): Promise<Record<string, { count: number; mine: boolean }>> {
  await ensureRecords();
  const counts = await sqlAll<{ section_id: string; count: number }>(`SELECT section_id, COUNT(*) AS count FROM keel_like GROUP BY section_id`);
  const mine = new Set<string>();
  if (userId) {
    const rows = await sqlAll<{ section_id: string }>(`SELECT section_id FROM keel_like WHERE user_id = ?`, [userId]);
    for (const row of rows) mine.add(row.section_id);
  }
  const out: Record<string, { count: number; mine: boolean }> = {};
  for (const row of counts) out[row.section_id] = { count: row.count, mine: mine.has(row.section_id) };
  for (const id of mine) if (!out[id]) out[id] = { count: 1, mine: true };
  return out;
}

export async function leaderboard(weekStart: number | null, userId?: string) {
  await ensureRecords();
  const rows = await sqlAll<{ user_id: string; display_name: string; xp: number; cases: number }>(leaderboardSql(), [weekStart, weekStart]);
  return rows.map((row, index) => ({
    rank: index + 1,
    name: row.display_name,
    xp: row.xp,
    cases: row.cases,
    you: row.user_id === userId,
  }));
}

export async function setConsent(userId: string, voice: boolean) {
  await ensureRecords();
  await sqlRun(
    `INSERT INTO keel_consent (user_id, voice, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET voice = excluded.voice, updated_at = excluded.updated_at`,
    [userId, voice ? 1 : 0, Date.now()],
  );
}

export async function getConsent(userId: string): Promise<boolean> {
  await ensureRecords();
  const row = await sqlGet<{ voice: number }>(`SELECT voice FROM keel_consent WHERE user_id = ?`, [userId]);
  return row?.voice === 1;
}

export async function getProfile(userId: string) {
  await ensureRecords();
  return (await sqlGet<{ display_name: string; role: string }>(`SELECT display_name, role FROM keel_profile WHERE user_id = ?`, [userId])) ?? null;
}

export async function setProfile(userId: string, displayName: string, role: "super_admin" | "staff" | "student") {
  await ensureRecords();
  await sqlRun(
    `INSERT INTO keel_profile (user_id, display_name, role, created_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET display_name = excluded.display_name, role = excluded.role`,
    [userId, displayName, role, Date.now()],
  );
}

export { getCohortSubmissions, updateTeacherEvaluation, type CohortSubmissionRecord } from "./db";

export async function exportFor(userId: string) {
  await ensureRecords();
  const profile = await sqlGet<{ display_name: string; role: string; created_at: number }>(
    `SELECT display_name, role, created_at FROM keel_profile WHERE user_id = ?`,
    [userId],
  );
  const progress = await sqlAll(`SELECT item_id, kind, score, xp, detail, day, updated_at FROM keel_progress WHERE user_id = ?`, [userId]);
  const likes = await sqlAll(`SELECT section_id, created_at FROM keel_like WHERE user_id = ?`, [userId]);
  const consent = await getConsent(userId);
  const { workshopExport } = await import("./workshop");
  const workshop = await workshopExport(userId);
  return { profile: profile ?? null, progress, likes, voiceConsent: consent, workshop };
}
