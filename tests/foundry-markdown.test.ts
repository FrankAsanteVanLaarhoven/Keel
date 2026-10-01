import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { htmlNotes } from "../lib/foundry-model";
import { markdownBlocks, markdownInlines } from "../lib/markdown";
import { SHARE_LIMIT, readShareMessage, shareRoom } from "../lib/foundry-share";

describe("foundry markdown", () => {
  it("reads a table, a task list, strikethrough, an ordered list, and an https link", () => {
    const blocks = markdownBlocks([
      "| Item | Status |",
      "| --- | --- |",
      "| Card | open |",
      "",
      "- [x] Find a book",
      "- [ ] Return it",
      "",
      "1. One",
      "2. Two",
      "",
      "See ~~old~~ at https://example.com/harbor",
      "",
      "<script>alert(1)</script>",
    ].join("\n"));
    expect(blocks.find((block) => block.type === "table")).toMatchObject({
      header: ["Item", "Status"],
      rows: [["Card", "open"]],
    });
    expect(blocks.find((block) => block.type === "task")).toMatchObject({
      items: [
        { checked: true, text: "Find a book" },
        { checked: false, text: "Return it" },
      ],
    });
    expect(blocks.find((block) => block.type === "ol")).toMatchObject({ items: ["One", "Two"] });
    expect(blocks.find((block) => block.type === "p" && block.text.includes("<script>"))).toMatchObject({
      text: "<script>alert(1)</script>",
    });
    const inlines = markdownInlines("See ~~old~~ at https://example.com/harbor");
    expect(inlines).toContainEqual({ type: "del", text: "old" });
    expect(inlines).toContainEqual({ type: "link", text: "https://example.com/harbor", href: "https://example.com/harbor" });
    const danger = markdownInlines("See [x](javascript:alert(1))");
    expect(danger.some((part) => part.type === "link")).toBe(false);
  });

  it("keeps a script and a javascript link as text in the HTML notes", () => {
    const html = htmlNotes([{
      name: "Harbor",
      nodes: [{
        id: "a",
        type: "note",
        label: "Card",
        documentation: "| A | B |\n| --- | --- |\n| 1 | ~~2~~ |\n\n- [x] Done\n\n<script>alert(1)</script>\n[go](javascript:alert(1))",
      }],
      connections: [],
    }], "Harbor");
    expect(html).toContain("<table>");
    expect(html).toContain("<del>2</del>");
    expect(html).toContain('type="checkbox" disabled checked');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("foundry share", () => {
  it("normalizes a room name and rejects a short one", () => {
    expect(shareRoom("Harbor")).toBe("harbor");
    expect(shareRoom("Harbor Library")).toBe("harbor-library");
    expect(shareRoom("ab")).toBe("");
    expect(shareRoom("!!!")).toBe("");
  });

  it("accepts hello and a project from another tab in the same room", () => {
    expect(readShareMessage({ room: "harbor", from: "peer", kind: "hello" }, "harbor", "self")).toEqual({ kind: "hello" });
    expect(readShareMessage({ room: "harbor", from: "peer", kind: "project", project: { sheets: [] } }, "harbor", "self")).toEqual({
      kind: "project",
      project: { sheets: [] },
    });
    expect(readShareMessage({ room: "other", from: "peer", kind: "hello" }, "harbor", "self")).toBeNull();
    expect(readShareMessage({ room: "harbor", from: "self", kind: "hello" }, "harbor", "self")).toBeNull();
    expect(readShareMessage({ room: "harbor", from: "peer", kind: "nope" }, "harbor", "self")).toBeNull();
    expect(readShareMessage({ room: "harbor", kind: "hello" }, "harbor", "self")).toBeNull();
    const huge = { note: "x".repeat(SHARE_LIMIT + 1) };
    expect(readShareMessage({ room: "harbor", from: "peer", kind: "project", project: huge }, "harbor", "self")).toBeNull();
  });

  it("shares inside this browser and does not offer a download", () => {
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    const share = readFileSync(new URL("../lib/foundry-share.ts", import.meta.url), "utf8");
    const guide = readFileSync(new URL("../lib/foundry-guide.ts", import.meta.url), "utf8");
    expect(lab).toContain("SHARE_CHANNEL");
    expect(lab).toContain("BroadcastChannel");
    expect(share).toContain("keel.foundry.liveshare.v1");
    expect(lab).not.toContain("LiveShare");
    expect(share).not.toContain("LiveShare");
    expect(guide).toContain("does not download a share tool");
    expect(guide).toContain("does not reach GitHub");
    expect(guide).toContain("including a table, a task list, and strikethrough");
    expect(guide).not.toMatch(/StarUML|XMI/);
  });
});
