import { MODEL_LANGUAGES, UML_FAMILIES, boardText, relationKindOf, type UmlGlyph } from "./foundry-board";

export const EXTENSION_STORE = "keel.foundry.extensions.v1";
export const EXTENSION_LIMIT = 12;
export const EXTENSION_SOURCE_LIMIT = 20_000;

const TOOL_ID = /^x-[a-z][a-z0-9-]{0,15}$/;
const PATCH_KEY = /^[a-z][a-z0-9-]{0,12}$/;

const GLYPH_OK: Record<UmlGlyph, true> = {
  class: true,
  iface: true,
  enum: true,
  data: true,
  package: true,
  actor: true,
  case: true,
  bound: true,
  life: true,
  frag: true,
  action: true,
  decide: true,
  start: true,
  stop: true,
  end: true,
  fork: true,
  object: true,
  lane: true,
  comp: true,
  port: true,
  art: true,
  node: true,
  device: true,
  exec: true,
  state: true,
  choice: true,
  hist: true,
  model: true,
  frame: true,
  ball: true,
  socket: true,
  entity: true,
  weak: true,
  junction: true,
  attr: true,
  rel: true,
  prompt: true,
  modelcard: true,
  dataset: true,
  embed: true,
  retriever: true,
  agent: true,
  tool: true,
  guard: true,
  eval: true,
  serving: true,
};

export const EXTENSION_GLYPHS = Object.keys(GLYPH_OK) as UmlGlyph[];

const LANGUAGE_OK = new Set<string>([
  "*",
  ...MODEL_LANGUAGES.map((language) => language.id),
  ...UML_FAMILIES.map((family) => family.id),
]);

export type ExtensionRecord = {
  id: string;
  name: string;
  source: string;
  enabled: boolean;
};

export type ExtensionTool = {
  id: string;
  name: string;
  languages: string[];
  group: string;
  glyph: UmlGlyph;
  stereotype: string;
  label: string;
  w: number;
  h: number;
};

export type ExtensionCommand = {
  extensionId: string;
  index: number;
  name: string;
};

export type DiagramNodeView = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  stereotype: string;
};

export type DiagramLinkView = {
  id: string;
  from: string;
  to: string;
  kind: string;
  label: string;
};

export type DiagramSnapshot = {
  language: string;
  family: string;
  selectedNodeId: string | null;
  nodes: DiagramNodeView[];
  connections: DiagramLinkView[];
  answer?: string;
};

export type ExtensionMenu = { name: string; command: string };
export type ExtensionKey = { chord: string; command: string };
export type ExtensionDialog = { title: string; label: string; command: string };
export type ExtensionMenuItem = { name: string; command: ExtensionCommand };
export type ExtensionKeyItem = { chord: string; command: ExtensionCommand };

export type PatchUpdate = {
  id: string;
  label?: string;
  x?: number;
  y?: number;
  stereotype?: string;
  attributes?: string;
};

export type PatchAddNode = {
  key: string;
  type: string;
  label: string;
  x: number;
  y: number;
  stereotype: string;
};

export type PatchAddLink = {
  from: string;
  to: string;
  kind: string;
  label: string;
};

export type AcceptedPatch = {
  summary: string;
  updateNodes: PatchUpdate[];
  deleteNodes: string[];
  addNodes: PatchAddNode[];
  deleteConnections: string[];
  addConnections: PatchAddLink[];
};

export function isExtensionType(type: string): boolean {
  return TOOL_ID.test(type);
}

export function isGlyph(value: string): value is UmlGlyph {
  return Object.prototype.hasOwnProperty.call(GLYPH_OK, value);
}

export function toolVisible(tool: ExtensionTool, language: string, family: string): boolean {
  return tool.languages.includes("*") || tool.languages.includes(language) || tool.languages.includes(family);
}

