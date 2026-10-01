import { markdownBlocks, markdownInlines, type MarkdownBlock } from "./markdown";

export type ModelNode = {
  id: string;
  type: string;
  label: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  documentation?: string;
  attributes?: string;
  operations?: string;
};

export type ModelLink = {
  id?: string;
  from: string;
  to: string;
  kind?: string;
  label?: string;
};

export type ModelSheet = {
  id?: string;
  name?: string;
  nodes: ModelNode[];
  connections: ModelLink[];
};

export type ModelIssue = {
  sheet: string;
  target: string;
  message: string;
};

export type SketchLanguage = "java" | "cs" | "cpp" | "py" | "php" | "js" | "ts" | "ruby" | "sql" | "graphql";

export const SKETCH_LANGUAGES: readonly { id: SketchLanguage; name: string }[] = [
  { id: "java", name: "Java" },
  { id: "cs", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "py", name: "Python" },
  { id: "php", name: "PHP" },
  { id: "js", name: "JavaScript" },
  { id: "ts", name: "TypeScript" },
  { id: "ruby", name: "Ruby" },
  { id: "sql", name: "SQL" },
  { id: "graphql", name: "GraphQL" },
];

const CODE_WORD = /^(class|public|private|protected|void|int|string|String|bool|boolean|return|if|else|for|while|import|from|def|None|True|False|true|false|new|this|namespace|using|include|std|function|end|interface|type|echo|CREATE|TABLE)$/;

export function codeTokens(source: string): { text: string; keyword: boolean }[] {
  return source.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b)/).filter((part) => part.length > 0).map((text) => ({
    text,
    keyword: CODE_WORD.test(text),
  }));
}

export function readModelFile(value: unknown): ModelSheet[] | { error: string } {
  if (!value || typeof value !== "object") return { error: "This file is not a Foundry drawing. Open a JSON file saved from this lab." };
  const raw = value as { sheets?: unknown; nodes?: unknown; connections?: unknown };
  if (Array.isArray(raw.sheets)) {
    const sheets = raw.sheets.map(readSheet).filter((sheet): sheet is ModelSheet => !!sheet);
    if (sheets.length === 0) return { error: "This file is not a Foundry drawing. Open a JSON file saved from this lab." };
    return sheets;
  }
  const sheet = readSheet({ name: "Diagram 1", nodes: raw.nodes, connections: raw.connections });
  if (!sheet) return { error: "This file is not a Foundry drawing. Open a JSON file saved from this lab." };
  return [sheet];
}

export function checkModel(sheets: ModelSheet[]): ModelIssue[] {
  const issues: ModelIssue[] = [];
  for (const sheet of sheets) {
    const name = sheet.name?.trim() || "This diagram";
    const ids = new Set<string>();
    const labels = new Set<string>();
    for (const node of sheet.nodes) {
      if (ids.has(node.id)) {
        issues.push({ sheet: name, target: node.id, message: `Two shapes on ${name} share an id. Open the JSON and give each shape its own id, then check again.` });
      }
      ids.add(node.id);
      const label = node.label.trim();
      if (!label) {
        issues.push({ sheet: name, target: node.id, message: `A shape on ${name} has no name. Give it a name, then check again.` });
        continue;
      }
      if (labels.has(label)) {
        issues.push({ sheet: name, target: node.id, message: `"${label}" is used more than once on ${name}. Rename one of them, then check again.` });
      }
      labels.add(label);
    }
    for (const link of sheet.connections) {
      if (!ids.has(link.from) || !ids.has(link.to)) {
        issues.push({ sheet: name, target: link.id || `${link.from}-${link.to}`, message: `A link on ${name} points at a shape that is not on this diagram. Reconnect it or remove it, then check again.` });
      }
    }
  }
  return issues.slice(0, 40);
}

export function isSketchLanguage(value: string): value is SketchLanguage {
  return SKETCH_LANGUAGES.some((item) => item.id === value);
}

export function sketchFileExtension(language: SketchLanguage): string {
  if (language === "cs") return "cs";
  if (language === "py") return "py";
  if (language === "cpp") return "cpp";
  if (language === "php") return "php";
  if (language === "js") return "js";
  if (language === "ts") return "ts";
  if (language === "ruby") return "rb";
  if (language === "sql") return "sql";
  if (language === "graphql") return "graphql";
  return "java";
}

