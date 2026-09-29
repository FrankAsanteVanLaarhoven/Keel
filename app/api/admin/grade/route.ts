import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { getProfile, updateTeacherEvaluation } from "@/lib/store";
import { isStaffOrAdmin } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) {
    return json({ error: "auth" }, 401);
  }

  const profile = await getProfile(user.id);
  const allowed = isStaffOrAdmin(profile?.role, user.email);

  if (!allowed) {
    return json({ error: "forbidden", message: "Super admin or staff teacher role required." }, 403);
  }

  const gated = await guard(request, "admin_grade", 60, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") {
    return gated.error ?? json({ error: "body" }, 400);
  }

  const body = gated.body as {
    userId?: string;
    itemId?: string;
    kind?: string;
    score?: number;
    xp?: number;
    teacherFeedback?: string;
    verified?: number;
  };

  if (!body.userId || !body.itemId || !body.kind) {
    return json({ error: "missing_fields" }, 400);
  }

  const score = typeof body.score === "number" ? Math.max(0, Math.min(1, body.score)) : 1;
  const xp = typeof body.xp === "number" ? Math.max(0, Math.min(500, body.xp)) : undefined;
  const teacherFeedback = typeof body.teacherFeedback === "string" ? body.teacherFeedback.slice(0, 2000) : null;
  const verified = typeof body.verified === "number" ? body.verified : 1;

  await updateTeacherEvaluation({
    userId: body.userId,
    itemId: body.itemId,
    kind: body.kind,
    score,
    xp,
    teacherFeedback,
    verified,
  });

  return json({
    ok: true,
    saved: true,
    userId: body.userId,
    itemId: body.itemId,
    kind: body.kind,
    score,
    verified,
  });
}
