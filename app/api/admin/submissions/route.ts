import { json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { getProfile, getCohortSubmissions } from "@/lib/store";
import { isStaffOrAdmin } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) {
    return json({ error: "auth" }, 401);
  }

  const profile = getProfile(user.id);
  const allowed = isStaffOrAdmin(profile?.role, user.email);

  if (!allowed) {
    return json({ error: "forbidden", message: "Super admin or staff teacher role required." }, 403);
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") || undefined;

  const submissions = getCohortSubmissions(kind);

  // Calculate cohort evaluation metrics
  const totalSubmissions = submissions.length;
  const verifiedCount = submissions.filter((s) => s.verified === 1).length;
  const uniqueStudents = new Set(submissions.map((s) => s.userId)).size;
  const harborCompleted = submissions.filter((s) => s.kind === "brief" && s.score === 1).length;
  const avgScore = totalSubmissions > 0
    ? Math.round((submissions.reduce((acc, s) => acc + s.score, 0) / totalSubmissions) * 100)
    : 0;

  return json({
    cohort: {
      totalSubmissions,
      verifiedCount,
      uniqueStudents,
      harborCompleted,
      avgScorePercent: avgScore,
    },
    submissions,
  });
}
