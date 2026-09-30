import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { json } from "@/lib/http";
import { takeToken } from "@/lib/rate";
import { ensureReady } from "@/lib/ready";
import { clientBucket, passphraseAttemptLimit, publicSignInLimit, publicSignUpLimit } from "@/lib/security";
import { isDatabaseWaking } from "@/lib/sql";

const handler = toNextJsHandler(auth);

async function signInEmail(request: Request): Promise<string> {
  try {
    const body = (await request.clone().json()) as { email?: unknown };
    return String(body.email ?? "").trim().toLowerCase();
  } catch {
    return "";
  }
}

async function limited(bucket: string, max: number, windowMs: number): Promise<Response | null> {
  const attempt = await takeToken(bucket, max, windowMs);
  if (attempt.ok) return null;
  return json({ error: "rate" }, 429, { "retry-after": String(attempt.retryAfter) });
}

async function wrap(request: Request, method: "GET" | "POST") {
  try {
    await ensureReady();
    const path = new URL(request.url).pathname;
    if (method === "POST" && path.endsWith("/sign-up/email")) {
      const blocked = await limited(`signup:${clientBucket(request)}`, publicSignUpLimit.max, publicSignUpLimit.windowSeconds * 1000);
      if (blocked) return blocked;
    }
    if (method === "POST" && path.endsWith("/sign-in/email")) {
      const blocked = await limited(`signin:${clientBucket(request)}`, publicSignInLimit.max, publicSignInLimit.windowSeconds * 1000);
      if (blocked) return blocked;
      const email = await signInEmail(request);
      if (email.includes("@")) {
        const byEmail = await limited(`signin-email:${email}`, passphraseAttemptLimit.max, passphraseAttemptLimit.windowMs);
        if (byEmail) return byEmail;
      }
    }
    return await handler[method](request);
  } catch (error) {
    if (isDatabaseWaking(error)) return json({ error: "waking" }, 503);
    return json({ error: "unavailable" }, 500);
  }
}

export function GET(request: Request) {
  return wrap(request, "GET");
}

export function POST(request: Request) {
  return wrap(request, "POST");
}

export const runtime = "nodejs";
export const maxDuration = 30;
