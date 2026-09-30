import { randomBytes } from "node:crypto";
import { ensureRecords } from "./db";
import { sqlAll, sqlGet, sqlRun } from "./sql";

export const workshopBodyLimit = 80_000;
export const workshopTitleLimit = 80;
export const workshopNoteLimit = 1_000;
export const workshopRevisionKeep = 40;
export const workshopSeenMs = 45_000;

export const workshopTemplate = `## What we are building

## Who it is for

## What we decided

## What is still to check
`;

export type WorkshopStatus = "draft" | "published";
export type WorkshopAccess = "edit" | "read" | "none";

export function cleanWorkshopTitle(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const title = input.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (title.length < 2 || title.length > workshopTitleLimit) return null;
  if (/[\r\n\u0000]/.test(title)) return null;
  return title;
}

export function cleanWorkshopBody(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const body = input.replace(/\r\n/g, "\n");
  if (body.length > workshopBodyLimit || body.includes("\u0000")) return null;
  return body;
}

export function cleanWorkshopNote(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const note = input.replace(/\r\n/g, "\n").trim();
  if (note.length < 2 || note.length > workshopNoteLimit || note.includes("\u0000")) return null;
  return note;
}

export function workshopAccess(input: {
  actorId?: string | null;
  staff: boolean;
  ownerId: string;
  memberIds: string[];
  status: WorkshopStatus;
}): WorkshopAccess {
  if (!input.actorId) return "none";
  if (input.actorId === input.ownerId || input.memberIds.includes(input.actorId)) return "edit";
  if (input.staff || input.status === "published") return "read";
  return "none";
}

type PageRow = {
  id: string;
  title: string;
  body: string;
  revision: number;
  status: WorkshopStatus;
  owner_id: string;
  updated_at: number;
  updated_by: string;
  owner_name?: string;
};

async function membersOf(pageId: string) {
  return sqlAll<{ user_id: string; display_name: string }>(
    `SELECT m.user_id AS user_id, p.display_name AS display_name
     FROM keel_page_member m
     JOIN keel_profile p ON p.user_id = m.user_id
     WHERE m.page_id = ?
     ORDER BY p.display_name`,
    [pageId],
  );
}

async function pageRow(pageId: string) {
  return sqlGet<PageRow>(
    `SELECT p.id, p.title, p.body, p.revision, p.status, p.owner_id, p.updated_at, p.updated_by,
        owner.display_name AS owner_name
     FROM keel_page p
     LEFT JOIN keel_profile owner ON owner.user_id = p.owner_id
     WHERE p.id = ?`,
    [pageId],
  );
}

function presentPage(row: PageRow, access: WorkshopAccess, members: { user_id: string; display_name: string }[]) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    revision: Number(row.revision),
    status: row.status,
    ownerId: row.owner_id,
    ownerName: row.owner_name || "Learner",
    updatedAt: Number(row.updated_at),
    updatedBy: row.updated_by,
    access,
    members: members.map((member) => ({ id: member.user_id, name: member.display_name })),
  };
}

export async function createWorkshopPage(ownerId: string, title: string) {
  await ensureRecords();
  const id = randomBytes(12).toString("hex");
  const now = Date.now();
  const body = workshopTemplate;
  await sqlRun(
    `INSERT INTO keel_page (id, title, body, revision, status, owner_id, updated_at, updated_by)
     VALUES (?, ?, ?, 1, 'draft', ?, ?, ?)`,
    [id, title, body, ownerId, now, ownerId],
  );
  await sqlRun(
    `INSERT INTO keel_page_revision (page_id, revision, title, body, author_id, created_at)
     VALUES (?, 1, ?, ?, ?, ?)`,
    [id, title, body, ownerId, now],
  );
  return { id, revision: 1 };
}

export async function listWorkshopPages(actorId: string, staff: boolean) {
  await ensureRecords();
  const rows = await sqlAll<PageRow & { owner_name: string }>(
    staff
      ? `SELECT p.id, p.title, p.body, p.revision, p.status, p.owner_id, p.updated_at, p.updated_by,
            owner.display_name AS owner_name
         FROM keel_page p
         LEFT JOIN keel_profile owner ON owner.user_id = p.owner_id
         ORDER BY p.updated_at DESC
         LIMIT 100`
      : `SELECT p.id, p.title, p.body, p.revision, p.status, p.owner_id, p.updated_at, p.updated_by,
            owner.display_name AS owner_name
         FROM keel_page p
         LEFT JOIN keel_profile owner ON owner.user_id = p.owner_id
         WHERE p.owner_id = ?
            OR p.status = 'published'
            OR p.id IN (SELECT page_id FROM keel_page_member WHERE user_id = ?)
         ORDER BY p.updated_at DESC
         LIMIT 100`,
    staff ? [] : [actorId, actorId],
  );
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    revision: Number(row.revision),
    ownerName: row.owner_name || "Learner",
    mine: row.owner_id === actorId,
    updatedAt: Number(row.updated_at),
  }));
}

