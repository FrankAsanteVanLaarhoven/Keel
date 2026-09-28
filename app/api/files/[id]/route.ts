import { deleteUpload, readUpload } from "@/lib/classbook";
import { json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const { id } = await context.params;
  const staff = isStaffOrAdmin(getProfile(user.id)?.role, user.email);
  const found = readUpload(id, user.id, staff);
  if (!found) return json({ error: "file" }, 404);
  return new Response(new Uint8Array(found.bytes), {
    headers: {
      "content-type": found.file.mime,
      "content-disposition": `attachment; filename="${found.file.name.replace(/"/g, "")}"`,
      "cache-control": "private, no-store",
    },
  });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const { id } = await context.params;
  const staff = isStaffOrAdmin(getProfile(user.id)?.role, user.email);
  return json({ ok: deleteUpload(id, user.id, staff) });
}
