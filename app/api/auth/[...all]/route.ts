import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { ensureReady } from "@/lib/ready";

const handler = toNextJsHandler(auth);

async function wrap(request: Request, method: "GET" | "POST") {
  await ensureReady();
  return handler[method](request);
}

export function GET(request: Request) {
  return wrap(request, "GET");
}

export function POST(request: Request) {
  return wrap(request, "POST");
}

export const runtime = "nodejs";