function clip(value: unknown, limit: number): string {
  return boardText(value, limit).trim();
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function parseExtensionStore(raw: string | null): ExtensionRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { items?: unknown };
    if (!parsed || !Array.isArray(parsed.items)) return [];
    const items: ExtensionRecord[] = [];
    const seen = new Set<string>();
    for (const item of parsed.items) {
      if (!item || typeof item !== "object") continue;
      const record = item as Partial<ExtensionRecord>;
      const id = clip(record.id, 40);
      const name = clip(record.name, 40);
      const source = typeof record.source === "string" ? record.source.slice(0, EXTENSION_SOURCE_LIMIT) : "";
      if (!id || !name || !source || seen.has(id)) continue;
      seen.add(id);
      items.push({ id, name, source, enabled: record.enabled === true });
      if (items.length >= EXTENSION_LIMIT) break;
    }
    return items;
  } catch {
    return [];
  }
}

export function extensionDraftError(name: string, source: string, count: number, editing: boolean): string {
  if (!clip(name, 40)) return "Give the extension a name, then save again.";
  if (!source.trim()) return "The script is empty. Add a keel.tool or a keel.command, then save again.";
  if (source.length > EXTENSION_SOURCE_LIMIT) {
    return "This script is longer than 20,000 characters. Shorten it and save again.";
  }
  if (!editing && count >= EXTENSION_LIMIT) return "This browser already has 12 extensions. Delete one, then save.";
  return "";
}

export function compileTools(raw: unknown, taken: ReadonlySet<string>): { tools: ExtensionTool[]; error: string } {
  if (!Array.isArray(raw)) return { tools: [], error: "The script did not return its tools as a list." };
  if (raw.length > 12) return { tools: [], error: "An extension can add at most 12 shapes. Remove some keel.tool calls and save again." };
  const tools: ExtensionTool[] = [];
  const local = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") return { tools: [], error: "A keel.tool call needs an object with an id, a name, and a glyph." };
    const spec = item as Record<string, unknown>;
    const id = clip(spec.id, 20);
    if (!isExtensionType(id)) return { tools: [], error: "A shape id must look like x-stamp and stay within 18 characters." };
    if (taken.has(id) || local.has(id)) return { tools: [], error: `${id} is already used. Pick another id and save again.` };
    const name = clip(spec.name, 40);
    if (!name) return { tools: [], error: `${id} needs a name.` };
    const languages = Array.isArray(spec.languages) ? spec.languages.map((language) => clip(language, 20)).filter(Boolean) : [];
    if (languages.length === 0 || languages.some((language) => !LANGUAGE_OK.has(language))) {
      return { tools: [], error: `${name} must name a language on this desk, such as uml, erd, or *.` };
    }
    const glyph = clip(spec.glyph, 20);
    if (!isGlyph(glyph)) return { tools: [], error: `${name} needs a known shape. Use class, art, action, or actor.` };
    const width = finite(spec.w);
    const height = finite(spec.h);
    local.add(id);
    tools.push({
      id,
      name,
      languages,
      group: clip(spec.group, 24) || "Extension",
      glyph,
      stereotype: clip(spec.stereotype, 40),
      label: clip(spec.label, 40) || name,
      w: width === null ? 160 : clamp(Math.round(width), 48, 480),
      h: height === null ? 96 : clamp(Math.round(height), 48, 480),
    });
  }
  return { tools, error: "" };
}

export function compileCommands(raw: unknown): { commands: { name: string }[]; error: string } {
  if (!Array.isArray(raw)) return { commands: [], error: "The script did not return its commands as a list." };
  if (raw.length > 8) return { commands: [], error: "An extension can add at most 8 commands. Remove one and save again." };
  const commands: { name: string }[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return { commands: [], error: "A keel.command call needs a name and a function." };
    const name = clip((item as { name?: unknown }).name, 40);
    if (!name) return { commands: [], error: "Give each keel.command a name." };
    commands.push({ name });
  }
  return { commands, error: "" };
}

const CHORD = /^alt\+[a-z0-9]$/;

