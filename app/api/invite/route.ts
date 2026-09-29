import { createInvite } from "@/lib/classbook";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const gated = await guard(request, "invite", 10, 10 * 60 * 1000, user.id);
  if (gated.error) return gated.error;
  const code = await createInvite(user.id);
  const origin = new URL(request.url).origin;
  return json({ code, url: `${origin}/sign-up?invite=${code}` });
}
