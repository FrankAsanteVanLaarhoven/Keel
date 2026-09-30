import { dataDir, sqlAll, sqlExec, sqlGet, sqlIgnore, sqlRun, usesPostgres } from "./sql";

export { dataDir };

let ready: Promise<void> | null = null;

const sqliteSchema = `
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
    CREATE TABLE IF NOT EXISTS keel_page (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      revision INTEGER NOT NULL,
      status TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      updated_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_page_member (
      page_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (page_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS keel_page_revision (
      page_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      author_id TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (page_id, revision)
    );
    CREATE TABLE IF NOT EXISTS keel_page_note (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_page_seen (
      page_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      seen_at INTEGER NOT NULL,
      PRIMARY KEY (page_id, user_id)
    );
`;

const postgresSchema = `
    CREATE TABLE IF NOT EXISTS keel_profile (
      user_id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_progress (
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      score INTEGER NOT NULL,
      xp INTEGER NOT NULL,
      detail TEXT,
      day TEXT,
      updated_at BIGINT NOT NULL,
      teacher_feedback TEXT,
      verified INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, item_id, kind)
    );
    CREATE TABLE IF NOT EXISTS keel_like (
      user_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (user_id, section_id)
    );
    CREATE TABLE IF NOT EXISTS keel_consent (
      user_id TEXT PRIMARY KEY,
      voice INTEGER NOT NULL,
      updated_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_rate (
      bucket TEXT NOT NULL,
      window_start BIGINT NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY (bucket, window_start)
    );
    CREATE TABLE IF NOT EXISTS keel_analytics (
      id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      event_type TEXT NOT NULL,
      entity_id TEXT,
      metadata TEXT,
      created_at BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS keel_progress_user ON keel_progress(user_id);
    CREATE INDEX IF NOT EXISTS keel_like_section ON keel_like(section_id);
    CREATE INDEX IF NOT EXISTS keel_analytics_event ON keel_analytics(event_type);
    CREATE TABLE IF NOT EXISTS keel_page (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      revision INTEGER NOT NULL,
      status TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      updated_at BIGINT NOT NULL,
      updated_by TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_page_member (
      page_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (page_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS keel_page_revision (
      page_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      author_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      PRIMARY KEY (page_id, revision)
    );
    CREATE TABLE IF NOT EXISTS keel_page_note (
      id TEXT PRIMARY KEY,
      page_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_page_seen (
      page_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      seen_at BIGINT NOT NULL,
      PRIMARY KEY (page_id, user_id)
    );
`;