export async function readWorkshopPage(actorId: string, staff: boolean, pageId: string) {
  await ensureRecords();
  const row = await pageRow(pageId);
  if (!row) return { error: "missing" as const };
  const members = await membersOf(pageId);
  const access = workshopAccess({
    actorId,
    staff,
    ownerId: row.owner_id,
    memberIds: members.map((member) => member.user_id),
    status: row.status,
  });
  if (access === "none") return { error: "forbidden" as const };
  const now = Date.now();
  await sqlRun(
    `INSERT INTO keel_page_seen (page_id, user_id, seen_at) VALUES (?, ?, ?)
     ON CONFLICT(page_id, user_id) DO UPDATE SET seen_at = excluded.seen_at`,
    [pageId, actorId, now],
  );
  const [notes, revisions, here] = await Promise.all([
    sqlAll<{ id: string; body: string; created_at: number; display_name: string }>(
      `SELECT n.id, n.body, n.created_at, p.display_name
       FROM keel_page_note n
       LEFT JOIN keel_profile p ON p.user_id = n.author_id
       WHERE n.page_id = ?
       ORDER BY n.created_at DESC
       LIMIT 40`,
      [pageId],
    ),
    sqlAll<{ revision: number; title: string; created_at: number; display_name: string }>(
      `SELECT r.revision, r.title, r.created_at, p.display_name
       FROM keel_page_revision r
       LEFT JOIN keel_profile p ON p.user_id = r.author_id
       WHERE r.page_id = ?
       ORDER BY r.revision DESC
       LIMIT 40`,
      [pageId],
    ),
    sqlAll<{ display_name: string }>(
      `SELECT p.display_name
       FROM keel_page_seen s
       JOIN keel_profile p ON p.user_id = s.user_id
       WHERE s.page_id = ? AND s.seen_at >= ? AND s.user_id <> ?
       ORDER BY p.display_name`,
      [pageId, now - workshopSeenMs, actorId],
    ),
  ]);
  return {
    error: null,
    manage: row.owner_id === actorId || staff,
    page: presentPage(row, access, members),
    notes: notes.map((note) => ({ id: note.id, body: note.body, at: Number(note.created_at), name: note.display_name || "Learner" })),
    revisions: revisions.map((revision) => ({
      revision: Number(revision.revision),
      title: revision.title,
      at: Number(revision.created_at),
      name: revision.display_name || "Learner",
    })),
    here: here.map((person) => person.display_name),
  };
}

async function writable(actorId: string, staff: boolean, pageId: string) {
  const row = await pageRow(pageId);
  if (!row) return { error: "missing" as const, row: null, members: [] as { user_id: string; display_name: string }[] };
  const members = await membersOf(pageId);
  const access = workshopAccess({
    actorId,
    staff,
    ownerId: row.owner_id,
    memberIds: members.map((member) => member.user_id),
    status: row.status,
  });
  if (access !== "edit") return { error: "forbidden" as const, row, members };
  return { error: null, row, members };
}

