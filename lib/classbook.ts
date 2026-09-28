import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { dataDir, getDb } from "./db";
import { extractText, fileHash, reviewDocument, type ReviewResult } from "./review";
import { weeks, type WorkWindow } from "./term";

export type AttemptRow = { userId: string; itemId: string; kind: string; correct: boolean; createdAt: number };

export type ClassFile = {
  id: string;
  weekId: string;
  userId: string;
  name: string;
  mime: string;
  bytes: number;
  scope: "class" | "own";
  createdAt: number;
};

const allowed = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function ensureClassbook() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS keel_attempt (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      kind TEXT NOT NULL,
      correct INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS keel_attempt_user ON keel_attempt(user_id, created_at);
    CREATE TABLE IF NOT EXISTS keel_week_work (
      id TEXT PRIMARY KEY,
      week_no INTEGER NOT NULL,
      title TEXT NOT NULL,
      brief TEXT NOT NULL,
      status TEXT NOT NULL,
      opens_at INTEGER,
      closes_at INTEGER,
      updated_at INTEGER NOT NULL,
      updated_by TEXT
    );
    CREATE TABLE IF NOT EXISTS keel_file (
      id TEXT PRIMARY KEY,
      week_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      mime TEXT NOT NULL,
      bytes INTEGER NOT NULL,
      scope TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_rating (
      user_id TEXT NOT NULL,
      week_id TEXT NOT NULL,
      stars INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, week_id)
    );
    CREATE TABLE IF NOT EXISTS keel_survey (
      user_id TEXT PRIMARY KEY,
      helped INTEGER NOT NULL,
      why TEXT NOT NULL,
      better TEXT NOT NULL,
      ease INTEGER NOT NULL,
      recommend INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_invite (
      code TEXT PRIMARY KEY,
      from_user TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      used_by TEXT
    );
    CREATE TABLE IF NOT EXISTS keel_review (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_id TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      bytes INTEGER NOT NULL,
      assessment INTEGER NOT NULL,
      coverage INTEGER NOT NULL,
      plagiarism INTEGER NOT NULL,
      similarity INTEGER NOT NULL,
      match_kind TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS keel_fingerprint (
      review_id TEXT NOT NULL,
      shingle TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS keel_fingerprint_shingle ON keel_fingerprint(shingle);
    CREATE TABLE IF NOT EXISTS keel_course (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      status TEXT NOT NULL,
      opens_at INTEGER,
      closes_at INTEGER,
      updated_at INTEGER NOT NULL,
      updated_by TEXT
    );
    CREATE TABLE IF NOT EXISTS keel_announcement (
      id TEXT PRIMARY KEY,
      course_id TEXT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT NOT NULL,
      publish_at INTEGER,
      updated_at INTEGER NOT NULL,
      updated_by TEXT
    );
  `);
  const own = db.prepare(`SELECT id FROM keel_file WHERE scope = 'own'`).all() as { id: string }[];
  for (const row of own) {
    db.prepare(`DELETE FROM keel_file WHERE id = ?`).run(row.id);
    try {
      unlinkSync(path.join(uploadsDir(), row.id));
    } catch {
      /* already gone */
    }
  }
  const count = db.prepare(`SELECT COUNT(*) AS count FROM keel_week_work`).get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(
      `INSERT INTO keel_week_work (id, week_no, title, brief, status, opens_at, closes_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, 'published', NULL, NULL, ?, NULL)`,
    );
    for (const week of weeks) insert.run(week.id, week.no, week.title, week.promise, Date.now());
  }
}

export function recordAttempt(input: { userId: string; itemId: string; kind: string; correct: boolean }) {
  ensureClassbook();
  getDb()
    .prepare(`INSERT INTO keel_attempt (user_id, item_id, kind, correct, created_at) VALUES (?, ?, ?, ?, ?)`)
    .run(input.userId, input.itemId, input.kind, input.correct ? 1 : 0, Date.now());
}

export function attemptTotals(): { userId: string; name: string; correct: number; attempts: number }[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(
      `SELECT p.user_id AS user_id, p.display_name AS name,
         SUM(CASE WHEN a.correct = 1 THEN 1 ELSE 0 END) AS correct,
         COUNT(a.id) AS attempts
       FROM keel_profile p
       JOIN keel_attempt a ON a.user_id = p.user_id
       GROUP BY p.user_id, p.display_name`,
    )
    .all() as { user_id: string; name: string; correct: number; attempts: number }[];
  return rows.map((row) => ({ userId: row.user_id, name: row.name, correct: row.correct, attempts: row.attempts }));
}

export function listAttempts(userId?: string): AttemptRow[] {
  ensureClassbook();
  const rows = (userId
    ? getDb().prepare(`SELECT user_id, item_id, kind, correct, created_at FROM keel_attempt WHERE user_id = ? ORDER BY created_at DESC`).all(userId)
    : getDb().prepare(`SELECT user_id, item_id, kind, correct, created_at FROM keel_attempt ORDER BY created_at DESC LIMIT 400`).all()) as {
    user_id: string;
    item_id: string;
    kind: string;
    correct: number;
    created_at: number;
  }[];
  return rows.map((row) => ({
    userId: row.user_id,
    itemId: row.item_id,
    kind: row.kind,
    correct: row.correct === 1,
    createdAt: row.created_at,
  }));
}

export function cohort() {
  ensureClassbook();
  const people = getDb()
    .prepare(
      `SELECT u.id AS id, u.email AS email, u.name AS name, p.display_name AS display_name, coalesce(p.role, 'student') AS role
       FROM user u
       LEFT JOIN keel_profile p ON p.user_id = u.id
       ORDER BY coalesce(p.display_name, u.name)`,
    )
    .all() as { id: string; email: string; name: string; display_name: string | null; role: string }[];
  const totals = new Map(attemptTotals().map((row) => [row.userId, row]));
  return people.map((person) => {
    const tally = totals.get(person.id);
    return {
      id: person.id,
      email: person.email,
      name: person.display_name || person.name,
      role: person.role,
      correct: tally?.correct ?? 0,
      attempts: tally?.attempts ?? 0,
      failures: (tally?.attempts ?? 0) - (tally?.correct ?? 0),
    };
  });
}

export type WeekWork = WorkWindow & { id: string; weekNo: number; title: string; brief: string };

export function listWork(): WeekWork[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(`SELECT id, week_no, title, brief, status, opens_at, closes_at FROM keel_week_work ORDER BY week_no`)
    .all() as { id: string; week_no: number; title: string; brief: string; status: WorkWindow["status"]; opens_at: number | null; closes_at: number | null }[];
  return rows.map((row) => ({
    id: row.id,
    weekNo: row.week_no,
    title: row.title,
    brief: row.brief,
    status: row.status,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
  }));
}

export function workFor(weekId: string): WeekWork | null {
  return listWork().find((work) => work.id === weekId) ?? null;
}

export function saveWork(input: {
  id: string;
  title: string;
  brief: string;
  status: WorkWindow["status"];
  opensAt: number | null;
  closesAt: number | null;
  userId: string;
}) {
  ensureClassbook();
  const week = weeks.find((item) => item.id === input.id);
  if (!week) return false;
  getDb()
    .prepare(
      `INSERT INTO keel_week_work (id, week_no, title, brief, status, opens_at, closes_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         brief = excluded.brief,
         status = excluded.status,
         opens_at = excluded.opens_at,
         closes_at = excluded.closes_at,
         updated_at = excluded.updated_at,
         updated_by = excluded.updated_by`,
    )
    .run(input.id, week.no, input.title.slice(0, 120), input.brief.slice(0, 2000), input.status, input.opensAt, input.closesAt, Date.now(), input.userId);
  return true;
}

export function restoreWork(id: string) {
  const week = weeks.find((item) => item.id === id);
  if (!week) return false;
  ensureClassbook();
  getDb()
    .prepare(`UPDATE keel_week_work SET title = ?, brief = ?, status = 'published', opens_at = NULL, closes_at = NULL, updated_at = ? WHERE id = ?`)
    .run(week.title, week.promise, Date.now(), id);
  return true;
}

function uploadsDir() {
  const dir = path.join(dataDir, "uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function saveUpload(input: { weekId: string; userId: string; name: string; mime: string; bytes: Buffer; scope: "class" | "own" }): ClassFile | null {
  if (!weeks.some((week) => week.id === input.weekId) && !courseById(input.weekId)) return null;
  if (!allowed.has(input.mime)) return null;
  if (input.bytes.length < 1 || input.bytes.length > 4_000_000) return null;
  const clean = input.name.replace(/[^\w.\- ()]/g, "").slice(0, 80);
  if (!clean) return null;
  ensureClassbook();
  const id = randomBytes(12).toString("hex");
  const stored = path.join(uploadsDir(), id);
  writeFileSync(stored, input.bytes);
  const createdAt = Date.now();
  getDb()
    .prepare(`INSERT INTO keel_file (id, week_id, user_id, name, mime, bytes, scope, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, input.weekId, input.userId, clean, input.mime, input.bytes.length, input.scope, createdAt);
  return { id, weekId: input.weekId, userId: input.userId, name: clean, mime: input.mime, bytes: input.bytes.length, scope: input.scope, createdAt };
}

export function filesFor(weekId: string, userId: string, staff: boolean): ClassFile[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(`SELECT id, week_id, user_id, name, mime, bytes, scope, created_at FROM keel_file WHERE week_id = ? ORDER BY created_at DESC`)
    .all(weekId) as { id: string; week_id: string; user_id: string; name: string; mime: string; bytes: number; scope: "class" | "own"; created_at: number }[];
  return rows
    .filter((row) => staff || row.scope === "class" || row.user_id === userId)
    .map((row) => ({
      id: row.id,
      weekId: row.week_id,
      userId: row.user_id,
      name: row.name,
      mime: row.mime,
      bytes: row.bytes,
      scope: row.scope,
      createdAt: row.created_at,
    }));
}

export function readUpload(id: string, userId: string, staff: boolean): { file: ClassFile; bytes: Buffer } | null {
  ensureClassbook();
  const row = getDb()
    .prepare(`SELECT id, week_id, user_id, name, mime, bytes, scope, created_at FROM keel_file WHERE id = ?`)
    .get(id) as { id: string; week_id: string; user_id: string; name: string; mime: string; bytes: number; scope: "class" | "own"; created_at: number } | undefined;
  if (!row || !/^[a-f0-9]{24}$/.test(id)) return null;
  if (!staff && row.scope !== "class" && row.user_id !== userId) return null;
  const stored = path.join(uploadsDir(), id);
  if (!stored.startsWith(uploadsDir())) return null;
  return {
    file: {
      id: row.id,
      weekId: row.week_id,
      userId: row.user_id,
      name: row.name,
      mime: row.mime,
      bytes: row.bytes,
      scope: row.scope,
      createdAt: row.created_at,
    },
    bytes: readFileSync(stored),
  };
}

export function deleteUpload(id: string, userId: string, staff: boolean): boolean {
  ensureClassbook();
  const row = getDb().prepare(`SELECT user_id FROM keel_file WHERE id = ?`).get(id) as { user_id: string } | undefined;
  if (!row) return false;
  if (!staff && row.user_id !== userId) return false;
  getDb().prepare(`DELETE FROM keel_file WHERE id = ?`).run(id);
  try {
    unlinkSync(path.join(uploadsDir(), id));
  } catch {
    /* already gone */
  }
  return true;
}

export function rateWeek(userId: string, weekId: string, stars: number, note: string) {
  if (!weeks.some((week) => week.id === weekId)) return false;
  if (stars < 1 || stars > 5) return false;
  ensureClassbook();
  getDb()
    .prepare(
      `INSERT INTO keel_rating (user_id, week_id, stars, note, created_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id, week_id) DO UPDATE SET stars = excluded.stars, note = excluded.note, created_at = excluded.created_at`,
    )
    .run(userId, weekId, stars, note.slice(0, 500), Date.now());
  return true;
}

export function ratings(): { weekId: string; stars: number; count: number }[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(`SELECT week_id, AVG(stars) AS stars, COUNT(*) AS count FROM keel_rating GROUP BY week_id`)
    .all() as { week_id: string; stars: number; count: number }[];
  return rows.map((row) => ({ weekId: row.week_id, stars: row.stars, count: row.count }));
}

export function saveSurvey(input: { userId: string; helped: boolean; why: string; better: string; ease: number; recommend: boolean }) {
  if (input.why.trim().length < 20 || input.better.trim().length < 20) return false;
  if (input.ease < 1 || input.ease > 5) return false;
  ensureClassbook();
  getDb()
    .prepare(
      `INSERT INTO keel_survey (user_id, helped, why, better, ease, recommend, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET helped = excluded.helped, why = excluded.why, better = excluded.better, ease = excluded.ease, recommend = excluded.recommend, created_at = excluded.created_at`,
    )
    .run(input.userId, input.helped ? 1 : 0, input.why.trim().slice(0, 2000), input.better.trim().slice(0, 2000), input.ease, input.recommend ? 1 : 0, Date.now());
  return true;
}

export function surveyFor(userId: string) {
  ensureClassbook();
  const row = getDb()
    .prepare(`SELECT helped, why, better, ease, recommend FROM keel_survey WHERE user_id = ?`)
    .get(userId) as { helped: number; why: string; better: string; ease: number; recommend: number } | undefined;
  if (!row) return null;
  return { helped: row.helped === 1, why: row.why, better: row.better, ease: row.ease, recommend: row.recommend === 1 };
}

export type HeldReview = {
  id: string;
  weekId: string;
  userId: string;
  name: string;
  sha256: string;
  assessment: boolean;
  coverage: number;
  plagiarism: boolean;
  similarity: number;
  match: ReviewResult["match"];
  createdAt: number;
};

export function reviewAndDiscard(input: { weekId: string; userId: string; name: string; mime: string; bytes: Buffer }): HeldReview | null {
  const week = weeks.find((item) => item.id === input.weekId);
  if (!week) return null;
  if (input.bytes.length < 1 || input.bytes.length > 4_000_000) return null;
  ensureClassbook();
  const work = workFor(input.weekId);
  const text = extractText(input.bytes, input.mime, input.name);
  const sha256 = fileHash(input.bytes);
  const peers = peerPrints(input.weekId, input.userId);
  const reviewed = reviewDocument({ text, weekBrief: `${week.title} ${week.promise} ${work?.brief ?? ""}`, sha256, peers });
  const id = randomBytes(12).toString("hex");
  const createdAt = Date.now();
  const db = getDb();
  db.prepare(
    `INSERT INTO keel_review (id, user_id, week_id, sha256, bytes, assessment, coverage, plagiarism, similarity, match_kind, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, input.userId, input.weekId, reviewed.sha256, input.bytes.length, reviewed.assessment ? 1 : 0, reviewed.coverage, reviewed.plagiarism ? 1 : 0, reviewed.similarity, reviewed.match, createdAt);
  const insert = db.prepare(`INSERT INTO keel_fingerprint (review_id, shingle) VALUES (?, ?)`);
  for (const shingle of reviewed.shingles) insert.run(id, shingle);
  return {
    id,
    weekId: input.weekId,
    userId: input.userId,
    name: input.userId,
    sha256: reviewed.sha256,
    assessment: reviewed.assessment,
    coverage: reviewed.coverage,
    plagiarism: reviewed.plagiarism,
    similarity: reviewed.similarity,
    match: reviewed.match,
    createdAt,
  };
}

function peerPrints(weekId: string, userId: string): { sha256: string; shingles: string[] }[] {
  const reviews = getDb()
    .prepare(`SELECT id, sha256 FROM keel_review WHERE week_id = ? AND user_id != ?`)
    .all(weekId, userId) as { id: string; sha256: string }[];
  return reviews.map((review) => ({
    sha256: review.sha256,
    shingles: (getDb().prepare(`SELECT shingle FROM keel_fingerprint WHERE review_id = ?`).all(review.id) as { shingle: string }[]).map((row) => row.shingle),
  }));
}

export function reviewsFor(weekId: string, userId: string, staff: boolean): HeldReview[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(
      `SELECT id, user_id, week_id, sha256, assessment, coverage, plagiarism, similarity, match_kind, created_at
       FROM keel_review WHERE week_id = ? ORDER BY created_at DESC`,
    )
    .all(weekId) as {
    id: string;
    user_id: string;
    week_id: string;
    sha256: string;
    assessment: number;
    coverage: number;
    plagiarism: number;
    similarity: number;
    match_kind: ReviewResult["match"];
    created_at: number;
  }[];
  return rows
    .filter((row) => staff || row.user_id === userId)
    .map((row) => ({
      id: row.id,
      weekId: row.week_id,
      userId: staff ? row.user_id : "",
      name: staff ? row.user_id : "",
      sha256: row.sha256.slice(0, 12),
      assessment: row.assessment === 1,
      coverage: row.coverage,
      plagiarism: row.plagiarism === 1,
      similarity: row.similarity,
      match: row.match_kind,
      createdAt: row.created_at,
    }));
}

export function allReviews(): HeldReview[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(
      `SELECT r.id, r.user_id, r.week_id, r.sha256, r.assessment, r.coverage, r.plagiarism, r.similarity, r.match_kind, r.created_at,
              coalesce(p.display_name, 'Learner') AS name
       FROM keel_review r
       LEFT JOIN keel_profile p ON p.user_id = r.user_id
       ORDER BY r.created_at DESC LIMIT 80`,
    )
    .all() as {
    id: string;
    user_id: string;
    week_id: string;
    sha256: string;
    assessment: number;
    coverage: number;
    plagiarism: number;
    similarity: number;
    match_kind: ReviewResult["match"];
    created_at: number;
    name: string;
  }[];
  return rows.map((row) => ({
    id: row.id,
    weekId: row.week_id,
    userId: row.user_id,
    name: row.name,
    sha256: row.sha256.slice(0, 12),
    assessment: row.assessment === 1,
    coverage: row.coverage,
    plagiarism: row.plagiarism === 1,
    similarity: row.similarity,
    match: row.match_kind,
    createdAt: row.created_at,
  }));
}

export type CourseRow = WorkWindow & { id: string; title: string; summary: string };
export type AnnouncementRow = { id: string; courseId: string; title: string; body: string; status: WorkWindow["status"]; publishAt: number | null };

export function listCourses(): CourseRow[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(`SELECT id, title, summary, status, opens_at, closes_at FROM keel_course ORDER BY updated_at DESC`)
    .all() as { id: string; title: string; summary: string; status: WorkWindow["status"]; opens_at: number | null; closes_at: number | null }[];
  return rows.map((row) => ({ id: row.id, title: row.title, summary: row.summary, status: row.status, opensAt: row.opens_at, closesAt: row.closes_at }));
}

export function courseById(id: string): CourseRow | null {
  return listCourses().find((course) => course.id === id) ?? null;
}

export function saveCourse(input: { id?: string; title: string; summary: string; status: WorkWindow["status"]; opensAt: number | null; closesAt: number | null; userId: string }): string | null {
  const title = input.title.trim().slice(0, 120);
  const summary = input.summary.trim().slice(0, 2000);
  if (title.length < 2 || summary.length < 2) return null;
  ensureClassbook();
  const id = input.id && courseById(input.id) ? input.id : `c${randomBytes(6).toString("hex")}`;
  getDb()
    .prepare(
      `INSERT INTO keel_course (id, title, summary, status, opens_at, closes_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, summary = excluded.summary, status = excluded.status, opens_at = excluded.opens_at, closes_at = excluded.closes_at, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    )
    .run(id, title, summary, input.status, input.opensAt, input.closesAt, Date.now(), input.userId);
  return id;
}

export function deleteCourse(id: string): boolean {
  if (!courseById(id)) return false;
  ensureClassbook();
  getDb().prepare(`DELETE FROM keel_course WHERE id = ?`).run(id);
  getDb().prepare(`DELETE FROM keel_announcement WHERE course_id = ?`).run(id);
  return true;
}

export function listAnnouncements(): AnnouncementRow[] {
  ensureClassbook();
  const rows = getDb()
    .prepare(`SELECT id, course_id, title, body, status, publish_at FROM keel_announcement ORDER BY coalesce(publish_at, updated_at) DESC`)
    .all() as { id: string; course_id: string | null; title: string; body: string; status: WorkWindow["status"]; publish_at: number | null }[];
  return rows.map((row) => ({ id: row.id, courseId: row.course_id ?? "", title: row.title, body: row.body, status: row.status, publishAt: row.publish_at }));
}

export function saveAnnouncement(input: { id?: string; courseId: string; title: string; body: string; status: WorkWindow["status"]; publishAt: number | null; userId: string }): string | null {
  const title = input.title.trim().slice(0, 140);
  const body = input.body.trim().slice(0, 2000);
  if (title.length < 2 || body.length < 2) return null;
  ensureClassbook();
  const id = input.id && listAnnouncements().some((item) => item.id === input.id) ? input.id : `a${randomBytes(6).toString("hex")}`;
  getDb()
    .prepare(
      `INSERT INTO keel_announcement (id, course_id, title, body, status, publish_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET course_id = excluded.course_id, title = excluded.title, body = excluded.body, status = excluded.status, publish_at = excluded.publish_at, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    )
    .run(id, input.courseId || null, title, body, input.status, input.publishAt, Date.now(), input.userId);
  return id;
}

export function deleteAnnouncement(id: string): boolean {
  ensureClassbook();
  const row = getDb().prepare(`SELECT id FROM keel_announcement WHERE id = ?`).get(id);
  if (!row) return false;
  getDb().prepare(`DELETE FROM keel_announcement WHERE id = ?`).run(id);
  return true;
}

export function createInvite(userId: string): string {
  ensureClassbook();
  const code = randomBytes(4).toString("hex");
  getDb().prepare(`INSERT INTO keel_invite (code, from_user, created_at) VALUES (?, ?, ?)`).run(code, userId, Date.now());
  return code;
}
