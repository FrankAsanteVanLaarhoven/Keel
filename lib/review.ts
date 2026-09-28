import { createHash } from "node:crypto";
import { inflateRawSync } from "node:zlib";

export type ReviewMatch = "none" | "peer" | "brief" | "identical";

export type ReviewResult = {
  sha256: string;
  assessment: boolean;
  coverage: number;
  plagiarism: boolean;
  similarity: number;
  match: ReviewMatch;
  shingles: string[];
};

const stops = new Set("the a an and or of to in for on with from that this your you we our is are was were be been being it its as at by if then than not no yes into over under about what which who how why when where can will should must may".split(" "));

export function fileHash(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function extractText(bytes: Buffer, mime: string, name: string): string {
  const lower = name.toLowerCase();
  if (mime.startsWith("text/") || mime === "application/json" || /\.(txt|md|csv|json)$/.test(lower)) {
    return bytes.toString("utf8").slice(0, 200_000);
  }
  if (mime.includes("wordprocessingml") || lower.endsWith(".docx")) return docxText(bytes);
  if (mime === "application/pdf" || lower.endsWith(".pdf")) return pdfText(bytes);
  return "";
}

export function reviewDocument(input: {
  text: string;
  weekBrief: string;
  sha256: string;
  peers: { sha256: string; shingles: string[] }[];
}): ReviewResult {
  const mine = shinglesOf(input.text);
  const brief = shinglesOf(input.weekBrief);
  const briefScore = jaccard(mine, brief);
  let best = 0;
  let match: ReviewMatch = "none";
  for (const peer of input.peers) {
    if (peer.sha256 === input.sha256) {
      best = 100;
      match = "identical";
      break;
    }
    const score = Math.round(jaccard(mine, peer.shingles) * 100);
    if (score > best) {
      best = score;
      match = score >= 40 ? "peer" : "none";
    }
  }
  if (match !== "identical" && match !== "peer" && briefScore >= 0.5 && mine.length >= 8) {
    match = "brief";
    best = Math.max(best, Math.round(briefScore * 100));
  }
  const plagiarism = match === "identical" || match === "peer" || match === "brief";
  return {
    sha256: input.sha256,
    assessment: looksLikeAssessment(input.text),
    coverage: coverageOf(input.text, input.weekBrief),
    plagiarism,
    similarity: plagiarism ? best : best,
    match: plagiarism ? match : "none",
    shingles: mine.slice(0, 200),
  };
}

export function looksLikeAssessment(text: string): boolean {
  const body = text.trim();
  if (body.length < 280) return false;
  let signals = 0;
  if (/\b(question|task|explain|evaluate|discuss|rubric|submit|assessment|answer)\b/i.test(body)) signals += 1;
  if (/(^|\n)\s*(\d+[\).:]|q\d+)/i.test(body)) signals += 1;
  if (body.length > 700) signals += 1;
  return signals >= 2;
}

function coverageOf(text: string, brief: string): number {
  const wanted = new Set(words(brief).filter((word) => word.length > 4 && !stops.has(word)));
  if (wanted.size === 0) return 0;
  const have = new Set(words(text));
  let hit = 0;
  for (const word of wanted) if (have.has(word)) hit += 1;
  return Math.round((hit / wanted.size) * 100);
}

function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 2 && !stops.has(word));
}

function shinglesOf(text: string): string[] {
  const tokens = words(text);
  const out = new Set<string>();
  for (let index = 0; index + 5 <= tokens.length; index += 1) {
    out.add(hash32(tokens.slice(index, index + 5).join(" ")));
  }
  return [...out];
}

function jaccard(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return 0;
  const have = new Set(left);
  let hit = 0;
  for (const item of right) if (have.has(item)) hit += 1;
  const union = left.length + right.length - hit;
  return union === 0 ? 0 : hit / union;
}

function hash32(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function docxText(bytes: Buffer): string {
  let offset = 0;
  while (offset + 30 < bytes.length) {
    if (bytes.readUInt32LE(offset) !== 0x04034b50) {
      offset += 1;
      continue;
    }
    const method = bytes.readUInt16LE(offset + 8);
    const size = bytes.readUInt32LE(offset + 18);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const name = bytes.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
    const start = offset + 30 + nameLength + extraLength;
    const data = bytes.subarray(start, start + size);
    if (name === "word/document.xml") {
      try {
        const xml = (method === 0 ? data : inflateRawSync(data)).toString("utf8");
        return xml.replace(/<w:p[^>]*>/g, "\n").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").slice(0, 200_000);
      } catch {
        return "";
      }
    }
    offset = start + size;
  }
  return "";
}

function pdfText(bytes: Buffer): string {
  const raw = bytes.toString("latin1");
  const parts: string[] = [];
  for (const match of raw.matchAll(/\((?:\\\)|[^)]){4,200}\)/g)) {
    parts.push(match[0].slice(1, -1).replace(/\\n/g, " ").replace(/\\(.)/g, "$1"));
    if (parts.join(" ").length > 200_000) break;
  }
  return parts.join(" ");
}