export function compileMenus(raw: unknown): { menus: ExtensionMenu[]; error: string } {
  if (raw === undefined) return { menus: [], error: "" };
  if (!Array.isArray(raw)) return { menus: [], error: "The script did not return its menus as a list." };
  if (raw.length > 8) return { menus: [], error: "An extension can add at most 8 menu items. Remove one and save again." };
  const menus: ExtensionMenu[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return { menus: [], error: "A keel.menu call needs a name and a command." };
    const spec = item as Record<string, unknown>;
    const name = clip(spec.name, 40);
    const command = clip(spec.command, 40);
    if (!name || !command) return { menus: [], error: "A menu item needs a name and the command it runs." };
    menus.push({ name, command });
  }
  return { menus, error: "" };
}

export function compileKeys(raw: unknown): { keys: ExtensionKey[]; error: string } {
  if (raw === undefined) return { keys: [], error: "" };
  if (!Array.isArray(raw)) return { keys: [], error: "The script did not return its keys as a list." };
  if (raw.length > 8) return { keys: [], error: "An extension can bind at most 8 keys. Remove one and save again." };
  const keys: ExtensionKey[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== "object") return { keys: [], error: "A keel.key call needs a chord and a command." };
    const spec = item as Record<string, unknown>;
    const chord = clip(spec.chord, 12).toLowerCase().replace(/\s+/g, "");
    if (!CHORD.test(chord)) return { keys: [], error: "A key chord looks like alt+s. Use Alt and one letter or digit." };
    if (seen.has(chord)) return { keys: [], error: `${chord} is already used in this script. Pick another chord.` };
    const command = clip(spec.command, 40);
    if (!command) return { keys: [], error: "A key needs the name of a command in this script." };
    seen.add(chord);
    keys.push({ chord, command });
  }
  return { keys, error: "" };
}

export function compileDialogs(raw: unknown): { dialogs: ExtensionDialog[]; error: string } {
  if (raw === undefined) return { dialogs: [], error: "" };
  if (!Array.isArray(raw)) return { dialogs: [], error: "The script did not return its dialogs as a list." };
  if (raw.length > 4) return { dialogs: [], error: "An extension can open at most 4 dialogs. Remove one and save again." };
  const dialogs: ExtensionDialog[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return { dialogs: [], error: "A keel.dialog call needs a title and a command." };
    const spec = item as Record<string, unknown>;
    const title = clip(spec.title, 40);
    const command = clip(spec.command, 40);
    if (!title || !command) return { dialogs: [], error: "A dialog needs a title and the command it runs." };
    dialogs.push({ title, label: clip(spec.label, 40) || "Value", command });
  }
  return { dialogs, error: "" };
}

export function extensionSurfaceError(commands: { name: string }[], menus: ExtensionMenu[], keys: ExtensionKey[], dialogs: ExtensionDialog[]): string {
  const names = new Set(commands.map((command) => command.name));
  for (const item of [...menus, ...keys, ...dialogs]) {
    if (!names.has(item.command)) return `${item.command} is not a command in this script. Add that keel.command, then save again.`;
  }
  return "";
}

function listOf(value: unknown, label: string, limit: number): unknown[] | { error: string } {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return { error: `${label} must be a list.` };
  if (value.length > limit) return { error: `This command changes more than ${limit} ${label.toLowerCase()} at once. Split it into a smaller change.` };
  return value;
}

