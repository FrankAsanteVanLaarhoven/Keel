import { DATAFLOW_PARTS, UML_FAMILIES, toolsFor, type UmlFamily } from "./foundry-board";
import { readDiagramPatch, type AcceptedPatch, type DiagramSnapshot } from "./foundry-extensions";

export const MERMAID_EXAMPLE = `flowchart TD
  Reader[Reader] --> Card[Library card]
  Card --> Loan{On loan?}`;

const DRAW_TYPES = ["text", "box", "ellipse", "diamond", "cylinder", "cloud", "note"];

type Kind = "flowchart" | "class" | "erd" | "sequence";
type Direction = "TD" | "LR";
type DraftNode = { key: string; type: string; label: string };
type DraftLink = { from: string; to: string; kind: string; label: string };

export type MermaidDraw = { family: UmlFamily; patch: AcceptedPatch };

export function readMermaid(source: string, diagram: DiagramSnapshot): MermaidDraw | { error: string } {
  const text = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (!text) return { error: "Write a Mermaid diagram, then draw again." };
  if (text.length > 4000) return { error: "This description is longer than 4,000 characters. Shorten it and draw again." };
  const fenced = text.match(/^```(?:mermaid)?\s*([\s\S]*?)```$/i);
  const body = (fenced?.[1] ?? text).trim();
  const lines = body.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("%%"));
  if (lines.length === 0) return { error: "Write a Mermaid diagram, then draw again." };
  const header = lines[0].replace(/\s+/g, " ");
  const kind = kindOf(header);
  if (!kind) {
    return { error: "This desk reads flowchart, classDiagram, erDiagram, and sequenceDiagram. Start with one of those, then draw again." };
  }
  const direction: Direction = /\b(LR|RL)\b/.test(header) ? "LR" : "TD";
  const taken = new Set(diagram.nodes.map((node) => node.id));
  const byId = new Map<string, DraftNode>();
  const links: DraftLink[] = [];
  let block = false;
  for (const line of lines.slice(1)) {
    if (block) {
      if (line === "}" || line.endsWith("}")) block = false;
      continue;
    }
    if (/^(subgraph|end|style|classDef|class\s+\w+\s+\w+|linkStyle)\b/i.test(line)) continue;
    if (kind === "class" && /^class\s+/i.test(line)) {
      const name = line.match(/^class\s+([A-Za-z][\w-]*)/i)?.[1];
      if (name) remember(byId, taken, name, name, "uml-class");
      if (line.includes("{") && !line.includes("}")) block = true;
      continue;
    }
    if (kind === "sequence" && /^participant\s+/i.test(line)) {
      const match = line.match(/^participant\s+([A-Za-z][\w-]*)(?:\s+as\s+(.+))?$/i);
      if (match) remember(byId, taken, match[1], (match[2] ?? match[1]).trim(), "uml-life");
      continue;
    }
    readStatement(line, kind, byId, taken, links);
  }
  if (byId.size === 0) {
    return { error: "Add a shape such as Reader[Reader] --> Card[Card], then draw again." };
  }
  if (byId.size > 12 || links.length > 16) {
    return { error: "This description has more than 12 shapes. Split it and draw again." };
  }
  const family = familyFor(kind);
  const edge = rightEdge(diagram);
  const origin = edge > 2800 ? 48 : edge;
  const addNodes = placeNodes([...byId.values()], links, direction, origin);
  const accepted = readDiagramPatch({ addNodes, addConnections: links }, allowedTypes(), nodeIds(diagram), connectionIds(diagram));
  if ("error" in accepted || accepted.addNodes.length === 0) {
    return { error: "The desk could not place that description. Check the shape names and draw again." };
  }
  return { family, patch: accepted };
}

