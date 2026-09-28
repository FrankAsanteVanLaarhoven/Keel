import { auth } from "@/lib/auth";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { cleanName, roleFor } from "@/lib/security";
import { setProfile } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const gated = await guard(request, "profile", 10, 60 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { displayName?: string; role?: unknown };
  const name = cleanName(body.displayName ?? "");
  if (!name) return json({ error: "name" }, 400);
  const role = roleFor(user.email, body.role);
  setProfile(user.id, name, role);
  await auth.api.updateUser({ body: { name }, headers: request.headers });
  return json({ ok: true });
}
