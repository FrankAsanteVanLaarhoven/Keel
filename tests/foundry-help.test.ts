import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FOUNDRY_HELP } from "../lib/foundry-help";

describe("foundry help", () => {
  it("points at the guide, the samples, the extension calls, and the grant", () => {
    const text = FOUNDRY_HELP.flatMap((section) => [...section.paragraphs, ...(section.points ?? []), ...(section.links ?? []).map((link) => `${link.label} ${link.href}`)]).join("\n");
    const ids = FOUNDRY_HELP.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(text).toContain("Apache-2.0");
    expect(text).toContain("Frank Asante Van Laarhoven");
    expect(text).toContain("no key");
    expect(text).toContain("keel.tool");
    expect(text).toContain("keel.command");
    expect(text).toContain("specVersion 2.0-keel-foundry");
    expect(text).toContain("Harbor Library domain");
    expect(text).toContain("/foundry/guide");
    expect(text).toContain("/teach");
    expect(text).toContain("/foundry?challenge=c1_security");
    expect(text).toContain("no forum");
    expect(text).toContain("no support inbox");
    expect(text).not.toMatch(/StarUML|XMI|mailto:/);
  });

  it("is linked from the desk and the guide", () => {
    const page = readFileSync(new URL("../app/foundry/help/page.tsx", import.meta.url), "utf8");
    const guide = readFileSync(new URL("../app/foundry/guide/page.tsx", import.meta.url), "utf8");
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    expect(page).toContain("Foundry help");
    expect(page).toContain('href="/foundry"');
    expect(page).toContain("FOUNDRY_HELP");
    expect(guide).toContain('href="/foundry/help"');
    expect(lab).toContain('href="/foundry/help"');
    expect(lab).toContain(">Help</Link>");
    expect(page).not.toMatch(/StarUML|XMI|mailto:/);
  });
});
