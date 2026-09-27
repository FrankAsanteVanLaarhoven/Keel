import { json } from "@/lib/http";
import { liveEnabled } from "@/lib/server/live";
import { userFrom } from "@/lib/ready";
import { getConsent, getProfile, likeMap, progressSummary } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  const likes = likeMap(user?.id);
  const live = liveEnabled();
  if (!user) return json({ signedIn: false, live, likes });
  const profile = getProfile(user.id);
  const summary = progressSummary(user.id, new Date().toISOString().slice(0, 10));
  const progress: Record<string, { check: boolean; bench: boolean; case: boolean }> = {};
  for (const row of summary.rows) {
    if (row.kind !== "check" && row.kind !== "bench" && row.kind !== "case") continue;
    progress[row.itemId] ??= { check: false, bench: false, case: false };
    if (row.score === 1) progress[row.itemId][row.kind] = true;
  }
  return json({
    signedIn: true,
    live,
    name: profile?.display_name || user.name,
    email: user.email,
    role: (profile?.role === "super_admin" || profile?.role === "staff")
      ? profile.role
      : (user.email && process.env.SUPER_ADMIN_EMAIL && user.email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase())
      ? "super_admin"
      : "student",
    consent: getConsent(user.id),
    xp: summary.xp,
    cases: summary.cases,
    streak: summary.streak,
    marks: summary.marks,
    progress,
    brief: summary.rows.some((row) => row.kind === "brief" && row.score === 1),
    likes,
  });
}
