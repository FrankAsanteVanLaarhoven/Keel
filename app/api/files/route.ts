import { filesFor, reviewAndDiscard, saveUpload } from "@/lib/classbook";
import { json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const week = new URL(request.url).searchParams.get("week") ?? "";
  const staff = isStaffOrAdmin(getProfile(user.id)?.role, user.email);
  return json({ files: filesFor(week, user.id, staff) });
}

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const form = await request.formData();
  const weekId = String(form.get("weekId") ?? "");
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "file" }, 400);
  const staff = isStaffOrAdmin(getProfile(user.id)?.role, user.email);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (form.get("scope") === "class" && staff) {
    const saved = saveUpload({ weekId, userId: user.id, name: file.name, mime: file.type || "application/octet-stream", bytes, scope: "class" });
    if (!saved) return json({ error: "file" }, 400);
    return json({ file: saved });
  }
  const review = reviewAndDiscard({ weekId, userId: user.id, name: file.name, mime: file.type || "application/octet-stream", bytes });
  if (!review) return json({ error: "file" }, 400);
  return json({ review });
}