export function sketchLanguage(sheets: ModelSheet[], language: SketchLanguage): string {
  if (language === "sql") return sqlTables(sheets);
  const nodes = sheets.flatMap((sheet) => sheet.nodes).filter((node) => node.label.trim()).slice(0, 40);
  if (nodes.length === 0) return comment(language, "Draw a shape, then sketch the code again.");
  const used = new Set<string>();
  const blocks = nodes.map((node, index) => sketchOne(node, index, language, used));
  if (language === "cpp") return `#include <string>\n\n${blocks.join("\n\n")}\n`;
  if (language === "cs") return `namespace KeelFoundry\n{\n${blocks.map((block) => indent(block, 4)).join("\n\n")}\n}\n`;
  if (language === "php") return `<?php\n\n${blocks.join("\n\n")}\n`;
  return `${blocks.join("\n\n")}\n`;
}

export function relationshipLines(sheet: ModelSheet, nodeId: string): string[] {
  const node = sheet.nodes.find((item) => item.id === nodeId);
  if (!node) return ["Select a shape, then look at its lines again."];
  const name = node.label.trim() || node.type;
  const lines = sheet.connections.flatMap((link) => {
    if (link.from !== nodeId && link.to !== nodeId) return [];
    const otherId = link.from === nodeId ? link.to : link.from;
    const other = sheet.nodes.find((item) => item.id === otherId);
    const otherName = other?.label.trim() || other?.type || "a missing shape";
    const via = link.label?.trim() ? ` (${link.label.trim()})` : "";
    const direction = link.from === nodeId ? `${name} to ${otherName}` : `${otherName} to ${name}`;
    return [`${direction}${via}`];
  });
  return lines.length ? lines.slice(0, 12) : [`${name} has no line.`];
}

export function unconnectedNodes(sheet: ModelSheet): { id: string; label: string }[] {
  const used = new Set<string>();
  for (const link of sheet.connections) {
    used.add(link.from);
    used.add(link.to);
  }
  return sheet.nodes.filter((node) => node.id && !used.has(node.id)).slice(0, 12).map((node) => ({
    id: node.id,
    label: node.label.trim() || node.type,
  }));
}

