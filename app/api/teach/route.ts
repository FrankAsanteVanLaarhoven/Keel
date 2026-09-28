import { cohort, deleteAnnouncement, deleteCourse, listAnnouncements, listAttempts, listCourses, listWork, restoreWork, saveAnnouncement, saveCourse, saveWork } from "@/lib/classbook";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";

export const runtime = "nodejs";

async function teacher(request: Request) {
  const user = await userFrom(request);
  if (!user) return { user: null, ok: false };
  const profile = getProfile(user.id);
  return { user, ok: isStaffOrAdmin(profile?.role, user.email) };
}

export async function GET(request: Request) {
  const access = await teacher(request);
  if (!access.user) return json({ error: "auth" }, 401);
  if (!access.ok) return json({ error: "forbidden" }, 403);
  const url = new URL(request.url);
  const student = url.searchParams.get("student") ?? "";
  return json({
    cohort: cohort(),
    work: listWork(),
    courses: listCourses(),
    announcements: listAnnouncements(),
    attempts: listAttempts(student || undefined).slice(0, 200),
  });
}

export async function POST(request: Request) {
  const access = await teacher(request);
  if (!access.user) return json({ error: "auth" }, 401);
  if (!access.ok) return json({ error: "forbidden" }, 403);
  const gated = await guard(request, "teach", 40, 10 * 60 * 1000, access.user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as {
    action?: string;
    id?: string;
    title?: string;
    brief?: string;
    summary?: string;
    body?: string;
    courseId?: string;
    status?: string;
    opensAt?: number | null;
    closesAt?: number | null;
    publishAt?: number | null;
  };
  const status = body.status === "draft" || body.status === "scheduled" || body.status === "paused" || body.status === "published" ? body.status : null;
  if (body.action === "restore" && body.id) return json({ ok: restoreWork(body.id) });
  if (body.action === "course" && status && body.title && body.summary) {
    const id = saveCourse({ id: body.id, title: body.title, summary: body.summary, status, opensAt: stamp(body.opensAt), closesAt: stamp(body.closesAt), userId: access.user.id });
    return json({ ok: Boolean(id), id }, id ? 200 : 400);
  }
  if (body.action === "course-delete" && body.id) return json({ ok: deleteCourse(body.id) });
  if (body.action === "announce" && status && body.title && body.body) {
    const id = saveAnnouncement({ id: body.id, courseId: body.courseId ?? "", title: body.title, body: body.body, status, publishAt: stamp(body.publishAt), userId: access.user.id });
    return json({ ok: Boolean(id), id }, id ? 200 : 400);
  }
  if (body.action === "announce-delete" && body.id) return json({ ok: deleteAnnouncement(body.id) });
  if (!body.id || !status || !body.title || !body.brief) return json({ error: "body" }, 400);
  const ok = saveWork({
    id: body.id,
    title: body.title,
    brief: body.brief,
    status,
    opensAt: typeof body.opensAt === "number" ? body.opensAt : null,
    closesAt: typeof body.closesAt === "number" ? body.closesAt : null,
    userId: access.user.id,
  });
  return json({ ok }, ok ? 200 : 404);
}

function stamp(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