export async function saveWorkshopPage(actorId: string, staff: boolean, pageId: string, title: string, body: string, revision: number) {
  await ensureRecords();
  const gate = await writable(actorId, staff, pageId);
  if (gate.error || !gate.row) return { ok: false as const, error: gate.error ?? "missing", current: null };
  if (Number(gate.row.revision) !== revision) {
    return { ok: false as const, error: "conflict" as const, current: presentPage(gate.row, "edit", gate.members) };
  }
  const next = revision + 1;
  const now = Date.now();
  await sqlRun(
    `UPDATE keel_page SET title = ?, body = ?, revision = ?, updated_at = ?, updated_by = ? WHERE id = ? AND revision = ?`,
    [title, body, next, now, actorId, pageId, revision],
  );
  const stored = await pageRow(pageId);
  if (!stored || Number(stored.revision) !== next) {
    const current = stored ? presentPage(stored, "edit", gate.members) : null;
    return { ok: false as const, error: "conflict" as const, current };
  }
  await sqlRun(
    `INSERT INTO keel_page_revision (page_id, revision, title, body, author_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [pageId, next, title, body, actorId, now],
  );
  await sqlRun(`DELETE FROM keel_page_revision WHERE page_id = ? AND revision <= ?`, [pageId, next - workshopRevisionKeep]);
  return { ok: true as const, revision: next };
}

export async function setWorkshopStatus(actorId: string, staff: boolean, pageId: string, status: WorkshopStatus) {
  await ensureRecords();
  const row = await pageRow(pageId);
  if (!row) return { ok: false as const, error: "missing" as const };
  if (row.owner_id !== actorId && !staff) return { ok: false as const, error: "forbidden" as const };
  await sqlRun(`UPDATE keel_page SET status = ?, updated_at = ? WHERE id = ?`, [status, Date.now(), pageId]);
  return { ok: true as const };
}

export async function addWorkshopMember(actorId: string, staff: boolean, pageId: string, displayName: string) {
  await ensureRecords();
  const row = await pageRow(pageId);
  if (!row) return { ok: false as const, error: "missing" as const };
  if (row.owner_id !== actorId && !staff) return { ok: false as const, error: "forbidden" as const };
  const name = displayName.normalize("NFKC").replace(/\s+/g, " ").trim();
  const found = await sqlAll<{ user_id: string }>(
    `SELECT user_id FROM keel_profile WHERE lower(display_name) = lower(?)`,
    [name],
  );
  if (found.length === 0) return { ok: false as const, error: "missing" as const };
  if (found.length > 1) return { ok: false as const, error: "ambiguous" as const };
  if (found[0].user_id === row.owner_id) return { ok: true as const };
  await sqlRun(
    `INSERT INTO keel_page_member (page_id, user_id) VALUES (?, ?) ON CONFLICT(page_id, user_id) DO NOTHING`,
    [pageId, found[0].user_id],
  );
  return { ok: true as const };
}

export async function addWorkshopNote(actorId: string, staff: boolean, pageId: string, body: string) {
  await ensureRecords();
  const row = await pageRow(pageId);
  if (!row) return { ok: false as const, error: "missing" as const };
  const members = await membersOf(pageId);
  const access = workshopAccess({
    actorId,
    staff,
    ownerId: row.owner_id,
    memberIds: members.map((member) => member.user_id),
    status: row.status,
  });
  if (access !== "edit" && !staff) return { ok: false as const, error: "forbidden" as const };
  const id = randomBytes(12).toString("hex");
  await sqlRun(`INSERT INTO keel_page_note (id, page_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?)`, [id, pageId, actorId, body, Date.now()]);
  return { ok: true as const };
}

export async function restoreWorkshopRevision(actorId: string, staff: boolean, pageId: string, revision: number) {
  await ensureRecords();
  const gate = await writable(actorId, staff, pageId);
  if (gate.error || !gate.row) return { ok: false as const, error: gate.error ?? "missing", current: null };
  const prior = await sqlGet<{ title: string; body: string }>(
    `SELECT title, body FROM keel_page_revision WHERE page_id = ? AND revision = ?`,
    [pageId, revision],
  );
  if (!prior) return { ok: false as const, error: "missing" as const, current: null };
  return saveWorkshopPage(actorId, staff, pageId, prior.title, prior.body, Number(gate.row.revision));
}

export async function deleteWorkshopPage(actorId: string, staff: boolean, pageId: string) {
  await ensureRecords();
  const row = await pageRow(pageId);
  if (!row) return { ok: false as const, error: "missing" as const };
  if (row.owner_id !== actorId && !staff) return { ok: false as const, error: "forbidden" as const };
  await sqlRun(`DELETE FROM keel_page_revision WHERE page_id = ?`, [pageId]);
  await sqlRun(`DELETE FROM keel_page_member WHERE page_id = ?`, [pageId]);
  await sqlRun(`DELETE FROM keel_page_note WHERE page_id = ?`, [pageId]);
  await sqlRun(`DELETE FROM keel_page_seen WHERE page_id = ?`, [pageId]);
  await sqlRun(`DELETE FROM keel_page WHERE id = ?`, [pageId]);
  return { ok: true as const };
}

export async function workshopExport(userId: string) {
  await ensureRecords();
  return sqlAll<{ id: string; title: string; status: string; body: string; updated_at: number }>(
    `SELECT id, title, status, body, updated_at FROM keel_page WHERE owner_id = ? ORDER BY updated_at`,
    [userId],
  );
}
