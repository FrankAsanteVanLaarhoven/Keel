import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FOUNDRY_GUIDE, guideSections } from "../lib/foundry-guide";

const REQUIRED = [
  "Introduction",
  "Basic Concepts",
  "Managing Project",
  "Managing Diagrams",
  "Diagram Editor",
  "Editing Elements",
  "Formatting Elements",
  "Annotation Elements",
  "Managing Extensions",
  "User Interface",
  "CLI (Command Line Interface)",
  "Validation Rules",
  "Keyboard Shortcuts",
  "Touch Bar (MacBook)",
  "Customization",
  "Mermaid Support",
  "AI integration via MCP",
  "Troubleshooting",
  "Class Diagram",
  "Package Diagram",
  "Composite Structure Diagram",
  "Object Diagram",
  "Component Diagram",
  "Deployment Diagram",
  "Use Case Diagram",
  "Sequence Diagram",
  "Communication Diagram",
  "Timing Diagram",
  "Interaction Overview Diagram",
  "Statechart Diagram",
  "Activity Diagram",
  "Information Flow Diagram",
  "Profile Diagram",
  "Requirement Diagram",
  "Block Definition Diagram",
  "Internal Block Diagram",
  "Parametric Diagram",
  "Entity-Relationship Diagram",
  "Flowchart Diagram",
  "Data Flow Diagram",
  "C4 Diagram",
  "BPMN Diagram",
  "Mind map diagram",
  "Wireframe Diagram",
  "AWS Architecture Diagram",
  "GCP Architecture Diagram",
  "Azure Architecture Diagram",
  "Getting Started",
  "Commands",
  "Menus",
  "Keymaps",
  "Toolbox",
  "Accessing Elements",
  "Creating, Deleting and Modifying Elements",
  "Working with Selections",
  "Defining Preferences",
  "Using Dialogs",
  "Registering to Extension Registry",
];

describe("foundry guide", () => {
  it("covers the desk outline", () => {
    const titles = guideSections().map((section) => section.title);
    for (const title of REQUIRED) expect(titles).toContain(title);
    const ids = guideSections().map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    const text = guideSections().flatMap((section) => [...section.paragraphs, ...(section.points ?? [])]).join("\n");
    expect(text).toContain("small team");
    expect(text).toContain("a class");
    expect(text).toContain("macOS, Windows, or Linux");
    expect(text).toContain("does not update itself");
    expect(text).toContain("leaves the MacBook Touch Bar alone");
    expect(text).toContain("does not submit an extension to a registry");
    expect(text).toContain("does not certify");
    expect(text).not.toMatch(/StarUML|XMI/);
    expect(FOUNDRY_GUIDE.map((chapter) => chapter.title)).toEqual([
      "User guide",
      "Working with UML Diagrams",
      "Working with SysML Diagrams",
      "Working with Additional Diagrams",
      "Developing Extensions",
    ]);
  });

  it("is linked from the desk and rendered as one article", () => {
    const page = readFileSync(new URL("../app/foundry/guide/page.tsx", import.meta.url), "utf8");
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    expect(page).toContain("Foundry guide");
    expect(page).toContain('href="/foundry"');
    expect(page).toContain("FOUNDRY_GUIDE");
    expect(lab).toContain('href="/foundry/guide"');
    expect(lab).toContain(">Guide</Link>");
    expect(page).not.toMatch(/StarUML|XMI/);
  });
});
