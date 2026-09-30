import { ensureRecords } from "@/lib/db";
import { json } from "@/lib/http";
import { sqlGet } from "@/lib/sql";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  try {
    await ensureRecords();
    await sqlGet(`SELECT 1 AS ok FROM keel_pipe_branch`);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "The class record is waking. Try again in a moment." }, 503);
  }
}
