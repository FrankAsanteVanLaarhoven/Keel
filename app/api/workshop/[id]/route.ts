import { guard, json, settle } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";
import {
  addWorkshopMember,
  addWorkshopNote,
  cleanWorkshopBody,
  cleanWorkshopNote,
  cleanWorkshopTitle,
  deleteWorkshopPage,
  readWorkshopPage,
  restoreWorkshopRevision,
  saveWorkshopPage,
  setWorkshopStatus,
} from "@/lib/workshop";

export const runtime = "nodejs";
export const maxDuration = 30;

async function actor(request: Request) {
  const user = await userFrom(request);
  if (!user) return null;
  const profile = await getProfile(user.id);
  return { id: user.id, staff: isStaffOrAdmin(profile?.role, user.email) };
}

export function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return settle(async () => {
    const who = await actor(request);
    if (!who) return json({ error: "auth" }, 401);
    const { id } = await context.params;
    const read = await readWorkshopPage(who.id, who.staff, id);
    if (read.error) return json({ error: read.error }, read.error === "missing" ? 404 : 403);
    return json(read);
  });
}

export function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return settle(async () => {
    const who = await actor(request);
    if (!who) return json({ error: "auth" }, 401);
    const { id } = await context.params;
    const gated = await guard(request, `workshop-save:${id}`, 40, 60 * 1000, who.id, 120_000);
    if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
    const body = gated.body as { title?: unknown; body?: unknown; revision?: unknown };
    const title = cleanWorkshopTitle(body.title);
    const text = cleanWorkshopBody(body.body);
    const revision = Number(body.revision);
    if (!title || text === null || !Number.isInteger(revision)) return json({ error: "body" }, 400);
    const saved = await saveWorkshopPage(who.id, who.staff, id, title, text, revision);
    if (!saved.ok) {
      const status = saved.error === "conflict" ? 409 : saved.error === "missing" ? 404 : 403;
      return json({ error: saved.error, current: saved.current }, status);
    }
    return json({ revision: saved.revision });
  });
}

export function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return settle(async () => {
    const who = await actor(request);
    if (!who) return json({ error: "auth" }, 401);
    const { id } = await context.params;
    const gated = await guard(request, `workshop-act:${id}`, 40, 60 * 1000, who.id, 8_000);
    if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
    const body = gated.body as { action?: unknown; name?: unknown; note?: unknown; status?: unknown; revision?: unknown };
    if (body.action === "status") {
      if (body.status !== "draft" && body.status !== "published") return json({ error: "body" }, 400);
      const result = await setWorkshopStatus(who.id, who.staff, id, body.status);
      if (!result.ok) return json({ error: result.error }, result.error === "missing" ? 404 : 403);
      return json({ ok: true });
    }
    if (body.action === "member") {
      const name = cleanWorkshopTitle(body.name);
      if (!name) return json({ error: "body" }, 400);
      const result = await addWorkshopMember(who.id, who.staff, id, name);
      if (!result.ok) {
        const status = result.error === "ambiguous" ? 409 : result.error === "missing" ? 404 : 403;
        return json({ error: result.error }, status);
      }
      return json({ ok: true });
    }
    if (body.action === "note") {
      const note = cleanWorkshopNote(body.note);
      if (!note) return json({ error: "body" }, 400);
      const result = await addWorkshopNote(who.id, who.staff, id, note);
      if (!result.ok) return json({ error: result.error }, result.error === "missing" ? 404 : 403);
      return json({ ok: true });
    }
    if (body.action === "restore") {
      const revision = Number(body.revision);
      if (!Number.isInteger(revision)) return json({ error: "body" }, 400);
      const result = await restoreWorkshopRevision(who.id, who.staff, id, revision);
      if (!result.ok) {
        const status = result.error === "conflict" ? 409 : result.error === "missing" ? 404 : 403;
        return json({ error: result.error, current: result.current }, status);
      }
      return json({ revision: result.revision });
    }
    return json({ error: "body" }, 400);
  });
}

export function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  return settle(async () => {
    const who = await actor(request);
    if (!who) return json({ error: "auth" }, 401);
    const gated = await guard(request, "workshop-delete", 20, 60 * 60 * 1000, who.id);
    if (gated.error) return gated.error;
    const { id } = await context.params;
    const result = await deleteWorkshopPage(who.id, who.staff, id);
    if (!result.ok) return json({ error: result.error }, result.error === "missing" ? 404 : 403);
    return json({ ok: true });
  });
}
