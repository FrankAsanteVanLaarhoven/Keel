import { afterAll, describe, expect, it } from "vitest";

const enabled = process.env.KEEL_POSTGRES_TEST === "1";

describe.skipIf(!enabled)("postgres records", () => {
  afterAll(async () => {
    const { postgresPool } = await import("../lib/sql");
    await postgresPool().end().catch(() => undefined);
  });

  it("keeps a profile, the week book, a class file, and a sign-up", async () => {
    const { auth } = await import("../lib/auth");
    const { ensureClassbook, listWork, saveUpload, readUpload, cohort } = await import("../lib/classbook");
    const { insertProfile, wipeUser, getCohortSubmissions } = await import("../lib/db");
    const { saveProgress } = await import("../lib/store");

    await ensureClassbook();
    const weeks = await listWork();
    expect(weeks).toHaveLength(12);

    const userId = "pg-smoke-user";
    await insertProfile(userId, "Smoke Learner", "student");
    await saveProgress({
      userId,
      itemId: weeks[0].id,
      kind: "check",
      correct: true,
      xp: 10,
      detail: "ok",
      day: "2026-09-29",
    });

    const saved = await saveUpload({
      weekId: weeks[0].id,
      userId,
      name: "handout.txt",
      mime: "text/plain",
      bytes: Buffer.from("class handout"),
      scope: "class",
    });
    expect(saved).not.toBeNull();
    const read = await readUpload(saved!.id, userId, true);
    expect(read?.bytes.toString()).toBe("class handout");

    const ctx = await auth.$context;
    if (typeof ctx.runMigrations === "function") await ctx.runMigrations();
    const { sqlRun } = await import("../lib/sql");
    await sqlRun(`DELETE FROM "user" WHERE email = ?`, ["keel-smoke@example.com"]);
    const signed = await auth.api.signUpEmail({
      body: {
        name: "Smoke Learner",
        email: "keel-smoke@example.com",
        password: "smoke-passphrase-1",
      },
    });
    expect(signed.user.email).toBe("keel-smoke@example.com");

    try {
      const people = await cohort();
      expect(people.some((person) => person.email === "keel-smoke@example.com")).toBe(true);
      const submissions = await getCohortSubmissions("check");
      expect(submissions.some((row) => row.userId === userId && row.score === 1)).toBe(true);
    } finally {
      const { sqlRun } = await import("../lib/sql");
      const { getProfile } = await import("../lib/store");
      for (let attempt = 0; attempt < 10; attempt += 1) {
        await sqlRun(`DELETE FROM "user" WHERE email = ?`, ["keel-smoke@example.com"]);
        if (signed.user.id) await wipeUser(signed.user.id);
        await wipeUser(userId);
        await sqlRun(
          `DELETE FROM keel_profile WHERE display_name = ? AND user_id NOT IN (SELECT id FROM "user")`,
          ["Smoke Learner"],
        );
        if (!signed.user.id || !(await getProfile(signed.user.id))) break;
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }
  });
});