export function readDiagramPatch(
  patch: unknown,
  allowedTypes: ReadonlySet<string>,
  nodeIds: ReadonlySet<string>,
  connectionIds: ReadonlySet<string>,
): AcceptedPatch | { error: string } {
  if (patch == null) {
    return { summary: "The command left the diagram as it is.", updateNodes: [], deleteNodes: [], addNodes: [], deleteConnections: [], addConnections: [] };
  }
  if (typeof patch !== "object" || Array.isArray(patch)) {
    return { error: "The command returned something this desk cannot apply. Return an object of shape and link changes." };
  }
  const raw = patch as Record<string, unknown>;
  const updates = listOf(raw.updateNodes, "Updates", 200);
  if ("error" in updates) return updates;
  const deletions = listOf(raw.deleteNodes, "Removals", 200);
  if ("error" in deletions) return deletions;
  const additions = listOf(raw.addNodes, "Additions", 40);
  if ("error" in additions) return additions;
  const cutLinks = listOf(raw.deleteConnections, "Link removals", 200);
  if ("error" in cutLinks) return cutLinks;
  const newLinks = listOf(raw.addConnections, "Links", 40);
  if ("error" in newLinks) return newLinks;

  const deleteNodes: string[] = [];
  for (const item of deletions) {
    const id = clip(item, 80);
    if (!id || !nodeIds.has(id)) return { error: "The command tried to remove a shape that is not on this diagram." };
    deleteNodes.push(id);
  }
  const gone = new Set(deleteNodes);

  const updateNodes: PatchUpdate[] = [];
  for (const item of updates) {
    if (!item || typeof item !== "object") return { error: "Each update needs the id of a shape on this diagram." };
    const spec = item as Record<string, unknown>;
    const id = clip(spec.id, 80);
    if (!id || !nodeIds.has(id) || gone.has(id)) return { error: "An update names a shape that is not on this diagram." };
    const next: PatchUpdate = { id };
    if ("label" in spec) next.label = clip(spec.label, 80);
    if ("stereotype" in spec) next.stereotype = clip(spec.stereotype, 40);
    if ("attributes" in spec) next.attributes = boardText(spec.attributes, 2000);
    if ("x" in spec) {
      const x = finite(spec.x);
      if (x === null) return { error: "A shape position must be a finite number." };
      next.x = clamp(Math.round(x), 0, 4000);
    }
    if ("y" in spec) {
      const y = finite(spec.y);
      if (y === null) return { error: "A shape position must be a finite number." };
      next.y = clamp(Math.round(y), 0, 4000);
    }
    updateNodes.push(next);
  }

  const addNodes: PatchAddNode[] = [];
  const keys = new Set<string>();
  for (const item of additions) {
    if (!item || typeof item !== "object") return { error: "Each added shape needs a type." };
    const spec = item as Record<string, unknown>;
    const type = clip(spec.type, 20);
    if (!type || !allowedTypes.has(type)) return { error: `${type || "That shape"} is not a tool on this desk.` };
    const key = spec.key === undefined ? "" : clip(spec.key, 16);
    if (key && (!PATCH_KEY.test(key) || nodeIds.has(key) || keys.has(key))) {
      return { error: "An added shape key must be a short word and be unique in this command." };
    }
    if (key) keys.add(key);
    const x = spec.x === undefined ? -1 : finite(spec.x);
    const y = spec.y === undefined ? -1 : finite(spec.y);
    if (x === null || y === null) return { error: "A shape position must be a finite number." };
    addNodes.push({
      key,
      type,
      label: clip(spec.label, 80),
      x: x < 0 ? -1 : clamp(Math.round(x), 0, 4000),
      y: y < 0 ? -1 : clamp(Math.round(y), 0, 4000),
      stereotype: clip(spec.stereotype, 40),
    });
  }

  const deleteConnections: string[] = [];
  for (const item of cutLinks) {
    const id = clip(item, 80);
    if (!id || !connectionIds.has(id)) return { error: "The command tried to remove a link that is not on this diagram." };
    deleteConnections.push(id);
  }

  const alive = new Set([...nodeIds].filter((id) => !gone.has(id)));
  const addConnections: PatchAddLink[] = [];
  for (const item of newLinks) {
    if (!item || typeof item !== "object") return { error: "Each link needs a from shape and a to shape." };
    const spec = item as Record<string, unknown>;
    const from = clip(spec.from, 80);
    const to = clip(spec.to, 80);
    const fromOk = alive.has(from) || keys.has(from);
    const toOk = alive.has(to) || keys.has(to);
    if (!fromOk || !toOk) return { error: "A link must join two shapes that are on the diagram after this command." };
    if (from === to) return { error: "A link needs two different shapes." };
    const kind = spec.kind === undefined || spec.kind === "" ? "" : relationKindOf(clip(spec.kind, 20));
    if ((spec.kind ?? "") !== "" && !kind) return { error: "The link kind must be a relation on this desk, or be left blank." };
    addConnections.push({ from, to, kind, label: clip(spec.label, 80) });
  }

  const summary = [
    addNodes.length ? `Added ${addNodes.length} ${addNodes.length === 1 ? "shape" : "shapes"}.` : "",
    updateNodes.length ? `Updated ${updateNodes.length} ${updateNodes.length === 1 ? "shape" : "shapes"}.` : "",
    deleteNodes.length ? `Removed ${deleteNodes.length} ${deleteNodes.length === 1 ? "shape" : "shapes"}.` : "",
    addConnections.length ? `Added ${addConnections.length} ${addConnections.length === 1 ? "link" : "links"}.` : "",
    deleteConnections.length ? `Removed ${deleteConnections.length} ${deleteConnections.length === 1 ? "link" : "links"}.` : "",
  ].filter(Boolean).join(" ");
  return {
    summary: summary || "The command left the diagram as it is.",
    updateNodes,
    deleteNodes,
    addNodes,
    deleteConnections,
    addConnections,
  };
}

