import { json } from "@/lib/http";
import { opsIds } from "@/lib/ops/meta";
import { liveEnabled } from "@/lib/server/live";
import { userFrom } from "@/lib/ready";
import { getConsent, getProfile, likeMap, progressSummary, setProfile } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  const likes = likeMap(user?.id);
  const live = liveEnabled();
  if (!user) return json({ signedIn: false, live, likes });
  const profile = getProfile(user.id);
  const superEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase();
  if (superEmail && user.email.toLowerCase() === superEmail && profile?.role !== "super_admin") {
    setProfile(user.id, profile?.display_name || user.name || "Frank Asante Van Laarhoven", "super_admin");
  }
  const summary = progressSummary(user.id, new Date().toISOString().slice(0, 10));
  const progress: Record<string, { check: boolean; bench: boolean; case: boolean }> = {};
  const ops: Record<string, { check: boolean; lab: boolean; case: boolean }> = {};
  for (const id of opsIds) ops[id] = { check: false, lab: false, case: false };
  for (const row of summary.rows) {
    if ((opsIds as readonly string[]).includes(row.itemId) && row.score === 1) {
      if (row.kind === "check") ops[row.itemId].check = true;
      if (row.kind === "lab") ops[row.itemId].lab = true;
      if (row.kind === "ops-case") ops[row.itemId].case = true;
    }
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
    ops,
    opsBrief: summary.rows.some((row) => row.kind === "ops-brief" && row.score === 1),
    foundryDone: summary.rows.filter((row) => row.kind === "foundry" && row.score === 1).map((row) => row.itemId),
    likes,
  });
}
