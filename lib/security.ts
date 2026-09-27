import type { Locale } from "./locale";

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function cleanName(input: string): string | null {
  const name = input.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 40) return null;
  if (name.includes("@") || /[\r\n\t]/.test(name)) return null;
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .'\-]*$/u.test(name)) return null;
  return name;
}

export function cleanRole(input: unknown): "super_admin" | "staff" | "student" {
  if (input === "super_admin") return "super_admin";
  if (input === "staff") return "staff";
  return "student";
}

export function isStaffOrAdmin(role?: string | null, email?: string | null): boolean {
  if (role === "super_admin" || role === "staff") return true;
  if (email && process.env.SUPER_ADMIN_EMAIL && email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase()) return true;
  return false;
}

export function noteMinimum(locale: Locale): number {
  return locale === "zh" || locale === "ja" ? 40 : 80;
}

export function noteOk(note: string, locale: Locale, hint: string): boolean {
  const trimmed = note.trim();
  if (trimmed.length < noteMinimum(locale) || trimmed.length > 2000) return false;
  const compact = trimmed.replace(/\s+/g, "");
  if (/^(.)\1+$/u.test(compact)) return false;
  if (trimmed === hint.trim()) return false;
  return true;
}

export function clientDay(input: unknown, now = Date.now()): string {
  const utc = new Date(now).toISOString().slice(0, 10);
  if (typeof input !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return utc;
  const stamp = Date.parse(`${input}T00:00:00Z`);
  if (Number.isNaN(stamp)) return utc;
  if (Math.abs(stamp - now) > 36 * 60 * 60 * 1000) return utc;
  return input;
}

export function utcWeekStart(now = Date.now()): number {
  const date = new Date(now);
  const sinceMonday = (date.getUTCDay() + 6) % 7;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - sinceMonday);
}

export function cacheControlFor(pathname: string): string {
  if (pathname.startsWith("/api/")) return "private, no-store";
  if (pathname.startsWith("/_next/static/")) return "public, max-age=31536000, immutable";
  return "private, no-cache";
}

export function mayCacheStatic(pathname: string, method: string, setCookie: boolean, cacheControl: string): boolean {
  if (method !== "GET" || setCookie) return false;
  if (pathname.startsWith("/api/")) return false;
  if (/no-store|private/i.test(cacheControl)) return false;
  return (
    pathname.startsWith("/_next/static/") ||
    pathname === "/icon.svg" ||
    pathname === "/pcm-worklet.js" ||
    pathname === "/manifest.webmanifest"
  );
}

export function leaderboardSql(): string {
  return `SELECT p.user_id AS user_id, p.display_name AS display_name,
      COALESCE(SUM(pr.xp), 0) AS xp,
      COALESCE(SUM(CASE WHEN pr.kind = 'case' AND pr.score = 1 THEN 1 ELSE 0 END), 0) AS cases
    FROM keel_profile p
    LEFT JOIN keel_progress pr ON pr.user_id = p.user_id AND (? IS NULL OR pr.updated_at >= ?)
    GROUP BY p.user_id, p.display_name
    HAVING COALESCE(SUM(pr.xp), 0) > 0
    ORDER BY xp DESC, cases DESC, p.display_name ASC
    LIMIT 20`;
}

export function clientBucket(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ip = forwarded.slice(0, 64).replace(/[^\w.:]/g, "") || "local";
  return `ip:${ip}`;
}

export async function readJson(request: Request, max = 20_000): Promise<unknown> {
  const text = await request.text();
  if (text.length > max) throw new Error("too_large");
  if (!text) return {};
  return JSON.parse(text) as unknown;
}
