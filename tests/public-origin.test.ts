import { afterEach, describe, expect, it } from "vitest";
import { publicOrigin } from "../lib/public-origin";

const keys = ["BETTER_AUTH_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;
const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of keys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("public origin", () => {
  it("stays on the local class when no host is configured", () => {
    delete process.env.BETTER_AUTH_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;
    expect(publicOrigin()).toBe("http://127.0.0.1:3960");
  });

  it("prefers the configured class address over a Vercel host", () => {
    process.env.BETTER_AUTH_URL = "https://class.example";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "keelai-os.vercel.app";
    expect(publicOrigin()).toBe("https://class.example");
  });

  it("uses the Vercel production host when the class address is unset", () => {
    delete process.env.BETTER_AUTH_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "keelai-os.vercel.app";
    process.env.VERCEL_URL = "keel-abc.vercel.app";
    expect(publicOrigin()).toBe("https://keelai-os.vercel.app");
  });
});