export function ensureRecords(): Promise<void> {
  if (!ready) {
    ready = openRecords().catch((error: unknown) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function openRecords(): Promise<void> {
  await sqlExec(usesPostgres() ? postgresSchema : sqliteSchema);
  await sqlIgnore("ALTER TABLE keel_progress ADD COLUMN teacher_feedback TEXT");
  await sqlIgnore("ALTER TABLE keel_progress ADD COLUMN verified INTEGER DEFAULT 0");
}

export async function insertProfile(userId: string, displayName: string, role: "super_admin" | "staff" | "student" = "student") {
  await ensureRecords();
  await sqlRun(
    `INSERT INTO keel_profile (user_id, display_name, role, created_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET role = excluded.role`,
    [userId, displayName || "Learner", role, Date.now()],
  );
}

export async function wipeUser(userId: string) {
  await ensureRecords();
  const safe = userId.replace(/[\\%_]/g, "");
  await sqlRun(`DELETE FROM keel_profile WHERE user_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_progress WHERE user_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_like WHERE user_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_consent WHERE user_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_rate WHERE bucket LIKE ?`, [`user:${safe}:%`]);
  const owned = await sqlAll<{ id: string }>(`SELECT id FROM keel_page WHERE owner_id = ?`, [userId]);
  for (const page of owned) {
    await sqlRun(`DELETE FROM keel_page_revision WHERE page_id = ?`, [page.id]);
    await sqlRun(`DELETE FROM keel_page_member WHERE page_id = ?`, [page.id]);
    await sqlRun(`DELETE FROM keel_page_note WHERE page_id = ?`, [page.id]);
    await sqlRun(`DELETE FROM keel_page_seen WHERE page_id = ?`, [page.id]);
    await sqlRun(`DELETE FROM keel_page WHERE id = ?`, [page.id]);
  }
  await sqlRun(`DELETE FROM keel_page_member WHERE user_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_page_note WHERE author_id = ?`, [userId]);
  await sqlRun(`DELETE FROM keel_page_seen WHERE user_id = ?`, [userId]);
  await sqlRun(`UPDATE keel_page SET updated_by = owner_id WHERE updated_by = ?`, [userId]);
  try {
    const reviews = await sqlAll<{ id: string }>(`SELECT id FROM keel_review WHERE user_id = ?`, [userId]);
    for (const review of reviews) await sqlRun(`DELETE FROM keel_fingerprint WHERE review_id = ?`, [review.id]);
    await sqlRun(`DELETE FROM keel_review WHERE user_id = ?`, [userId]);
    await sqlRun(`DELETE FROM keel_file WHERE user_id = ?`, [userId]);
    await sqlRun(`DELETE FROM keel_rating WHERE user_id = ?`, [userId]);
    await sqlRun(`DELETE FROM keel_survey WHERE user_id = ?`, [userId]);
    await sqlRun(`DELETE FROM keel_attempt WHERE user_id = ?`, [userId]);
  } catch {
    /* tables appear with the class book */
  }
}

export async function recordAnalytics(eventType: string, entityId?: string, metadata?: Record<string, unknown>) {
  try {
    await ensureRecords();
    await sqlRun(
      `INSERT INTO keel_analytics (event_type, entity_id, metadata, created_at)
       VALUES (?, ?, ?, ?)`,
      [eventType, entityId ?? null, metadata ? JSON.stringify(metadata) : null, Date.now()],
    );
  } catch {
    /* a missing analytics table must not break the page */
  }
}

export async function getAnalyticsOverview() {
  await ensureRecords();
  const totalEvents = await sqlGet<{ count?: number }>(`SELECT count(*) as count FROM keel_analytics`);
  const totalProfiles = await sqlGet<{ count?: number }>(`SELECT count(*) as count FROM keel_profile`);
  const totalProgress = await sqlGet<{ count?: number }>(`SELECT count(*) as count FROM keel_progress`);
  const avgXp = await sqlGet<{ avgxp?: number; avgXp?: number }>(`SELECT coalesce(avg(xp), 0) as avgXp FROM keel_progress`);
  return {
    totalEvents: totalEvents?.count || 0,
    totalProfiles: totalProfiles?.count || 0,
    totalProgress: totalProgress?.count || 0,
    avgXp: Math.round(avgXp?.avgXp || avgXp?.avgxp || 0),
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

export async function getCohortSubmissions(kindFilter?: string): Promise<CohortSubmissionRecord[]> {
  await ensureRecords();
  const query = kindFilter
    ? `SELECT p.user_id, coalesce(pr.display_name, u.name, 'Learner') as display_name, u.email,
              coalesce(pr.role, 'student') as role, p.item_id, p.kind, p.score, p.xp, p.detail, p.day,
              p.updated_at, p.teacher_feedback, coalesce(p.verified, 0) as verified
       FROM keel_progress p
       LEFT JOIN keel_profile pr ON p.user_id = pr.user_id
       LEFT JOIN "user" u ON p.user_id = u.id
       WHERE p.kind = ?
       ORDER BY p.updated_at DESC`
    : `SELECT p.user_id, coalesce(pr.display_name, u.name, 'Learner') as display_name, u.email,
              coalesce(pr.role, 'student') as role, p.item_id, p.kind, p.score, p.xp, p.detail, p.day,
              p.updated_at, p.teacher_feedback, coalesce(p.verified, 0) as verified
       FROM keel_progress p
       LEFT JOIN keel_profile pr ON p.user_id = pr.user_id
       LEFT JOIN "user" u ON p.user_id = u.id
       ORDER BY p.updated_at DESC`;
  const rows = await sqlAll<{
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
  }>(query, kindFilter ? [kindFilter] : []);
  return rows.map((row) => ({
    userId: row.user_id,
    displayName: row.display_name,
    email: row.email,
    role: row.role,
    itemId: row.item_id,
    kind: row.kind,
    score: row.score,
    xp: row.xp,
    detail: row.detail,
    day: row.day,
    updatedAt: row.updated_at,
    teacherFeedback: row.teacher_feedback,
    verified: row.verified,
  }));
}

export async function updateTeacherEvaluation(input: {
  userId: string;
  itemId: string;
  kind: string;
  score: number;
  xp?: number;
  teacherFeedback?: string | null;
  verified?: number;
}) {
  await ensureRecords();
  await sqlRun(
    `UPDATE keel_progress
     SET score = ?,
         xp = CASE WHEN ? IS NOT NULL THEN ? ELSE xp END,
         teacher_feedback = ?,
         verified = ?,
         updated_at = ?
     WHERE user_id = ? AND item_id = ? AND kind = ?`,
    [
      input.score,
      input.xp ?? null,
      input.xp ?? 0,
      input.teacherFeedback ?? null,
      input.verified ?? 1,
      Date.now(),
      input.userId,
      input.itemId,
      input.kind,
    ],
  );
}
