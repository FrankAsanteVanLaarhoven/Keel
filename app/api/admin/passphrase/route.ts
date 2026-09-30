import { auth } from "@/lib/auth";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { canResetPassphrase, isDesignatedAdmin, passphraseOk } from "@/lib/security";
import { isDatabaseWaking } from "@/lib/sql";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user || !isDesignatedAdmin(user.email)) return json({ error: "forbidden" }, 403);
  const gated = await guard(request, "passphrase-reset", 40, 60 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { email?: unknown; password?: unknown };
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email.includes("@") || !passphraseOk(password)) return json({ error: "body" }, 400);
  if (!canResetPassphrase(user.email, email)) return json({ error: "forbidden" }, 403);
  try {
    const ctx = await auth.$context;
    const found = await ctx.internalAdapter.findUserByEmail(email);
    if (!found?.user?.id) return json({ error: "missing" }, 404);
    const credential = await ctx.internalAdapter.findCredentialAccount(found.user.id);
    if (!credential) return json({ error: "missing" }, 404);
    const hashed = await ctx.password.hash(password);
    await ctx.internalAdapter.updatePassword(found.user.id, hashed);
    await ctx.internalAdapter.deleteUserSessions(found.user.id);
    return json({ ok: true });
  } catch (error) {
    if (isDatabaseWaking(error)) return json({ error: "waking" }, 503);
    return json({ error: "unavailable" }, 500);
  }
}
