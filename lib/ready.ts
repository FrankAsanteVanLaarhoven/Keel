import { headers } from "next/headers";
import { auth } from "./auth";
import { ensureRecords } from "./db";

let pending: Promise<void> | null = null;

export function ensureReady(): Promise<void> {
  if (!pending) {
    pending = (async () => {
      await ensureRecords();
      const ctx = await auth.$context;
      if (typeof ctx.runMigrations === "function") await ctx.runMigrations();
    })().catch((error: unknown) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}

export async function userFrom(request: Request) {
  await ensureReady();
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

export async function currentUser() {
  await ensureReady();
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
