import { randomBytes } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { dataDir, ensureRecords, insertProfile, wipeUser } from "./db";
import { authDatabase } from "./sql";
import { publicOrigin } from "./public-origin";
import { cleanName, isDesignatedAdmin, publicSignInLimit, publicSignUpLimit } from "./security";

mkdirSync(dataDir, { recursive: true });
void ensureRecords();

function secret(): string {
  const fromEnv = process.env.BETTER_AUTH_SECRET?.trim();
  if (fromEnv) {
    if (fromEnv.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
    return fromEnv;
  }
  const file = path.join(dataDir, "secret");
  if (existsSync(file)) return readFileSync(file, "utf8").trim();
  const created = randomBytes(48).toString("base64url");
  writeFileSync(file, created, { mode: 0o600, flag: "wx" });
  chmodSync(file, 0o600);
  return created;
}

export const baseURL = publicOrigin();

export const auth = betterAuth({
  appName: "Keel",
  baseURL,
  secret: secret(),
  database: authDatabase(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await wipeUser(user.id);
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
    customRules: {
      "/sign-in/email": { window: publicSignInLimit.windowSeconds, max: publicSignInLimit.max },
      "/sign-up/email": { window: publicSignUpLimit.windowSeconds, max: publicSignUpLimit.max },
    },
  },
  trustedOrigins: [
    baseURL,
    "http://127.0.0.1:3960",
    "http://localhost:3960",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "",
  ].filter(Boolean),
  advanced: {
    useSecureCookies: baseURL.startsWith("https://"),
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const name = cleanName(user.name) ?? "Learner";
          await insertProfile(user.id, name, isDesignatedAdmin(user.email) ? "super_admin" : "student");
        },
      },
    },
  },
  plugins: [nextCookies()],
});
