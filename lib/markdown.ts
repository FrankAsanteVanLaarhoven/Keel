export type MarkdownBlock =
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "task"; items: { checked: boolean; text: string }[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "hr" };

export type MarkdownInline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "del"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string };

const inlinePattern = /(~~[^~\n]+~~)|(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\(https?:\/\/[^)\s]+\))|(https?:\/\/[A-Za-z0-9./?#&=_%~+-]+)/g;

export function markdownInlines(source: string): MarkdownInline[] {
  const parts: MarkdownInline[] = [];
  let cursor = 0;
  for (const match of source.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > cursor) parts.push({ type: "text", text: source.slice(cursor, index) });
    const token = match[0];
    if (token.startsWith("~~")) parts.push({ type: "del", text: token.slice(2, -2) });
    else if (token.startsWith("`")) parts.push({ type: "code", text: token.slice(1, -1) });
    else if (token.startsWith("**")) parts.push({ type: "strong", text: token.slice(2, -2) });
    else if (token.startsWith("*")) parts.push({ type: "em", text: token.slice(1, -1) });
    else if (token.startsWith("[")) {
      const linked = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (linked) parts.push({ type: "link", text: linked[1], href: linked[2] });
    } else if (/^https?:\/\//.test(token)) parts.push({ type: "link", text: token, href: token });
    cursor = index + token.length;
  }
  if (cursor < source.length) parts.push({ type: "text", text: source.slice(cursor) });
  return parts;
}

export function markdownBlocks(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }
    const heading = /^(#{1,3})\s+(\S.*)$/.exec(line);
    if (heading) {
      blocks.push({ type: "h", level: heading[1].length as 1 | 2 | 3, text: heading[2].trim() });
      index += 1;
      continue;
    }
    if (/^---\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    if (isTask(line)) {
      const items: { checked: boolean; text: string }[] = [];
      while (index < lines.length && isTask(lines[index])) {
        const task = /^[-*]\s+\[([ xX])\]\s+([\s\S]+)$/.exec(lines[index]);
        items.push({ checked: task?.[1].toLowerCase() === "x", text: task?.[2].trim() ?? "" });
        index += 1;
      }
      blocks.push({ type: "task", items });
      continue;
    }
    if (/^[-*]\s+\S/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+\S/.test(lines[index]) && !isTask(lines[index])) {
        items.push(lines[index].replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d{1,3}\.\s+\S/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d{1,3}\.\s+\S/.test(lines[index])) {
        items.push(lines[index].replace(/^\d{1,3}\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (isTableStart(lines, index)) {
      const header = tableCells(lines[index]);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && isTableRow(lines[index]) && !isSeparator(lines[index])) {
        const cells = tableCells(lines[index]);
        rows.push(header.map((_, cell) => cells[cell] ?? ""));
        index += 1;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !startsBlock(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    if (paragraph.length === 0) {
      index += 1;
      continue;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }
  return blocks;
}

function startsBlock(lines: string[], index: number): boolean {
  const line = lines[index];
  return /^(```|#{1,3}\s|>\s?|[-*]\s+\S|\d{1,3}\.\s+\S|---\s*$)/.test(line) || isTableStart(lines, index);
}

function isTask(line: string): boolean {
  return /^[-*]\s+\[[ xX]\]\s+\S/.test(line);
}

function isTableRow(line: string): boolean {
  return line.includes("|") && tableCells(line).length >= 2;
}

function isSeparator(line: string): boolean {
  const cells = tableCells(line);
  return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isTableStart(lines: string[], index: number): boolean {
  return isTableRow(lines[index]) && index + 1 < lines.length && isSeparator(lines[index + 1]);
}

function tableCells(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}