export function htmlNotes(sheets: ModelSheet[], title: string): string {
  const heading = escapeHtml(title.trim() || "Foundry notes");
  const body = sheets.map((sheet) => sheetHtml(sheet)).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${heading}</title>
<style>
body { margin: 2rem auto; max-width: 42rem; background: #f3f0e8; color: #1c1916; font: 16px/1.5 Georgia, serif; }
h1, h2, h3 { line-height: 1.2; }
code, pre { font-family: ui-monospace, monospace; }
pre { overflow: auto; padding: 0.75rem; background: #fffaf3; border: 1px solid #e2dcd0; }
.kw { color: #8a3e24; }
a { color: #8a3e24; }
</style>
</head>
<body>
<h1>${heading}</h1>
<p>Notes from a Keel Foundry sheet.</p>
${body}
</body>
</html>
`;
}

export function diagramSvg(sheet: ModelSheet): string {
  const nodes = sheet.nodes.slice(0, 40).map((node) => ({
    ...node,
    x: numberOr(node.x, 48),
    y: numberOr(node.y, 48),
    w: numberOr(node.w, 160),
    h: numberOr(node.h, 64),
  }));
  let width = 320;
  let height = 200;
  for (const node of nodes) {
    width = Math.max(width, node.x + node.w + 48);
    height = Math.max(height, node.y + node.h + 48);
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const lines = sheet.connections.slice(0, 80).flatMap((link) => {
    const from = byId.get(link.from);
    const to = byId.get(link.to);
    if (!from || !to) return [];
    return [`<line x1="${from.x + from.w}" y1="${from.y + from.h / 2}" x2="${to.x}" y2="${to.y + to.h / 2}" fill="none" stroke="#1c1916" stroke-width="1.4"/>`];
  });
  const boxes = nodes.map((node) => {
    const label = escapeHtml(node.label.trim() || node.type);
    return `<rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" fill="#fffaf3" stroke="#1c1916" stroke-width="1.4"/>
<text x="${node.x + 12}" y="${node.y + 28}" fill="#1c1916" font-family="Georgia, serif" font-size="14">${label}</text>`;
  });
  const empty = nodes.length === 0 ? `<text x="24" y="40" fill="#1c1916" font-family="Georgia, serif" font-size="14">This diagram is empty.</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<rect width="100%" height="100%" fill="#f3f0e8"/>
${lines.join("\n")}
${boxes.join("\n")}
${empty}
</svg>
`;
}

function readSheet(value: unknown): ModelSheet | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as { id?: unknown; name?: unknown; nodes?: unknown; connections?: unknown };
  if (!Array.isArray(raw.nodes)) return null;
  const nodes = raw.nodes.map(readNode).filter((node): node is ModelNode => !!node);
  const connections = Array.isArray(raw.connections) ? raw.connections.map(readLink).filter((link): link is ModelLink => !!link) : [];
  return {
    id: typeof raw.id === "string" ? raw.id : undefined,
    name: typeof raw.name === "string" ? raw.name : undefined,
    nodes,
    connections,
  };
}

function readNode(value: unknown): ModelNode | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.id !== "string" || typeof raw.type !== "string") return null;
  return {
    id: raw.id,
    type: raw.type,
    label: typeof raw.label === "string" ? raw.label : "",
    x: typeof raw.x === "number" ? raw.x : undefined,
    y: typeof raw.y === "number" ? raw.y : undefined,
    w: typeof raw.w === "number" ? raw.w : undefined,
    h: typeof raw.h === "number" ? raw.h : undefined,
    documentation: typeof raw.documentation === "string" ? raw.documentation : undefined,
    attributes: typeof raw.attributes === "string" ? raw.attributes : undefined,
    operations: typeof raw.operations === "string" ? raw.operations : undefined,
  };
}

function readLink(value: unknown): ModelLink | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const from = typeof raw.from === "string" ? raw.from : typeof raw.source === "string" ? raw.source : "";
  const to = typeof raw.to === "string" ? raw.to : typeof raw.target === "string" ? raw.target : "";
  if (!from || !to) return null;
  return {
    id: typeof raw.id === "string" ? raw.id : undefined,
    from,
    to,
    kind: typeof raw.kind === "string" ? raw.kind : undefined,
    label: typeof raw.label === "string" ? raw.label : typeof raw.protocol === "string" ? raw.protocol : undefined,
  };
}

function sqlTables(sheets: ModelSheet[]): string {
  const nodes = sheets.flatMap((sheet) => sheet.nodes).filter((node) => node.label.trim()).slice(0, 40);
  if (nodes.length === 0) return comment("sql", "Draw a shape, then sketch the code again.");
  const used = new Set<string>();
  const tables = nodes.map((node, index) => {
    const typeName = pascal(node.label) || `Shape${index + 1}`;
    let unique = typeName;
    let suffix = 2;
    while (used.has(unique)) {
      unique = `${typeName}${suffix}`;
      suffix += 1;
    }
    used.add(unique);
    const fields = linesOf(node.attributes).map((line, fieldIndex) => ident(line.split(/[\s:(]/)[0] || "", `field${fieldIndex + 1}`));
    const note = node.documentation?.trim().split("\n")[0];
    return { id: node.id, table: snake(unique), fields, note };
  });
  const byId = new Map(tables.map((table) => [table.id, table]));
  const keys = new Map<string, string[]>();
  for (const sheet of sheets) {
    for (const link of sheet.connections) {
      const from = byId.get(link.from);
      const to = byId.get(link.to);
      if (!from || !to || from.table === to.table) continue;
      const column = link.label?.trim() ? snake(link.label) : `${to.table}_id`;
      const line = `  FOREIGN KEY (${column}) REFERENCES ${to.table} (id)`;
      const list = keys.get(from.id) ?? [];
      if (!list.includes(line)) list.push(line);
      if (!from.fields.some((field) => snake(field) === column)) from.fields.push(column);
      keys.set(from.id, list);
    }
  }
  const blocks = tables.map((table) => {
    const head = table.note ? `${comment("sql", table.note)}\n` : "";
    const columns = [
      ...(table.fields.some((field) => snake(field) === "id") ? [] : ["  id text"]),
      ...table.fields.map((field) => `  ${snake(field)} text`),
      ...(keys.get(table.id) ?? []),
    ];
    return `${head}CREATE TABLE ${table.table} (\n${columns.join(",\n")}\n);`;
  });
  return `${blocks.join("\n\n")}\n`;
}

function sketchOne(node: ModelNode, index: number, language: SketchLanguage, used: Set<string>): string {
  let typeName = pascal(node.label);
  if (!typeName) typeName = `Shape${index + 1}`;
  let unique = typeName;
  let suffix = 2;
  while (used.has(unique)) {
    unique = `${typeName}${suffix}`;
    suffix += 1;
  }
  used.add(unique);
  const fields = linesOf(node.attributes).map((line, fieldIndex) => ident(line.split(/[\s:(]/)[0] || "", `field${fieldIndex + 1}`));
  const methods = linesOf(node.operations).map((line, methodIndex) => ident(line.split(/[\s:(]/)[0] || "", `method${methodIndex + 1}`));
  const note = node.documentation?.trim().split("\n")[0];
  return renderType(language, unique, fields, methods, note);
}

function renderType(language: SketchLanguage, name: string, fields: string[], methods: string[], note?: string): string {
  const head = note ? `${comment(language, note)}\n` : "";
  if (language === "py") {
    const body = [
      ...fields.map((field) => `    ${field}: str`),
      ...methods.map((method) => `    def ${method}(self):\n        return None`),
    ];
    return `${head}class ${name}:\n${body.length ? body.join("\n") : "    pass"}`;
  }
  if (language === "cs") {
    const body = [
      ...fields.map((field) => `    public string ${pascal(field) || field} { get; set; }`),
      ...methods.map((method) => `    public void ${pascal(method) || method}() { }`),
    ];
    return `${head}public class ${name}\n{\n${body.length ? body.join("\n") : "    " + comment(language, name)}}\n}`;
  }
  if (language === "cpp") {
    const body = [
      ...fields.map((field) => `  std::string ${field};`),
      ...methods.map((method) => `  void ${method}();`),
    ];
    return `${head}class ${name} {\n public:\n${body.length ? body.join("\n") : "  " + comment(language, name)}\n};`;
  }
  if (language === "php") {
    const body = [
      ...fields.map((field) => `    public string $${field};`),
      ...methods.map((method) => `    public function ${method}(): void { }`),
    ];
    return `${head}class ${name}\n{\n${body.length ? body.join("\n") : "    " + comment(language, name)}\n}`;
  }
  if (language === "js") {
    const body = [
      ...fields.map((field) => `  ${field} = "";`),
      ...methods.map((method) => `  ${method}() { return null; }`),
    ];
    return `${head}export class ${name} {\n${body.length ? body.join("\n") : "  " + comment(language, name)}\n}`;
  }
  if (language === "ts") {
    const body = [
      ...fields.map((field) => `  ${field}: string;`),
      ...methods.map((method) => `  ${method}(): void { }`),
    ];
    return `${head}export class ${name} {\n${body.length ? body.join("\n") : "  " + comment(language, name)}\n}`;
  }
  if (language === "ruby") {
    const body = [
      ...fields.map((field) => `  attr_accessor :${field}`),
      ...methods.map((method) => `  def ${method}\n    nil\n  end`),
    ];
    return `${head}class ${name}\n${body.length ? body.join("\n") : "  " + comment(language, name)}\nend`;
  }
  if (language === "sql") {
    const columns = fields.length ? fields.map((field) => `  ${snake(field)} text`) : ["  id text"];
    return `${head}CREATE TABLE ${snake(name)} (\n${columns.join(",\n")}\n);`;
  }
  if (language === "graphql") {
    const body = [
      ...fields.map((field) => `  ${field}: String`),
      ...methods.map((method) => `  ${method}: String`),
    ];
    return `${head}type ${name} {\n${body.length ? body.join("\n") : "  id: String"}\n}`;
  }
  const body = [
    ...fields.flatMap((field) => {
      const getter = pascal(field) || "Field";
      return [
        `  private String ${field};`,
        `  public String get${getter}() { return ${field}; }`,
        `  public void set${getter}(String value) { ${field} = value; }`,
      ];
    }),
    ...methods.map((method) => `  public void ${method}() { }`),
  ];
  return `${head}public class ${name} {\n${body.length ? body.join("\n") : "  " + comment(language, name)}\n}`;
}

function sheetHtml(sheet: ModelSheet): string {
  const name = escapeHtml(sheet.name?.trim() || "Diagram");
  const shapes = sheet.nodes.map((node) => {
    const label = escapeHtml(node.label.trim() || node.type);
    const docs = node.documentation?.trim() ? markdownHtml(node.documentation) : "";
    return `<li><h3>${label}</h3><p>${escapeHtml(node.type)}</p>${docs}</li>`;
  }).join("\n");
  const links = sheet.connections.map((link) => {
    const from = sheet.nodes.find((node) => node.id === link.from)?.label || link.from;
    const to = sheet.nodes.find((node) => node.id === link.to)?.label || link.to;
    const label = link.label?.trim() ? ` (${escapeHtml(link.label.trim())})` : "";
    return `<li>${escapeHtml(from)} to ${escapeHtml(to)}${label}</li>`;
  }).join("\n");
  return `<section><h2>${name}</h2><ul>${shapes || "<li>This diagram is empty.</li>"}</ul>${links ? `<h3>Links</h3><ul>${links}</ul>` : ""}</section>`;
}

function markdownHtml(source: string): string {
  return markdownBlocks(source).map(blockHtml).join("\n");
}

function blockHtml(block: MarkdownBlock): string {
  if (block.type === "h") {
    const level = Math.min(block.level + 1, 4);
    return `<h${level}>${inlineHtml(block.text)}</h${level}>`;
  }
  if (block.type === "ul") return `<ul>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("")}</ul>`;
  if (block.type === "ol") return `<ol>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("")}</ol>`;
  if (block.type === "task") {
    return `<ul>${block.items.map((item) => `<li><input type="checkbox" disabled${item.checked ? " checked" : ""}> ${inlineHtml(item.text)}</li>`).join("")}</ul>`;
  }
  if (block.type === "table") {
    const head = block.header.map((cell) => `<th>${inlineHtml(cell)}</th>`).join("");
    const body = block.rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineHtml(cell)}</td>`).join("")}</tr>`).join("");
    return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }
  if (block.type === "quote") return `<blockquote>${inlineHtml(block.text)}</blockquote>`;
  if (block.type === "code") return `<pre><code>${codeHtml(block.text)}</code></pre>`;
  if (block.type === "hr") return "<hr>";
  return `<p>${inlineHtml(block.text)}</p>`;
}

function inlineHtml(source: string): string {
  return markdownInlines(source).map((part) => {
    if (part.type === "strong") return `<strong>${escapeHtml(part.text)}</strong>`;
    if (part.type === "em") return `<em>${escapeHtml(part.text)}</em>`;
    if (part.type === "del") return `<del>${escapeHtml(part.text)}</del>`;
    if (part.type === "code") return `<code>${escapeHtml(part.text)}</code>`;
    if (part.type === "link") return `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`;
    return escapeHtml(part.text);
  }).join("");
}

function codeHtml(source: string): string {
  return codeTokens(source).map((token) => token.keyword ? `<span class="kw">${escapeHtml(token.text)}</span>` : escapeHtml(token.text)).join("");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function linesOf(value?: string): string[] {
  return (value || "").split("\n").map((line) => line.trim()).filter(Boolean);
}

function pascal(value: string): string {
  const words = value.replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  const name = words.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1)).join("");
  return /^[A-Za-z]/.test(name) ? name.slice(0, 40) : "";
}

function ident(value: string, fallback: string): string {
  const name = value.replace(/[^A-Za-z0-9_]/g, "");
  if (!/^[A-Za-z_]/.test(name)) return fallback;
  return name.slice(0, 40);
}

function comment(language: SketchLanguage, text: string): string {
  const clean = text.replace(/\s+/g, " ").slice(0, 120);
  if (language === "py" || language === "ruby" || language === "graphql") return `# ${clean}`;
  if (language === "sql") return `-- ${clean}`;
  return `// ${clean}`;
}

function snake(value: string): string {
  const raw = value
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return /^[a-z]/.test(raw) ? raw.slice(0, 40) : "shape";
}

function indent(value: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return value.split("\n").map((line) => (line ? pad + line : line)).join("\n");
}

function numberOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback;
}
