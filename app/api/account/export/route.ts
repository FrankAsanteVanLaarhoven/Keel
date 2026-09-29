import { userFrom } from "@/lib/ready";
import { exportFor } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return new Response("auth", { status: 401, headers: { "cache-control": "private, no-store" } });
  const data = { email: user.email, ...(await exportFor(user.id)) };
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": "attachment; filename=\"keel-data.json\"",
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