export const EXTENSION_EXAMPLE = `keel.tool({
  id: "x-stamp",
  name: "Stamp",
  languages: ["uml", "flowchart", "erd"],
  glyph: "art",
  stereotype: "stamp",
  label: "Stamp",
});

keel.command("Number shapes", function (diagram) {
  return {
    updateNodes: diagram.nodes.map(function (node, index) {
      return { id: node.id, label: (index + 1) + ". " + node.label };
    }),
  };
});
`;

export const EXTENSION_FRAME_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Extension runner</title>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'">
</head>
<body>
<script>
(function () {
  var runs = {};
  function reply(message) {
    message.source = "keel-extension";
    parent.postMessage(message, "*");
  }
  function fail(error) {
    var message = error && error.message ? String(error.message) : "The script stopped.";
    return message.replace(/\\s+/g, " ").slice(0, 180);
  }
  function plainTools(list) {
    return JSON.parse(JSON.stringify(list.map(function (spec) {
      spec = spec || {};
      return {
        id: spec.id, name: spec.name, languages: spec.languages, group: spec.group,
        glyph: spec.glyph, stereotype: spec.stereotype, label: spec.label, w: spec.w, h: spec.h
      };
    })));
  }
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || data.source !== "keel-host") return;
    if (data.type === "hello") {
      runs = {};
      reply({ type: "ready" });
      return;
    }
    if (data.type === "load") {
      try {
        var tools = [];
        var commands = [];
        var menus = [];
        var keys = [];
        var dialogs = [];
        var keel = {
          tool: function (spec) { tools.push(spec); },
          command: function (name, run) {
            if (typeof run !== "function") throw new Error("keel.command needs a function after the name.");
            commands.push({ name: String(name || ""), run: run });
          },
          menu: function (spec) { menus.push(spec || {}); },
          key: function (spec) { keys.push(spec || {}); },
          dialog: function (spec) { dialogs.push(spec || {}); }
        };
        var runScript = new Function("keel", '"use strict";\\n' + String(data.script || ""));
        runScript(keel);
        runs[data.extensionId] = commands;
        reply({
          type: "loaded",
          extensionId: data.extensionId,
          tools: plainTools(tools),
          commands: commands.map(function (command) { return { name: command.name }; }),
          menus: JSON.parse(JSON.stringify(menus)),
          keys: JSON.parse(JSON.stringify(keys)),
          dialogs: JSON.parse(JSON.stringify(dialogs))
        });
      } catch (error) {
        delete runs[data.extensionId];
        reply({ type: "failed", extensionId: data.extensionId, message: fail(error) });
      }
      return;
    }
    if (data.type === "run") {
      try {
        var list = runs[data.extensionId] || [];
        var command = list[data.index];
        if (!command) throw new Error("That command is not loaded. Save the extension again.");
        var patch = command.run(data.diagram);
        if (patch == null) patch = {};
        reply({ type: "result", requestId: data.requestId, patch: JSON.parse(JSON.stringify(patch)) });
      } catch (error) {
        reply({ type: "result", requestId: data.requestId, error: fail(error) });
      }
    }
  });
})();
</script>
</body>
</html>`;