export function wireframeScreen(diagram: DiagramSnapshot): MermaidDraw {
  const taken = new Set(diagram.nodes.map((node) => node.id));
  const keys = ["s0", "s1", "s2", "s3"].map((key, index) => (taken.has(key) ? `w${index}` : key));
  const edge = rightEdge(diagram);
  const x = edge > 2800 ? 48 : edge;
  const addNodes = [
    { key: keys[0], type: "wf-screen", label: "Library", x, y: 36, stereotype: "" },
    { key: keys[1], type: "wf-head", label: "Find a book", x: x + 20, y: 52, stereotype: "" },
    { key: keys[2], type: "wf-field", label: "Card number", x: x + 20, y: 108, stereotype: "" },
    { key: keys[3], type: "wf-button", label: "Search", x: x + 20, y: 160, stereotype: "" },
  ];
  const accepted = readDiagramPatch({ addNodes }, allowedTypes(), nodeIds(diagram), connectionIds(diagram));
  if ("error" in accepted) {
    return { family: "wireframe", patch: { summary: accepted.error, updateNodes: [], deleteNodes: [], addNodes: [], deleteConnections: [], addConnections: [] } };
  }
  return { family: "wireframe", patch: accepted };
}

function kindOf(header: string): Kind | null {
  if (/^(flowchart|graph)\b/i.test(header)) return "flowchart";
  if (/^classDiagram\b/i.test(header)) return "class";
  if (/^erDiagram\b/i.test(header)) return "erd";
  if (/^sequenceDiagram\b/i.test(header)) return "sequence";
  return null;
}

function familyFor(kind: Kind): UmlFamily {
  if (kind === "class") return "class";
  if (kind === "erd") return "erd";
  if (kind === "sequence") return "sequence";
  return "flowchart";
}

function remember(byId: Map<string, DraftNode>, taken: Set<string>, id: string, label: string, type: string): DraftNode {
  const existing = byId.get(id);
  if (existing) {
    if (label && label !== id) existing.label = label.slice(0, 40);
    if (type) existing.type = type;
    return existing;
  }
  let key = `m${byId.size}`;
  if (taken.has(key)) key = `q${byId.size}`;
  taken.add(key);
  const node = { key, type, label: (label || id).slice(0, 40) };
  byId.set(id, node);
  return node;
}

function readStatement(line: string, kind: Kind, byId: Map<string, DraftNode>, taken: Set<string>, links: DraftLink[]) {
  let rest = line;
  let previous: DraftNode | null = null;
  let pending: { kind: string; label: string } | null = null;
  for (let step = 0; step < 8 && rest.trim(); step += 1) {
    const node = takeNode(rest, kind);
    if (!node) break;
    const draft = remember(byId, taken, node.id, node.label, node.type);
    if (previous && pending) links.push({ from: previous.key, to: draft.key, kind: pending.kind, label: pending.label.slice(0, 40) });
    rest = node.rest;
    const note = rest.match(/^\s*:\s*(.*)$/);
    if (note && links.length) {
      links[links.length - 1].label = note[1].trim().slice(0, 40);
      break;
    }
    const arrow = takeArrow(rest, kind);
    if (!arrow) break;
    pending = { kind: arrow.kind, label: arrow.label };
    previous = draft;
    rest = arrow.rest;
  }
}

function takeNode(input: string, kind: Kind): { id: string; label: string; type: string; rest: string } | null {
  const match = input.match(/^\s*([A-Za-z][\w-]*)(\[\[[^\]]+\]\]|\[\([^)]+\)\]|\(\[[^\]]+\]\)|\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?/);
  if (!match) return null;
  let id = match[1];
  let raw = match[2] ?? "";
  const hyphens = id.match(/-+$/);
  const after = input.slice(match[0].length);
  if (hyphens && !raw && /^[>|.=]/.test(after)) {
    id = id.slice(0, -hyphens[0].length);
    raw = "";
  }
  let type = kind === "class" ? "uml-class" : kind === "erd" ? "erd-entity" : kind === "sequence" ? "uml-life" : "flow-proc";
  let label = id;
  if (raw.startsWith("[[")) {
    type = "flow-doc";
    label = raw.slice(2, -2);
  } else if (raw.startsWith("[(")) {
    type = "flow-io";
    label = raw.slice(2, -2);
  } else if (raw.startsWith("([")) {
    type = "flow-start";
    label = raw.slice(2, -2);
  } else if (raw.startsWith("[")) {
    label = raw.slice(1, -1);
  } else if (raw.startsWith("(")) {
    label = raw.slice(1, -1);
  } else if (raw.startsWith("{")) {
    type = "flow-decide";
    label = raw.slice(1, -1);
  }
  const cut = hyphens && !match[2] && /^[>|.=]/.test(after) ? match[0].length - hyphens[0].length : match[0].length;
  return { id, label: label.trim() || id, type, rest: input.slice(cut) };
}

