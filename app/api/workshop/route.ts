import { guard, json, settle } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";
import { cleanWorkshopTitle, createWorkshopPage, listWorkshopPages } from "@/lib/workshop";

export const runtime = "nodejs";
export const maxDuration = 30;

export function GET(request: Request) {
  return settle(async () => {
    const user = await userFrom(request);
    if (!user) return json({ error: "auth" }, 401);
    const profile = await getProfile(user.id);
    const staff = isStaffOrAdmin(profile?.role, user.email);
    return json({ pages: await listWorkshopPages(user.id, staff) });
  });
}

export function POST(request: Request) {
  return settle(async () => {
    const user = await userFrom(request);
    if (!user) return json({ error: "auth" }, 401);
    const gated = await guard(request, "workshop-create", 30, 60 * 60 * 1000, user.id);
    if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
    const title = cleanWorkshopTitle((gated.body as { title?: unknown }).title);
    if (!title) return json({ error: "body" }, 400);
    const created = await createWorkshopPage(user.id, title);
    return json({ id: created.id }, 201);
  });
}
