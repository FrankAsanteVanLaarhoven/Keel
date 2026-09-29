import { sectionIds } from "@/lib/course/meta";
import { opsIds } from "@/lib/ops/meta";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { toggleLike } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const gated = await guard(request, "like", 30, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const sectionId = (gated.body as { sectionId?: string }).sectionId ?? "";
  const allowed = (sectionIds as readonly string[]).includes(sectionId) || (opsIds as readonly string[]).includes(sectionId);
  if (!allowed) return json({ error: "section" }, 404);
  return json(await toggleLike(user.id, sectionId));
}