function takeArrow(input: string, kind: Kind): { kind: string; label: string; rest: string } | null {
  if (kind === "erd") {
    const match = input.match(/^\s*([|o{}]+--[|o{}]+)\s*/);
    if (match) return { kind: "crows", label: "", rest: input.slice(match[0].length) };
  }
  if (kind === "class") {
    const match = input.match(/^\s*(<\|--|--\|>|\*--|--\*|--o|o--|<\.\.|\.\.>|\.\.\|>|-->|<--|\.\.|--)\s*/);
    if (match) return { kind: classKind(match[1]), label: "", rest: input.slice(match[0].length) };
  }
  const match = input.match(/^\s*(-->>|->>|-->|---|-.->|==>|--)\s*(?:\|([^|]*)\|\s*)?/);
  if (!match) return null;
  const arrow = match[1];
  const kindName = kind === "sequence" ? (arrow === "-->>" ? "return" : "message") : kind === "class" ? "association" : "flow";
  return { kind: kindName, label: (match[2] ?? "").trim(), rest: input.slice(match[0].length) };
}

function classKind(arrow: string): string {
  if (arrow.includes("<|") || arrow.includes("|>")) return "generalization";
  if (arrow.includes("*")) return "composition";
  if (arrow.includes("o")) return "aggregation";
  if (arrow.includes(".")) return "dependency";
  return "association";
}

function placeNodes(nodes: DraftNode[], links: DraftLink[], direction: Direction, origin: number) {
  const rank = new Map<string, number>();
  const children = new Map<string, string[]>();
  const incoming = new Map<string, number>();
  for (const node of nodes) incoming.set(node.key, 0);
  for (const link of links) {
    incoming.set(link.to, (incoming.get(link.to) ?? 0) + 1);
    const list = children.get(link.from) ?? [];
    list.push(link.to);
    children.set(link.from, list);
  }
  const walk = nodes.filter((node) => (incoming.get(node.key) ?? 0) === 0).map((node) => node.key);
  if (walk.length === 0 && nodes[0]) walk.push(nodes[0].key);
  for (const key of walk) rank.set(key, 0);
  for (let index = 0; index < walk.length; index += 1) {
    const key = walk[index];
    const next = (rank.get(key) ?? 0) + 1;
    for (const child of children.get(key) ?? []) {
      if ((rank.get(child) ?? -1) < next) rank.set(child, next);
      if (!walk.includes(child)) walk.push(child);
    }
  }
  const columns = new Map<number, string[]>();
  for (const node of nodes) {
    const level = rank.get(node.key) ?? 0;
    const list = columns.get(level) ?? [];
    list.push(node.key);
    columns.set(level, list);
  }
  const pos = new Map<string, { x: number; y: number }>();
  for (const [level, keys] of columns) {
    keys.forEach((key, slot) => {
      pos.set(key, direction === "LR"
        ? { x: origin + level * 210, y: 72 + slot * 120 }
        : { x: origin + slot * 200, y: 72 + level * 130 });
    });
  }
  return nodes.map((node) => ({
    key: node.key,
    type: node.type,
    label: node.label,
    x: pos.get(node.key)?.x ?? origin,
    y: pos.get(node.key)?.y ?? 72,
    stereotype: "",
  }));
}

function allowedTypes(): Set<string> {
  const types = new Set<string>([...DRAW_TYPES, ...DATAFLOW_PARTS.map((part) => part.type)]);
  for (const family of UML_FAMILIES) {
    for (const tool of toolsFor(family.id)) types.add(tool.type);
  }
  return types;
}

function rightEdge(diagram: DiagramSnapshot): number {
  let edge = 48;
  for (const node of diagram.nodes) edge = Math.max(edge, node.x + Math.max(node.w, 40) + 36);
  return edge;
}

function nodeIds(diagram: DiagramSnapshot): Set<string> {
  return new Set(diagram.nodes.map((node) => node.id));
}

function connectionIds(diagram: DiagramSnapshot): Set<string> {
  return new Set(diagram.connections.map((link) => link.id));
}
