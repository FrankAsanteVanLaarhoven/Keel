"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";
import { roomPlain, wordingText } from "@/lib/glossary";
import { useWording } from "./wording";
import {
  MODEL_LANGUAGES,
  UML_FAMILIES,
  UML_RELATIONS,
  UML_TOOLS,
  anchors,
  boardExtent,
  compartmentLines,
  crowMark,
  defaultFamily,
  diagramsFor,
  isShape,
  languageLabel,
  languageOf,
  loopPath,
  memberLine,
  nodeSize,
  pointOnWire,
  readStoredProject,
  relationKindOf,
  relationLook,
  relationsFor,
  snapCoord,
  stereotypeLabel,
  toolboxFor,
  umlGlyph,
  umlTool,
  visibilityOf,
  wirePath,
  wireStyleOf,
  type CrowMark,
  type ModelLanguage,
  type ToolboxEntry,
  type UmlFamily,
  type UmlGlyph,
  type UmlNodeType,
  type UmlRelation,
  type WireStyle,
} from "@/lib/foundry-board";
import { isExtensionType, toolVisible, type AcceptedPatch, type DiagramSnapshot, type ExtensionCommand, type ExtensionTool } from "@/lib/foundry-extensions";
import { FoundryExtensions } from "./foundry-extensions";
import { FoundryAi } from "./foundry-ai";
import { FoundryMermaid } from "./foundry-mermaid";
import { wireframeScreen } from "@/lib/foundry-mermaid";
import { sketchPath } from "@/lib/foundry-sketch";
import { checkModel, diagramSvg, htmlNotes, relationshipLines, sketchFileExtension, sketchLanguage as sketchModel, unconnectedNodes, type ModelIssue, type ModelSheet, type SketchLanguage } from "@/lib/foundry-model";
import {
  CHALLENGES,
  DEMO_TEMPLATES,
  DRAW_TYPES,
  SERVICE_TYPES,
  architectShouldWatch,
  clientReachesDatabase,
  connectionExportRecord,
  drawingTypeName,
  linkIsClientToDatabase,
  nodeExportRecord,
  readImportedConnections,
  readImportedNode,
  sheetsToModel,
  type ChallengeId,
  type Connection,
  type DiagramSheet,
  type NodeType,
  type SystemNode,
} from "@/lib/foundry-drawing";
import { SHARE_CHANNEL, SHARE_LIMIT, readShareMessage, shareRoom } from "@/lib/foundry-share";
import { DocumentationField, FoundryCommands, FoundryModeling, chooseFoundryPage, chooseFoundryTheme, readCanvasTheme, subscribeCanvasTheme, type DeskCommand } from "./foundry-modeling";
import {
  IconClient,
  IconGateway,
  IconAuth,
  IconCompute,
  IconCache,
  IconDatabase,
  IconQueue,
  IconCI,
  IconTelemetry,
  IconPointer,
  IconConnect,
  IconCut,
  IconAutoLayout,
  IconClear,
  IconArchitect,
  IconSurge,
  IconChaos,
  IconAutoHeal,
  IconExport,
  IconRefresh,
  IconCheck,
  IconClose,
  IconXP,
  IconPrinciple,
  IconArrowRight,
  IconPlay,
  IconPause,
  IconAnalytics,
} from "./icons";

export type { Connection, DemoTemplate, NodeType, SystemNode } from "@/lib/foundry-drawing";

type Particle = {
  id: number;
  connId: string;
  progress: number;
  speed: number;
  type: "request" | "response" | "cache_hit" | "db_write" | "blocked" | "ci_test";
  label: string;
  protocol: string;
  payloadSize: string;
  latencyMs: number;
  status: string;
  sourceLabel: string;
  targetLabel: string;
  description: string;
};

function NodeWords({ label, role, tool, type, bare }: { label: string; role: string; tool: string; type: string; bare?: boolean }) {
  const mode = useWording();
  const meaning = mode === "plain" ? roomPlain[type] || wordingText(label, mode) : wordingText(label, mode);
  if (bare) return <span title={wordingText(label, mode)}>{label}</span>;
  return (
    <>
      <p className="mt-1 truncate text-xs font-bold text-inherit" title={meaning}>{label}</p>
      {tool ? <p className="truncate text-[10px] text-inherit opacity-80" title={wordingText(tool, mode)}>{tool.split("/")[0]}</p> : null}
      {role ? <p className="sr-only">{role}</p> : null}
    </>
  );
}


type NodeMeta = {
  name: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  tool: string;
  desc: string;
};

const GLYPH_ICON: Record<UmlGlyph, React.ComponentType<{ size?: number; className?: string }>> = {
  class: IconCompute,
  iface: IconPrinciple,
  enum: IconCheck,
  data: IconDatabase,
  package: IconCompute,
  actor: IconClient,
  case: IconClient,
  bound: IconGateway,
  life: IconQueue,
  frag: IconArchitect,
  action: IconCompute,
  decide: IconAuth,
  start: IconPlay,
  stop: IconClose,
  end: IconClose,
  fork: IconPause,
  object: IconCompute,
  lane: IconGateway,
  comp: IconCompute,
  port: IconGateway,
  art: IconExport,
  node: IconDatabase,
  device: IconClient,
  exec: IconCI,
  state: IconAuth,
  choice: IconAuth,
  hist: IconRefresh,
  model: IconArchitect,
  frame: IconGateway,
  ball: IconClient,
  socket: IconConnect,
  entity: IconDatabase,
  weak: IconDatabase,
  junction: IconConnect,
  attr: IconPrinciple,
  rel: IconAuth,
  prompt: IconArchitect,
  modelcard: IconCompute,
  dataset: IconDatabase,
  embed: IconQueue,
  retriever: IconGateway,
  agent: IconClient,
  tool: IconCI,
  guard: IconAuth,
  eval: IconCheck,
  serving: IconTelemetry,
};

function umlNodeMeta(): Record<UmlNodeType, NodeMeta> {
  const meta = {} as Record<UmlNodeType, NodeMeta>;
  for (const tool of UML_TOOLS) {
    meta[tool.type] = { name: tool.name, color: "#d4d4d8", Icon: GLYPH_ICON[tool.glyph], tool: "", desc: tool.name };
  }
  return meta;
}

function drawnShape(type: string): boolean {
  return isShape(type) || isExtensionType(type);
}

const nodeTypeMeta: Record<NodeType, NodeMeta> = {
  client: { name: drawingTypeName("client"), color: "#1e293b", Icon: IconClient, tool: "Web / Mobile / React", desc: "User touchpoint that requests data and presents views." },
  gateway: { name: drawingTypeName("gateway"), color: "#1e40af", Icon: IconGateway, tool: "Nginx / Envoy / Cloudflare", desc: "Routes traffic, terminates SSL, rate-limits, and shields backends." },
  auth: { name: drawingTypeName("auth"), color: "#831843", Icon: IconAuth, tool: "Better Auth / JWT / OAuth", desc: "Verifies session identity, issues tokens, checks permissions." },
  compute: { name: drawingTypeName("compute"), color: "#3730a3", Icon: IconCompute, tool: "Node.js / Go / Kubernetes Pod", desc: "Runs business rules, processes calculations, handles mutations." },
  cache: { name: drawingTypeName("cache"), color: "#065f46", Icon: IconCache, tool: "Redis / Memcached", desc: "Delivers sub-millisecond responses for repeatable read data." },
  database: { name: drawingTypeName("database"), color: "#78350f", Icon: IconDatabase, tool: "PostgreSQL / SQLite", desc: "Durable persistent storage that records ground truth." },
  queue: { name: drawingTypeName("queue"), color: "#9a3412", Icon: IconQueue, tool: "Kafka / RabbitMQ / SQS", desc: "Decouples spikes by buffering async jobs and payments." },
  ci: { name: drawingTypeName("ci"), color: "#0f766e", Icon: IconCI, tool: "GitHub Actions / GitLab CI", desc: "Runs automated linting, unit tests, secret scanning before deploy." },
  telemetry: { name: drawingTypeName("telemetry"), color: "#115e59", Icon: IconTelemetry, tool: "Prometheus / Grafana / OTel", desc: "Gathers logs, metrics, traces, and triggers actionable alerts." },
  text: { name: drawingTypeName("text"), color: "#e4e4e7", Icon: IconPrinciple, tool: "Label", desc: "Text" },
  box: { name: drawingTypeName("box"), color: "#a1a1aa", Icon: IconCompute, tool: "Rectangle", desc: "Box" },
  ellipse: { name: drawingTypeName("ellipse"), color: "#a1a1aa", Icon: IconClient, tool: "Ellipse", desc: "Ellipse" },
  diamond: { name: drawingTypeName("diamond"), color: "#a1a1aa", Icon: IconAuth, tool: "Diamond", desc: "Diamond" },
  cylinder: { name: drawingTypeName("cylinder"), color: "#a1a1aa", Icon: IconDatabase, tool: "Cylinder", desc: "Cylinder" },
  cloud: { name: drawingTypeName("cloud"), color: "#a1a1aa", Icon: IconGateway, tool: "Cloud", desc: "Cloud" },
  note: { name: drawingTypeName("note"), color: "#fbbf24", Icon: IconArchitect, tool: "Note", desc: "Note" },
  ...umlNodeMeta(),
};


function entryKey(entry: ToolboxEntry): string {
  if (entry.kind === "node") return `node:${entry.type}`;
  if (entry.kind === "service") return `service:${entry.type}`;
  if (entry.kind === "relation") return `relation:${entry.id}`;
  return "wire:dataflow";
}


function downloadText(name: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
type CanvasToolMode = "select" | "pan" | "connect" | "disconnect" | "text";
type BoardSnap = { nodes: SystemNode[]; connections: Connection[] };
type Gesture =
  | { kind: "drag"; id: string; origin: BoardSnap }
  | { kind: "resize"; id: string; x: number; y: number; w: number; h: number; origin: BoardSnap }
  | { kind: "pan"; x: number; y: number; left: number; top: number };

let boardSerial = 0;
function freshBoardId(prefix: string) {
  boardSerial += 1;
  return `${prefix}-${boardSerial}`;
}

function UmlLines({ lines }: { lines: string[] }) {
  return (
    <div className="min-h-4 flex-1 overflow-hidden border-t border-zinc-600 pt-0.5">
      {lines.map((line, index) => (
        <p key={`${index}-${line}`} className="truncate text-left text-[10px] leading-snug text-zinc-200">{line}</p>
      ))}
    </div>
  );
}

function CrowFoot({ x, y, degrees, mark }: { x: number; y: number; degrees: number; mark: CrowMark }) {
  const optional = mark === "optional" || mark === "optional-many";
  const many = mark === "many" || mark === "optional-many";
  return (
    <g transform={`translate(${x} ${y}) rotate(${degrees})`} aria-hidden="true">
      {optional ? <circle cx={-16} cy={0} r={4} fill="none" stroke="#e4e4e7" strokeWidth={1.4} /> : null}
      <path d="M -8 -7 V 7" fill="none" stroke="#e4e4e7" strokeWidth={1.4} />
      {many ? <path d="M -8 0 L 2 -8 M -8 0 L 2 0 M -8 0 L 2 8" fill="none" stroke="#e4e4e7" strokeWidth={1.4} /> : <path d="M -8 0 H 2" fill="none" stroke="#e4e4e7" strokeWidth={1.4} />}
    </g>
  );
}

function UmlFace({ node, glyph, hideName }: { node: SystemNode; glyph: UmlGlyph; hideName: boolean }) {
  const stereo = stereotypeLabel(node.stereotype);
  const attrs = compartmentLines(node.attributes).map((line) => memberLine(line, node.visibility));
  const ops = compartmentLines(node.operations).map((line) => memberLine(line, node.visibility));
  const name = hideName ? "" : node.label;
  const marks = [node.abstract ? "abstract" : "", node.leaf ? "leaf" : "", node.finalSpec ? "final" : "", node.active ? "active" : ""].filter(Boolean).join(", ");
  if (glyph === "entity" || glyph === "weak" || glyph === "junction") {
    return (
      <div className={`relative z-10 flex h-full min-h-0 flex-col text-zinc-100 ${glyph === "weak" ? "outline outline-1 outline-offset-2 outline-zinc-300" : ""}`}>
        <p className="truncate border-b border-zinc-500 pb-1 text-center text-xs font-bold">{name}</p>
        <div className="min-h-0 flex-1 overflow-hidden pt-1 text-left">
          {attrs.map((line, index) => (
            <p key={`${index}-${line}`} className={`truncate text-[10px] leading-snug ${/^PK\b/i.test(line) ? "font-bold" : ""}`}>{line}</p>
          ))}
        </div>
      </div>
    );
  }
  if (glyph === "class" || glyph === "iface" || glyph === "data" || glyph === "enum" || glyph === "state" || glyph === "object" || glyph === "prompt" || glyph === "modelcard" || glyph === "dataset" || glyph === "embed" || glyph === "retriever" || glyph === "agent" || glyph === "tool" || glyph === "guard" || glyph === "eval" || glyph === "serving") {
    return (
      <div className="relative z-10 flex h-full min-h-0 flex-col text-center text-zinc-100">
        {stereo ? <p className="truncate text-[10px] leading-tight text-zinc-300">{stereo}</p> : null}
        {marks ? <p className="truncate text-[10px] leading-tight text-zinc-400">{marks}</p> : null}
        {name ? <p className={`truncate text-xs font-bold ${glyph === "object" ? "underline" : ""} ${node.abstract ? "italic" : ""}`}>{name}</p> : null}
        <UmlLines lines={attrs} />
        {glyph === "enum" && ops.length === 0 ? null : <UmlLines lines={ops} />}
      </div>
    );
  }
  if (glyph === "actor") {
    return (
      <div className="relative z-10 flex h-full flex-col items-center text-zinc-100">
        <svg viewBox="0 0 40 64" className="h-16 w-10" aria-hidden="true">
          <circle cx="20" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M20 14 V36 M8 22 H32 M20 36 L8 56 M20 36 L32 56" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        {name ? <p className="mt-1 truncate text-center text-xs font-bold">{name}</p> : null}
      </div>
    );
  }
  if (glyph === "start" || glyph === "stop" || glyph === "end" || glyph === "hist" || glyph === "ball" || glyph === "socket" || glyph === "port" || glyph === "fork") {
    return (
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-zinc-100">
        {glyph === "start" ? <span className="h-5 w-5 rounded-full bg-zinc-100" /> : null}
        {glyph === "stop" ? <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-100"><span className="h-3 w-3 rounded-full bg-zinc-100" /></span> : null}
        {glyph === "end" ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 8 L16 16 M16 8 L8 16" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        ) : null}
        {glyph === "hist" ? <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-100 text-xs font-bold">{name || "H"}</span> : null}
        {glyph === "ball" ? <span className="h-4 w-4 rounded-full bg-zinc-100" /> : null}
        {glyph === "socket" ? (
          <svg viewBox="0 0 36 24" className="h-6 w-9" aria-hidden="true">
            <path d="M2 12 H16" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16 4 A8 8 0 0 1 16 20" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        ) : null}
        {glyph === "port" ? <span className="h-3.5 w-3.5 border border-zinc-100 bg-zinc-800" /> : null}
        {glyph === "fork" ? <span className="h-2 w-full rounded-sm bg-zinc-100" /> : null}
        {name && glyph !== "hist" ? <p className="mt-1 max-w-full truncate text-center text-[10px]">{name}</p> : null}
      </div>
    );
  }
  if (glyph === "decide" || glyph === "choice" || glyph === "action" || glyph === "case") {
    return (
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-zinc-100">
        {stereo ? <p className="truncate text-[10px] text-zinc-300">{stereo}</p> : null}
        {name ? <p className="truncate text-xs font-bold">{name}</p> : null}
      </div>
    );
  }
  if (glyph === "life") {
    return (
      <div className="relative z-10 flex h-full flex-col items-center text-zinc-100">
        <div className="w-full border border-zinc-400 bg-zinc-800 px-1 py-1 text-center">
          {stereo ? <p className="truncate text-[10px] text-zinc-300">{stereo}</p> : null}
          {name ? <p className="truncate text-xs font-bold">{name}</p> : null}
        </div>
        <div className="mt-1 w-px flex-1 border-l border-dashed border-zinc-300" />
      </div>
    );
  }
  if (glyph === "package" || glyph === "model") {
    return (
      <div className="relative z-10 h-full text-zinc-100">
        <div className="absolute left-0 top-0 flex max-w-[80%] items-center gap-1 border border-zinc-400 bg-zinc-800 px-2 py-0.5 text-[10px] font-bold">
          {glyph === "model" ? <span className="inline-block h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-zinc-100" /> : null}
          <span className="truncate">{name || stereo}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-5 border border-zinc-400" />
      </div>
    );
  }
  if (glyph === "frame" || glyph === "frag" || glyph === "bound" || glyph === "lane") {
    return (
      <div className={`relative z-10 h-full text-zinc-100 ${glyph === "bound" ? "border border-dashed border-zinc-400" : "border border-zinc-400"} ${glyph === "lane" ? "flex flex-col" : ""}`}>
        <div className={`${glyph === "lane" ? "border-b border-zinc-400 py-1 text-center" : "inline-block border-b border-r border-zinc-400 px-2 py-0.5"} text-[10px] font-bold`}>
          {stereo || name}
        </div>
        {name && stereo ? <p className="truncate px-2 pt-1 text-xs font-bold">{name}</p> : null}
        {glyph === "frag" || glyph === "lane" ? (
          <div className="px-2 pt-1">{attrs.map((line, index) => <p key={`${index}-${line}`} className="truncate text-[10px]">{line}</p>)}</div>
        ) : null}
      </div>
    );
  }
  if (glyph === "comp") {
    return (
      <div className="relative z-10 h-full pl-4 text-zinc-100">
        <span className="absolute left-0 top-2 h-2.5 w-4 border border-zinc-300 bg-zinc-800" />
        <span className="absolute left-0 top-6 h-2.5 w-4 border border-zinc-300 bg-zinc-800" />
        {stereo ? <p className="truncate text-center text-[10px] text-zinc-300">{stereo}</p> : null}
        {name ? <p className="truncate text-center text-xs font-bold">{name}</p> : null}
      </div>
    );
  }
  if (glyph === "art") {
    return (
      <div className="relative z-10 h-full border border-zinc-400 bg-zinc-800 p-1 text-zinc-100" style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" }}>
        <span className="absolute right-0 top-0 h-3.5 w-3.5 border-b border-l border-zinc-400 bg-zinc-700" />
        {stereo ? <p className="truncate text-[10px] text-zinc-300">{stereo}</p> : null}
        {name ? <p className="truncate text-xs font-bold">{name}</p> : null}
      </div>
    );
  }
  return (
    <div className="relative z-10 h-full text-zinc-100">
      <div className="absolute left-3 right-0 top-0 h-3 border border-zinc-400 bg-zinc-700" style={{ transform: "skewX(-28deg)" }} />
      <div className="absolute inset-x-0 bottom-0 top-3 border border-zinc-400 bg-zinc-800 p-1">
        {stereo ? <p className="truncate text-center text-[10px] text-zinc-300">{stereo}</p> : null}
        {name ? <p className="truncate text-center text-xs font-bold">{name}</p> : null}
      </div>
    </div>
  );
}

function LanguageIcon({ id }: { id: ModelLanguage }) {
  const pen = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (id === "uml") {
    return <svg {...pen}><path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z" /><path d="M12 12.2 19.5 8M12 12.2v8.3M12 12.2 4.5 8" /></svg>;
  }
  if (id === "erd") {
    return <svg {...pen}><rect x="4" y="5" width="16" height="14" rx="1.5" /><path d="M4 9.5h16M10 9.5V19" /></svg>;
  }
  if (id === "dataflow") {
    return <svg {...pen}><path d="M12 4.5v15M12 4.5 9 7.5M12 4.5l3 3M12 19.5 9 16.5M12 19.5l3-3" /></svg>;
  }
  if (id === "flowchart") {
    return <svg {...pen}><path d="m12 3.5 8.5 8.5L12 20.5 3.5 12 12 3.5Z" /></svg>;
  }
  if (id === "mindmap") {
    return <svg {...pen}><path d="M9.2 17.5a3.4 3.4 0 0 1-1.6-6.4 3.6 3.6 0 0 1 2.8-4.6A3.3 3.3 0 0 1 15 8.2a3.1 3.1 0 0 1 2.4 5.2 3.3 3.3 0 0 1-2.2 5.6H9.6" /><path d="M12 8.8v6.2" /></svg>;
  }
  if (id === "c4") {
    return <svg {...pen}><rect x="9" y="3.5" width="6" height="4" rx="1" /><rect x="3" y="16" width="6" height="4" rx="1" /><rect x="15" y="16" width="6" height="4" rx="1" /><path d="M12 7.5v4M6 16v-4.5h12V16" /></svg>;
  }
  if (id === "sysml") {
    return <svg {...pen}><path d="M3.5 20V10.5l4 2V10l4 2V8.5l4 2.5V9l4.5 2.8V20H3.5Z" /><path d="M8 20v-3h3v3" /></svg>;
  }
  if (id === "bpmn") {
    return <svg {...pen}><circle cx="12" cy="6.5" r="2" /><path d="M12 8.7v4.2M9.2 11.2h5.6M12 12.9 9.6 17.5M12 12.9l2.4 4.6" /><circle cx="6" cy="17.2" r="1.1" /><circle cx="18" cy="17.2" r="1.1" /></svg>;
  }
  if (id === "wireframe") {
    return <svg {...pen}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M3.5 8.5h17" /><circle cx="6.2" cy="6.5" r="0.6" fill="currentColor" /></svg>;
  }
  if (id === "aws") {
    return <svg {...pen}><path d="M7.2 17.5h9.4a3.4 3.4 0 0 0 .3-6.8 4.6 4.6 0 0 0-8.8-1A3.3 3.3 0 0 0 7.2 17.5Z" /></svg>;
  }
  if (id === "gcp") {
    return <svg {...pen}><rect x="5" y="5" width="14" height="4.2" rx="1.3" /><rect x="5" y="11.4" width="14" height="4.2" rx="1.3" /></svg>;
  }
  if (id === "azure") {
    return <svg {...pen}><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M4 10.2h16M8 14.2h3" /><circle cx="15.6" cy="14.2" r="0.7" fill="currentColor" /></svg>;
  }
  return <svg {...pen}><path d="M12 3.5v3.2M12 17.3V20.5M3.5 12h3.2M17.3 12H20.5M6.2 6.2l2.2 2.2M15.6 15.6l2.2 2.2M17.8 6.2l-2.2 2.2M8.4 15.6 6.2 17.8" /></svg>;
}

export function FoundryLab({ m, initialChallengeId, initialStudio }: { m: Messages; initialChallengeId?: string; initialStudio?: string }) {
  const { me, refresh } = useKeel();
  const validInitial = CHALLENGES.find((c) => c.id === initialChallengeId);
  const studio = UML_FAMILIES.some((family) => family.id === initialStudio) ? initialStudio as UmlFamily : "class";
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId>(validInitial ? (initialChallengeId as ChallengeId) : "freeform");
  const [nodes, setNodes] = useState<SystemNode[]>(validInitial ? validInitial.initialNodes : CHALLENGES[0].initialNodes);
  const [connections, setConnections] = useState<Connection[]>(validInitial ? validInitial.initialConnections : CHALLENGES[0].initialConnections);
  
  // Selection and drawing state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<CanvasToolMode>("select");
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Simulation State
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trafficMultiplier, setTrafficMultiplier] = useState(1);
  const [flowSpeed, setFlowSpeed] = useState<0.25 | 0.5 | 1 | 2>(0.5);
  const [flowPaused, setFlowPaused] = useState(false);
  const [hoveredParticle, setHoveredParticle] = useState<Particle | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const [showAnalyticsDrawer, setShowAnalyticsDrawer] = useState(false);
  const [recentPacketLedger, setRecentPacketLedger] = useState<Particle[]>([]);
  const [chaosActive, setChaosActive] = useState(false);
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [xp, setXp] = useState(me?.xp ?? 120);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showTooltips] = useState(true);

  // AI Architect & Guide State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    status: "verified" | "flawed" | "warning";
    statusText: string;
    whatIsWrong: string;
    whyItMatters: string;
    stepByStep: string[];
    canAutoFix: boolean;
  } | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [showAiGuide, setShowAiGuide] = useState(true);
  const [fullPage, setFullPage] = useState(true);
  const portalReady = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [wireStyle, setWireStyle] = useState<WireStyle>("curve");
  const [umlFamily, setUmlFamily] = useState<UmlFamily>(studio);
  const [relationKind, setRelationKind] = useState<UmlRelation | "">("");
  const [sheets, setSheets] = useState<DiagramSheet[]>([{ id: "diagram-1", name: "Diagram 1", family: studio, nodes: validInitial ? validInitial.initialNodes : [], connections: validInitial ? validInitial.initialConnections : [] }]);
  const [sheetId, setSheetId] = useState("diagram-1");
  const [showExplorer, setShowExplorer] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [showMermaid, setShowMermaid] = useState(false);
  const [sketchWire, setSketchWire] = useState(true);
  const [showModeling, setShowModeling] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [modelIssues, setModelIssues] = useState<ModelIssue[]>([]);
  const [modelBusy, setModelBusy] = useState(false);
  const [modelNote, setModelNote] = useState("");
  const [shareRoomName, setShareRoomName] = useState("");
  const [shareOn, setShareOn] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<SketchLanguage>("java");
  const [sketchText, setSketchText] = useState("");
  const [deskLines, setDeskLines] = useState<string[]>([]);
  const [looseShapes, setLooseShapes] = useState<{ id: string; label: string }[]>([]);
  const [printPage, setPrintPage] = useState<"a4" | "letter">("a4");
  const [extensionCommands, setExtensionCommands] = useState<ExtensionCommand[]>([]);
  const canvasTheme = useSyncExternalStore(subscribeCanvasTheme, readCanvasTheme, () => "dark" as const);
  const [extensionTools, setExtensionTools] = useState<ExtensionTool[]>([]);
  const [showRail, setShowRail] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [historyCounts, setHistoryCounts] = useState({ past: 0, future: 0 });

  const boardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const particleIdRef = useRef(1);
  const nodesRef = useRef(nodes);
  const connectionsRef = useRef(connections);
  const sheetsRef = useRef(sheets);
  const sheetIdRef = useRef(sheetId);
  const shareClient = useRef("");
  const shareEcho = useRef(false);
  const shareSkip = useRef(true);
  const shareOnRef = useRef(false);
  const shareRoomRef = useRef("");
  const shareChannel = useRef<BroadcastChannel | null>(null);
  const shareApply = useRef<(project: unknown) => void>(() => {});
  const shareSend = useRef<() => void>(() => {});
  const historyRef = useRef<{ past: BoardSnap[]; future: BoardSnap[] }>({ past: [], future: [] });
  const editRemembered = useRef(false);
  const zoomRef = useRef(zoom);
  const snapRef = useRef(snap);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const gestureRef = useRef<Gesture | null>(null);
  const awardedMissions = useRef(new Set<string>());
  const commands = useRef({
    undo: () => {},
    redo: () => {},
    copy: () => {},
    remove: () => {},
  });
  const paletteRef = useRef<() => void>(() => {});
  const checkToken = useRef(0);
  const extensionRun = useRef<(command: ExtensionCommand) => void>(() => {});

  useEffect(() => {
    nodesRef.current = nodes;
    connectionsRef.current = connections;
    sheetsRef.current = sheets;
    sheetIdRef.current = sheetId;
    zoomRef.current = zoom;
    snapRef.current = snap;
    gestureRef.current = gesture;
  }, [nodes, connections, sheets, sheetId, zoom, snap, gesture]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const view = viewportRef.current;
      const scale = zoomRef.current || 1;
      if (!view) return;
      const reveal = (x: number, y: number, w: number, h: number) => {
        const top = Math.max(0, y * scale - 12);
        const bottom = (y + h + 16) * scale;
        const left = Math.max(0, x * scale - 12);
        const right = (x + w + 16) * scale;
        if (bottom - top > view.clientHeight) view.scrollTop = Math.max(0, bottom - view.clientHeight);
        else if (bottom > view.scrollTop + view.clientHeight) view.scrollTop = bottom - view.clientHeight;
        else if (top < view.scrollTop) view.scrollTop = top;
        if (right - left > view.clientWidth) view.scrollLeft = Math.max(0, right - view.clientWidth);
        else if (right > view.scrollLeft + view.clientWidth) view.scrollLeft = right - view.clientWidth;
        else if (left < view.scrollLeft) view.scrollLeft = left;
      };
      const node = nodesRef.current.find((item) => item.id === selectedNodeId);
      if (node) {
        const size = nodeSize(node);
        reveal(node.x, node.y, size.w, size.h);
      }
      const conn = connectionsRef.current.find((item) => item.id === selectedConnId);
      const from = nodesRef.current.find((item) => item.id === conn?.from);
      const to = nodesRef.current.find((item) => item.id === conn?.to);
      if (from && to) {
        const fromSize = nodeSize(from);
        const toSize = nodeSize(to);
        const x = Math.min(from.x, to.x);
        const y = Math.min(from.y, to.y);
        reveal(x, y, Math.max(from.x + fromSize.w, to.x + toSize.w) - x, Math.max(from.y + fromSize.h, to.y + toSize.h) - y);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedNodeId, selectedConnId]);

  const boardPoint = useCallback((clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    const scale = zoomRef.current || 1;
    if (!rect) return { x: 0, y: 0 };
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  }, []);

  function snapshot(): BoardSnap {
    return {
      nodes: nodesRef.current.map((node) => ({ ...node })),
      connections: connectionsRef.current.map((conn) => ({ ...conn })),
    };
  }

  function publishHistory() {
    setHistoryCounts({
      past: historyRef.current.past.length,
      future: historyRef.current.future.length,
    });
  }

  function remember() {
    historyRef.current.past.push(snapshot());
    if (historyRef.current.past.length > 80) historyRef.current.past.shift();
    historyRef.current.future = [];
    publishHistory();
  }

  function undo() {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    historyRef.current.future.push(snapshot());
    nodesRef.current = prev.nodes;
    connectionsRef.current = prev.connections;
    setNodes(prev.nodes);
    setConnections(prev.connections);
    publishHistory();
  }

  function redo() {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push(snapshot());
    nodesRef.current = next.nodes;
    connectionsRef.current = next.connections;
    setNodes(next.nodes);
    setConnections(next.connections);
    publishHistory();
  }

  function rememberOnce() {
    if (editRemembered.current) return;
    editRemembered.current = true;
    remember();
  }

  const canUndo = historyCounts.past > 0;
  const canRedo = historyCounts.future > 0;

  // Switch challenge
  const selectChallenge = (id: ChallengeId) => {
    const ch = CHALLENGES.find((c) => c.id === id);
    if (!ch) return;
    remember();
    const nextNodes = JSON.parse(JSON.stringify(ch.initialNodes)) as SystemNode[];
    const nextConnections = JSON.parse(JSON.stringify(ch.initialConnections)) as Connection[];
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setActiveChallenge(id);
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setToast({ message: `Loaded Mission: ${ch.title}`, type: "info" });
  };

  // Load a Prebuilt Demo Template
  const loadTemplate = (templateId: string) => {
    const t = DEMO_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (!t) return;
    remember();
    const nextNodes = JSON.parse(JSON.stringify(t.nodes)) as SystemNode[];
    const nextConnections = JSON.parse(JSON.stringify(t.connections)) as Connection[];
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setActiveChallenge("freeform");
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setToast({ message: t.name, type: "success" });
  };

  // Tidy / Auto-Layout Architecture Tool (Places nodes into neat, non-overlapping enterprise tiers)
  const tidyArchitecture = (source?: SystemNode[], record = true) => {
    const tierMap: Partial<Record<NodeType, number>> = {
      client: 0,
      gateway: 1,
      auth: 1,
      compute: 2,
      ci: 2,
      cache: 3,
      queue: 3,
      database: 4,
      telemetry: 5,
    };

    const list = source ?? nodesRef.current;
    if (record) remember();
    const tiers: Record<number, SystemNode[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const node of list) {
      if (drawnShape(node.type)) continue;
      const tier = tierMap[node.type] ?? 2;
      tiers[tier].push(node);
    }

    const updated = list.map((node) => {
      if (drawnShape(node.type)) return node;
      const tier = tierMap[node.type] ?? 2;
      const tierList = tiers[tier] ?? [];
      const indexInTier = tierList.findIndex((n) => n.id === node.id);

      if (tier === 5) {
        // Telemetry row at bottom
        return {
          ...node,
          x: 340 + indexInTier * 220,
          y: 400,
        };
      }

      const x = 50 + tier * 210;
      const y = 60 + indexInTier * 135;
      return { ...node, x, y };
    });

    nodesRef.current = updated;
    setNodes(updated);
    setToast({ message: "The parts are lined up.", type: "success" });
  };

  // Live Heuristic & AI Diagnostic Engine
  const runAiDiagnostic = useCallback(async (customQuestion?: string) => {
    setAiAnalyzing(true);

    // 1. Rule-based heuristic verification
    const hasDirectDb = clientReachesDatabase(nodes, connections);
    const hasCompute = nodes.some((n) => n.type === "compute");
    const hasDown = nodes.some((n) => n.health === "down");
    const isolatedNodes = nodes.filter((n) => !connections.some((c) => c.from === n.id || c.to === n.id));
    const hasCache = nodes.some((n) => n.type === "cache");
    const isHeavyLoad = trafficMultiplier >= 2;

    let status: "verified" | "flawed" | "warning" = "verified";
    let statusText = "The drawing holds.";
    let whatIsWrong = "The person, the decision, and the record stay apart.";
    let whyItMatters = "A person reaches the record only through the part that decides.";
    let stepByStep: string[] = [];
    let canAutoFix = false;

    if (hasDirectDb) {
      status = "flawed";
      statusText = "The person reaches the record directly.";
      whatIsWrong = "The client is connected to the database. Nothing between them checks who the person is or what they may do.";
      whyItMatters = "Anyone who can open the page can read and change the records.";
      stepByStep = [
        "Remove the line from the client to the database.",
        "Put a check and the application between them.",
        "Connect the client to the check, the check to the application, and the application to the database.",
      ];
      canAutoFix = true;
    } else if (!hasCompute && nodes.length >= 2) {
      status = "flawed";
      statusText = "The decision has nowhere to live.";
      whatIsWrong = "The drawing has a person and a record, and no application between them.";
      whyItMatters = "A rule that lives in the browser can be changed by the person using it.";
      stepByStep = [
        "Add the application.",
        "Connect the person to the application, and the application to the record.",
      ];
      canAutoFix = true;
    } else if (hasDown) {
      status = "flawed";
      statusText = "A part of the drawing is down.";
      whatIsWrong = "A part on the path is down, so the request stops there.";
      whyItMatters = "The person gets no answer while that part is down.";
      stepByStep = [
        "Mark that part healthy, or restore it.",
        "Give the request another place to wait if that part fails.",
      ];
      canAutoFix = true;
    } else if (isolatedNodes.length > 0) {
      status = "warning";
      statusText = "A part is not connected.";
      whatIsWrong = `${isolatedNodes.map((n) => n.label).join(", ")} ${isolatedNodes.length === 1 ? "has" : "have"} no line.`;
      whyItMatters = "A part with no line does no work.";
      stepByStep = ["Connect it, or remove it."];
      canAutoFix = false;
    } else if (isHeavyLoad && !hasCache) {
      status = "warning";
      statusText = "The record is taking every read.";
      whatIsWrong = "The load is high, and every read goes to the database.";
      whyItMatters = "The database runs out of room for new requests, and the answer gets slow.";
      stepByStep = [
        "Add a cache beside the application.",
        "Send repeated reads to the cache.",
      ];
      canAutoFix = true;
    }

    // Attempt AI enhancement via OpenRouter endpoint
    try {
      const res = await fetch("/api/foundry/analyze", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({
          nodes: nodes.map((n) => ({ id: n.id, type: n.type, label: n.label, health: n.health })),
          connections: connections.map((c) => ({ from: c.from, to: c.to })),
          challengeTitle: activeChallenge,
          question: customQuestion,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const text = String(data.reply);
          const wrongMatch = text.match(/WHAT IS WRONG[\s\S]*?:([\s\S]*?)(?=WHY IT MATTERS|$)/i);
          const whyMatch = text.match(/WHY IT MATTERS[\s\S]*?:([\s\S]*?)(?=STEP-BY-STEP GUIDANCE|$)/i);
          const stepsMatch = text.match(/STEP-BY-STEP GUIDANCE[\s\S]*?:([\s\S]*)$/i);

          if (wrongMatch && wrongMatch[1]) whatIsWrong = wrongMatch[1].trim();
          if (whyMatch && whyMatch[1]) whyItMatters = whyMatch[1].trim();
          if (stepsMatch && stepsMatch[1]) {
            const parsedSteps = stepsMatch[1]
              .split(/\n\d+\.\s+/)
              .map((s) => s.trim())
              .filter(Boolean);
            if (parsedSteps.length > 0) stepByStep = parsedSteps;
          }
        }
      }
    } catch {
      // Keep heuristic fallback
    }

    setAiReport({
      status,
      statusText,
      whatIsWrong,
      whyItMatters,
      stepByStep,
      canAutoFix,
    });
    setAiAnalyzing(false);
  }, [nodes, connections, trafficMultiplier, activeChallenge]);

  // Run AI analysis on topology change (debounced)
  useEffect(() => {
    if (!architectShouldWatch(fullPage, showAiGuide)) return;
    const timer = setTimeout(() => {
      void runAiDiagnostic();
    }, 600);
    return () => clearTimeout(timer);
  }, [nodes.length, connections.length, trafficMultiplier, runAiDiagnostic, fullPage, showAiGuide]);

  // Mission progress follows the drawing. The award itself is deferred so it is not a render cascade.
  useEffect(() => {
    const current = CHALLENGES.find((c) => c.id === activeChallenge);
    if (!current || activeChallenge === "freeform") return;
    if (solvedChallenges.includes(activeChallenge) || awardedMissions.current.has(activeChallenge)) return;
    if (!current.checkSuccess(nodes, connections)) return;
    const missionId = activeChallenge;
    const title = current.title;
    const timer = window.setTimeout(() => {
      if (awardedMissions.current.has(missionId)) return;
      awardedMissions.current.add(missionId);
      setSolvedChallenges((prev) => (prev.includes(missionId) ? prev : [...prev, missionId]));
      setXp((prev) => prev + 50);
      setToast({ message: `Mission Passed! +50 XP: ${title}`, type: "success" });
      fetch("/api/foundry/complete", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ challengeId: missionId }),
      })
        .then(() => refresh())
        .catch(() => {});
    }, 0);
    return () => window.clearTimeout(timer);
  }, [nodes, connections, activeChallenge, solvedChallenges, refresh]);

  // Particle Generation Loop (Human-trackable live dataflow)
  useEffect(() => {
    if (connections.length === 0 || flowPaused || selectedParticle !== null) return;
    const interval = window.setInterval(() => {
      if (connections.length === 0) return;
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      if (!randomConn) return;

      const fromNode = nodes.find((n) => n.id === randomConn.from);
      const toNode = nodes.find((n) => n.id === randomConn.to);
      if (!fromNode || !toNode || fromNode.health === "down") return;
      if (umlGlyph(fromNode.type) || umlGlyph(toNode.type) || drawnShape(fromNode.type) || drawnShape(toNode.type) || relationKindOf(randomConn.kind)) return;

      let pType: Particle["type"] = "request";
      let pLabel = "HTTP GET /api/v1/feed";
      let pProtocol = "HTTPS / TLS 1.3";
      let pSize = "840 B";
      let pLatency = 14;
      let pStatus = "200 OK";
      let pDesc = "User touchpoint initiating secure TLS session to ingress tier.";

      if (toNode.type === "cache") {
        pType = "cache_hit";
        pLabel = "REDIS GET session:token";
        pProtocol = "RESP / TCP:6379";
        pSize = "420 B";
        pLatency = 2;
        pStatus = "CACHE_HIT";
        pDesc = "In-memory key-value read bypasses database disk IO for sub-millisecond retrieval.";
      } else if (toNode.type === "database") {
        pType = "db_write";
        pLabel = "SQL INSERT INTO orders";
        pProtocol = "PostgreSQL / TCP:5432";
        pSize = "3.2 KB";
        pLatency = 24;
        pStatus = "ACID COMMITTED";
        pDesc = "Synchronous durable write with write-ahead log (WAL) synchronization.";
      } else if (toNode.type === "auth") {
        pType = chaosActive ? "blocked" : "request";
        pLabel = "JWT Session Token Verify";
        pProtocol = "gRPC / TLS";
        pSize = "1.1 KB";
        pLatency = 4;
        pStatus = chaosActive ? "401 UNAUTHORIZED" : "200 VERIFIED";
        pDesc = chaosActive
          ? "Fault injection: Security Guard revoked compromised token at the edge."
          : "Zero-trust verification validating cryptographic signature and RBAC scopes.";
      } else if (toNode.type === "queue") {
        pType = "request";
        pLabel = "KAFKA PRODUCE events.orders";
        pProtocol = "Kafka Binary / TCP:9092";
        pSize = "2.4 KB";
        pLatency = 5;
        pStatus = "ACK_ALL";
        pDesc = "Asynchronous decoupled message published across partitioned event stream.";
      } else if (toNode.type === "ci") {
        pType = "ci_test";
        pLabel = "CI/CD Test Runner Artifact";
        pProtocol = "GitOps / SSH";
        pSize = "14.2 KB";
        pLatency = 38;
        pStatus = "PASS";
        pDesc = "Automated pipeline runner executing unit tests and container builds.";
      }

      particleIdRef.current += 1;
      const newParticle: Particle = {
        id: particleIdRef.current,
        connId: randomConn.id,
        progress: 0,
        // Gentle human-trackable speed (3-6s transit) scaled by flowSpeed and trafficMultiplier
        speed: (0.003 + Math.random() * 0.0015) * flowSpeed * trafficMultiplier,
        type: pType,
        label: pLabel,
        protocol: pProtocol,
        payloadSize: pSize,
        latencyMs: pLatency,
        status: pStatus,
        sourceLabel: fromNode.label,
        targetLabel: toNode.label,
        description: pDesc,
      };

      setParticles((prev) => [...prev.slice(-25), newParticle]);
      setRecentPacketLedger((prev) => [newParticle, ...prev.slice(0, 19)]);
    }, 450 / Math.max(0.5, trafficMultiplier * flowSpeed));

    return () => window.clearInterval(interval);
  }, [connections, nodes, trafficMultiplier, chaosActive, flowPaused, selectedParticle, flowSpeed]);

  // Particle Movement Animation Loop
  useEffect(() => {
    let animId: number;
    const step = () => {
      // If paused or inspecting a selected particle, STOP the flow completely!
      if (!flowPaused && selectedParticle === null) {
        // If hovered, slow down to 0.15x speed for effortless tracking
        const speedScale = hoveredParticle !== null ? 0.15 : 1.0;
        setParticles((prev) =>
          prev
            .map((p) => ({ ...p, progress: p.progress + p.speed * speedScale }))
            .filter((p) => p.progress < 1)
        );
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [flowPaused, selectedParticle, hoveredParticle]);

  const applyPointer = useCallback((clientX: number, clientY: number) => {
    const point = boardPoint(clientX, clientY);
    setMousePos(point);
    const act = gestureRef.current;
    if (!act) return;
    if (act.kind === "pan") {
      if (viewportRef.current) {
        viewportRef.current.scrollLeft = act.left - (clientX - act.x);
        viewportRef.current.scrollTop = act.top - (clientY - act.y);
      }
      return;
    }
    if (act.kind === "resize") {
      let w = Math.max(72, act.w + (point.x - act.x));
      let h = Math.max(48, act.h + (point.y - act.y));
      if (snapRef.current) {
        w = Math.max(72, snapCoord(w));
        h = Math.max(48, snapCoord(h));
      }
      setNodes((prev) => {
        const next = prev.map((node) => (node.id === act.id ? { ...node, w, h } : node));
        nodesRef.current = next;
        return next;
      });
      return;
    }
    const off = dragOffsetRef.current;
    let x = Math.max(0, point.x - off.x);
    let y = Math.max(0, point.y - off.y);
    if (snapRef.current) {
      x = Math.max(0, snapCoord(x));
      y = Math.max(0, snapCoord(y));
    }
    setNodes((prev) => {
      const next = prev.map((node) => (node.id === act.id ? { ...node, x, y } : node));
      nodesRef.current = next;
      return next;
    });
  }, [boardPoint]);

  const finishGesture = useCallback(() => {
    const act = gestureRef.current;
    if (!act) return;
    gestureRef.current = null;
    setGesture(null);
    if (act.kind !== "drag" && act.kind !== "resize") return;
    const before = act.origin.nodes.find((node) => node.id === act.id);
    const after = nodesRef.current.find((node) => node.id === act.id);
    if (!before || !after) return;
    if (before.x === after.x && before.y === after.y && before.w === after.w && before.h === after.h) return;
    historyRef.current.past.push(act.origin);
    if (historyRef.current.past.length > 80) historyRef.current.past.shift();
    historyRef.current.future = [];
    setHistoryCounts({
      past: historyRef.current.past.length,
      future: historyRef.current.future.length,
    });
  }, []);

  useEffect(() => {
    if (!gesture) return;
    const move = (event: PointerEvent) => applyPointer(event.clientX, event.clientY);
    const up = () => finishGesture();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gesture, applyPointer, finishGesture]);

  useEffect(() => {
    if (!fullPage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [fullPage]);

  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom((current) => Math.min(2, Math.max(0.25, current * (event.deltaY > 0 ? 0.9 : 1.1))));
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => view.removeEventListener("wheel", onWheel);
  }, [fullPage]);

  // Connect Nodes helper
  const makeConnection = (fromId: string, toId: string) => {
    const kind = relationKindOf(relationKind);
    if (fromId === toId && !kind) return;
    const exists = connections.some(
      (c) => (c.from === fromId && c.to === toId) || (fromId !== toId && c.from === toId && c.to === fromId)
    );
    if (!exists) {
      const fromNode = nodes.find((n) => n.id === fromId);
      const toNode = nodes.find((n) => n.id === toId);
      const isDangerous = fromNode?.type === "client" && toNode?.type === "database";
      const look = relationLook(kind);

      const newConn: Connection = {
        id: freshBoardId("c"),
        from: fromId,
        to: toId,
        status: isDangerous ? "error" : "active",
        protocol: isDangerous ? "DIRECT TCP (VULNERABLE)" : look ? look.label : "HTTPS / Dataflow",
        style: wireStyle,
        kind: kind || undefined,
        fromMult: kind === "crows" ? "1" : undefined,
        toMult: kind === "crows" ? "*" : undefined,
      };
      remember();
      const next = [...connectionsRef.current, newConn];
      connectionsRef.current = next;
      setConnections(next);
      setSelectedConnId(newConn.id);
      setToast({
        message: isDangerous
          ? "Connected directly to DB! Vulnerability created."
          : `Linked: ${fromNode?.label} → ${toNode?.label}`,
        type: isDangerous ? "error" : "success",
      });
    }
  };

  // Drag & Pointer Handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (toolMode === "pan" || e.altKey || e.button === 1) {
      const view = viewportRef.current;
      if (!view) return;
      const nextGesture: Gesture = { kind: "pan", x: e.clientX, y: e.clientY, left: view.scrollLeft, top: view.scrollTop };
      gestureRef.current = nextGesture;
      setGesture(nextGesture);
      return;
    }
    if (toolMode === "text") {
      setSelectedNodeId(id);
      setSelectedConnId(null);
      setEditingId(id);
      return;
    }
    if (toolMode === "connect" || connectFromId) {
      if (connectFromId) {
        if (connectFromId !== id || relationKindOf(relationKind)) {
          makeConnection(connectFromId, id);
        }
        setConnectFromId(null);
      } else {
        setConnectFromId(id);
      }
      return;
    }

    if (toolMode === "disconnect") {
      const conns = connections.filter((c) => c.from === id || c.to === id);
      if (conns.length > 0) {
        remember();
        const next = connectionsRef.current.filter((c) => c.from !== id && c.to !== id);
        connectionsRef.current = next;
        setConnections(next);
        setToast({ message: "Disconnected wires from node", type: "info" });
      }
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const point = boardPoint(e.clientX, e.clientY);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    const offset = { x: point.x - node.x, y: point.y - node.y };
    dragOffsetRef.current = offset;
    const nextGesture: Gesture = { kind: "drag", id, origin: snapshot() };
    gestureRef.current = nextGesture;
    setGesture(nextGesture);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    applyPointer(e.clientX, e.clientY);
  }, [applyPointer]);

  const handlePointerUp = () => {
    finishGesture();
  };

  // Node Port Drag-to-Connect
  const startPortConnect = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectFromId(nodeId);
    setToast({ message: "Drawing arrow: Click a destination node to complete data link.", type: "info" });
  };

  const endPortConnect = (targetNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectFromId && (connectFromId !== targetNodeId || relationKindOf(relationKind))) {
      makeConnection(connectFromId, targetNodeId);
    }
    setConnectFromId(null);
  };

  function visibleOrigin(type?: string) {
    const view = viewportRef.current;
    const board = boardRef.current;
    const size = nodeSize({ type });
    const previous = nodesRef.current[nodesRef.current.length - 1];
    if (!view || !board) {
      if (!previous) return { x: 80, y: 80 };
      return { x: previous.x, y: previous.y + nodeSize(previous).h + 36 };
    }
    const boardRect = board.getBoundingClientRect();
    const viewRect = view.getBoundingClientRect();
    const scale = zoomRef.current || 1;
    const originX = Math.max(0, (viewRect.left + 40 - boardRect.left) / scale);
    const originY = Math.max(0, (viewRect.top + 48 - boardRect.top) / scale);
    if (!previous) return { x: originX, y: originY };
    const prev = nodeSize(previous);
    const beside = previous.x + prev.w + 120;
    if (viewRect.width >= 700 && beside + size.w < originX + viewRect.width / scale - 16) {
      return { x: beside, y: previous.y };
    }
    return { x: originX, y: previous.y + prev.h + 36 };
  }

  // CRUD: Add Node
  const addNode = (type: NodeType, at?: { x: number; y: number }) => {
    const meta = nodeTypeMeta[type];
    const spot = at ?? visibleOrigin(type);
    const id = freshBoardId(type);
    const size = nodeSize({ type });
    const drawing = isShape(type);
    const uml = umlTool(type);
    const newNode: SystemNode = {
      id,
      type,
      label: type === "uml-hist" ? "H" : meta.name.split("/")[0].trim(),
      x: Math.max(0, spot.x),
      y: Math.max(0, spot.y),
      w: drawing ? size.w : undefined,
      h: drawing ? size.h : undefined,
      z: nodesRef.current.length + 1,
      health: "healthy",
      latency: type === "cache" ? 2 : type === "database" ? 45 : 20,
      capacity: type === "gateway" ? 5000 : 1000,
      rps: drawing ? 0 : 50,
      role: drawing ? "" : meta.desc,
      industryTool: drawing ? "" : meta.tool,
      ...(uml ? {
        stereotype: uml.stereotype ?? "",
        attributes: type === "erd-entity" || type === "erd-weak" ? "PK id" : type === "erd-assoc" ? "PK id\nFK leftId\nFK rightId" : "",
        operations: "",
        visibility: type.startsWith("uml-") ? "public" as const : undefined,
      } : {}),
    };
    remember();
    const next = [...nodesRef.current, newNode];
    nodesRef.current = next;
    setNodes(next);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    if (type === "text") setEditingId(id);
    setToast({ message: `Added ${meta.name}`, type: "success" });
  };

  function addExtensionNode(tool: ExtensionTool) {
    const spot = visibleOrigin(tool.id);
    const id = freshBoardId(tool.id);
    const newNode: SystemNode = {
      id,
      type: tool.id as NodeType,
      label: tool.label,
      x: Math.max(0, spot.x),
      y: Math.max(0, spot.y),
      w: tool.w,
      h: tool.h,
      z: nodesRef.current.length + 1,
      health: "healthy",
      latency: 0,
      capacity: 0,
      rps: 0,
      role: "",
      industryTool: "",
      stereotype: tool.stereotype,
    };
    remember();
    const next = [...nodesRef.current, newNode];
    nodesRef.current = next;
    setNodes(next);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    setToast({ message: `Added ${tool.name}`, type: "success" });
  }

  function applyExtensionPatch(patch: AcceptedPatch) {
    const removed = new Set(patch.deleteNodes);
    let nextNodes = nodesRef.current
      .filter((node) => !removed.has(node.id))
      .map((node) => {
        const change = patch.updateNodes.find((item) => item.id === node.id);
        if (!change) return node;
        return {
          ...node,
          label: change.label ?? node.label,
          x: change.x ?? node.x,
          y: change.y ?? node.y,
          stereotype: change.stereotype ?? node.stereotype,
          attributes: change.attributes ?? node.attributes,
        };
      });
    const keys = new Map<string, string>();
    remember();
    nodesRef.current = nextNodes;
    for (const add of patch.addNodes) {
      const meta = nodeTypeMeta[add.type as NodeType];
      const extension = extensionTools.find((item) => item.id === add.type);
      const uml = umlTool(add.type);
      const drawing = drawnShape(add.type);
      const spot = add.x < 0 || add.y < 0 ? visibleOrigin(add.type) : { x: add.x, y: add.y };
      const id = freshBoardId(add.type);
      if (add.key) keys.set(add.key, id);
      const width = extension?.w ?? uml?.w ?? nodeSize({ type: add.type }).w;
      const height = extension?.h ?? uml?.h ?? nodeSize({ type: add.type }).h;
      const created: SystemNode = {
        id,
        type: add.type as NodeType,
        label: add.label || extension?.label || (meta ? meta.name.split("/")[0].trim() : add.type),
        x: Math.max(0, spot.x),
        y: Math.max(0, spot.y),
        w: drawing ? width : undefined,
        h: drawing ? height : undefined,
        z: nodesRef.current.length + 1,
        health: "healthy",
        latency: add.type === "cache" ? 2 : add.type === "database" ? 45 : drawing ? 0 : 20,
        capacity: add.type === "gateway" ? 5000 : drawing ? 0 : 1000,
        rps: drawing ? 0 : 50,
        role: drawing || !meta ? "" : meta.desc,
        industryTool: drawing || !meta ? "" : meta.tool,
        stereotype: add.stereotype || extension?.stereotype || uml?.stereotype || undefined,
      };
      nextNodes = [...nextNodes, created];
      nodesRef.current = nextNodes;
    }
    const alive = new Set(nextNodes.map((node) => node.id));
    let nextConnections = connectionsRef.current.filter((link) => !patch.deleteConnections.includes(link.id) && alive.has(link.from) && alive.has(link.to));
    for (const add of patch.addConnections) {
      const from = keys.get(add.from) ?? add.from;
      const to = keys.get(add.to) ?? add.to;
      if (!alive.has(from) || !alive.has(to) || from === to) continue;
      const fromNode = nextNodes.find((node) => node.id === from);
      const toNode = nextNodes.find((node) => node.id === to);
      const look = relationLook(add.kind);
      const bothDrawn = fromNode && toNode ? drawnShape(fromNode.type) && drawnShape(toNode.type) : false;
      nextConnections = [...nextConnections, {
        id: freshBoardId("c"),
        from,
        to,
        status: "active" as const,
        protocol: add.label || look?.label || (bothDrawn ? "Link" : "HTTPS / Dataflow"),
        style: wireStyle,
        kind: relationKindOf(add.kind) || undefined,
      }];
    }
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setNodes(nextNodes);
    setConnections(nextConnections);
    const selectedStill = nextNodes.some((node) => node.id === selectedNodeId);
    if (!selectedStill) setSelectedNodeId(nextNodes[nextNodes.length - 1]?.id ?? null);
    setSelectedConnId(null);
    setToast({ message: patch.summary, type: "success" });
  }

  function startResize(id: string, event: React.PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    const node = nodesRef.current.find((item) => item.id === id);
    if (!node) return;
    const size = nodeSize(node);
    const point = boardPoint(event.clientX, event.clientY);
    const nextGesture: Gesture = { kind: "resize", id, x: point.x, y: point.y, w: size.w, h: size.h, origin: snapshot() };
    gestureRef.current = nextGesture;
    setGesture(nextGesture);
  }

  function onBackgroundPointerDown(event: React.PointerEvent) {
    if (toolMode === "pan" || event.button === 1 || event.altKey) {
      const view = viewportRef.current;
      if (!view) return;
      const nextGesture: Gesture = { kind: "pan", x: event.clientX, y: event.clientY, left: view.scrollLeft, top: view.scrollTop };
      gestureRef.current = nextGesture;
      setGesture(nextGesture);
      return;
    }
    if (toolMode === "text") {
      addNode("text", boardPoint(event.clientX, event.clientY));
      return;
    }
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
  }

  // CRUD: Delete Node
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    remember();
    const nextNodes = nodesRef.current.filter((n) => n.id !== selectedNodeId);
    const nextConnections = connectionsRef.current.filter((c) => c.from !== selectedNodeId && c.to !== selectedNodeId);
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setEditingId(null);
    setToast({ message: "Node deleted", type: "info" });
  };

  function deleteSelection() {
    if (selectedNodeId) {
      deleteSelectedNode();
      return;
    }
    if (!selectedConnId) return;
    remember();
    const next = connectionsRef.current.filter((conn) => conn.id !== selectedConnId);
    connectionsRef.current = next;
    setConnections(next);
    setSelectedConnId(null);
    setToast({ message: "Connection removed", type: "info" });
  }

  function duplicateSelected() {
    const source = nodesRef.current.find((node) => node.id === selectedNodeId);
    if (!source) return;
    remember();
    const copy: SystemNode = {
      ...source,
      id: freshBoardId(source.type),
      x: source.x + 28,
      y: source.y + 28,
      z: (source.z ?? 0) + 1,
      label: source.label,
    };
    const next = [...nodesRef.current, copy];
    nodesRef.current = next;
    setNodes(next);
    setSelectedNodeId(copy.id);
  }

  function orderSelected(direction: "front" | "back") {
    if (!selectedNodeId) return;
    remember();
    setNodes((prev) => {
      const levels = prev.map((node) => node.z ?? 0);
      const nextZ = direction === "front" ? Math.max(...levels, 0) + 1 : Math.min(...levels, 0) - 1;
      const next = prev.map((node) => (node.id === selectedNodeId ? { ...node, z: nextZ } : node));
      nodesRef.current = next;
      return next;
    });
  }

  function chooseWire(style: WireStyle) {
    setWireStyle(style);
    if (!selectedConnId) return;
    remember();
    const next = connectionsRef.current.map((conn) => (conn.id === selectedConnId ? { ...conn, style } : conn));
    connectionsRef.current = next;
    setConnections(next);
  }

  function chooseRelation(value: string) {
    const kind = relationKindOf(value);
    setRelationKind(kind);
    if (!selectedConnId) return;
    remember();
    const look = relationLook(kind);
    const next = connectionsRef.current.map((conn) => {
      if (conn.id !== selectedConnId) return conn;
      const stock = !conn.protocol || conn.protocol === "HTTPS / Dataflow" || conn.protocol.startsWith("«");
      return {
        ...conn,
        kind: kind || undefined,
        protocol: stock ? (kind ? look?.label || "" : "HTTPS / Dataflow") : conn.protocol,
      };
    });
    connectionsRef.current = next;
    setConnections(next);
  }

  function updateSelectedConn(patch: Partial<Connection>) {
    if (!selectedConnId) return;
    setConnections((prev) => {
      const next = prev.map((conn) => (conn.id === selectedConnId ? { ...conn, ...patch } : conn));
      connectionsRef.current = next;
      return next;
    });
  }

  function zoomBy(factor: number) {
    setZoom((current) => Math.min(2, Math.max(0.25, Math.round(current * factor * 100) / 100)));
  }

  function fitView() {
    const view = viewportRef.current;
    if (!view) return;
    const ext = boardExtent(nodesRef.current);
    const next = Math.min(1.5, Math.max(0.25, Math.min((view.clientWidth - 32) / ext.w, (view.clientHeight - 32) / ext.h)));
    setZoom(Number.isFinite(next) && next > 0 ? next : 1);
    view.scrollTo({ left: 0, top: 0 });
  }

  // CRUD: Update Node
  const updateSelectedNode = (field: keyof SystemNode, value: unknown) => {
    if (!selectedNodeId) return;
    setNodes((prev) => {
      const next = prev.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n));
      nodesRef.current = next;
      return next;
    });
  };

  // Auto-Fix via AI Guide (Applies recommended architecture)
  const applyRecommendedFix = () => {
    // 1. Remove dangerous direct client-to-db connections
    const cleanConns = connections.filter((link) => !linkIsClientToDatabase(nodes, link));

    let currentNodes = [...nodes];
    const newConns = [...cleanConns];

    // Ensure Auth Guard exists
    let authNode = currentNodes.find((n) => n.type === "auth" || n.type === "gateway");
    if (!authNode) {
      authNode = {
        id: freshBoardId("auth"),
        type: "auth",
        label: "Better Auth Guard",
        x: 250,
        y: 150,
        health: "healthy",
        latency: 8,
        capacity: 2500,
        rps: 80,
        role: "Session Validation & MFA",
        industryTool: "Better Auth / JWT",
      };
      currentNodes.push(authNode);
    }

    // Ensure Compute exists
    let computeNode = currentNodes.find((n) => n.type === "compute");
    if (!computeNode) {
      computeNode = {
        id: freshBoardId("compute"),
        type: "compute",
        label: "App Logic Server",
        x: 470,
        y: 150,
        health: "healthy",
        latency: 25,
        capacity: 1500,
        rps: 80,
        role: "Business Rules Tier",
        industryTool: "Node.js / Express",
      };
      currentNodes.push(computeNode);
    }

    // Restore any down nodes
    currentNodes = currentNodes.map((n) => ({ ...n, health: "healthy" }));

    // Re-wire proper flow
    const clientNode = currentNodes.find((n) => n.type === "client");
    const dbNode = currentNodes.find((n) => n.type === "database");

    if (clientNode && authNode) {
      if (!newConns.some((c) => c.from === clientNode.id && c.to === authNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-1"), from: clientNode.id, to: authNode.id, status: "active", protocol: "HTTPS / TLS" });
      }
    }
    if (authNode && computeNode) {
      if (!newConns.some((c) => c.from === authNode.id && c.to === computeNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-2"), from: authNode.id, to: computeNode.id, status: "active", protocol: "Verified Token" });
      }
    }
    if (computeNode && dbNode) {
      if (!newConns.some((c) => c.from === computeNode.id && c.to === dbNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-3"), from: computeNode.id, to: dbNode.id, status: "active", protocol: "SQL Connection Pool" });
      }
    }

    remember();
    nodesRef.current = currentNodes;
    connectionsRef.current = newConns;
    setConnections(newConns);
    tidyArchitecture(currentNodes, false);
    setToast({ message: "Applied Recommended Architecture: Security boundary and middle tier restored.", type: "success" });
  };

  // Chaos: Simulate Node Outage (Fault Injection)
  const triggerChaos = () => {
    const aliveNodes = nodes.filter((n) => n.health !== "down" && n.type !== "client" && !drawnShape(n.type));
    if (aliveNodes.length === 0) return;
    const target = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
    setNodes((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, health: "down", rps: 0 } : n))
    );
    setToast({ message: `Fault Injection: Offline node ${target.label}`, type: "error" });
  };

  // Chaos: Auto Heal
  const autoHeal = () => {
    setNodes((prev) => prev.map((n) => ({ ...n, health: "healthy", latency: Math.min(n.latency, 35) })));
    setTrafficMultiplier(1);
    setChaosActive(false);
    setToast({ message: "System restored: All components healthy.", type: "success" });
  };

  // CI/CD Simulator
  const runCiPipeline = () => {
    setCiStatus("running");
    setToast({ message: "Running CI Pipeline: Automated Lint, Tests, Secret Scan...", type: "info" });
    setTimeout(() => {
      const willPass = Math.random() > 0.3;
      if (willPass) {
        setCiStatus("passed");
        setToast({ message: "CI/CD Pipeline Green: Deployed to Staging / Canary.", type: "success" });
      } else {
        setCiStatus("failed");
        setToast({ message: "CI/CD Pipeline Red: Test failure blocked merge! Andon cord engaged.", type: "error" });
      }
    }, 1600);
  };

  // Clear Canvas
  const clearCanvas = () => {
    remember();
    nodesRef.current = [];
    connectionsRef.current = [];
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setParticles([]);
    setToast({ message: "Canvas cleared", type: "info" });
  };

  function blankCanvas() {
    remember();
    nodesRef.current = [];
    connectionsRef.current = [];
    setActiveChallenge("freeform");
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setParticles([]);
    setToast({ message: "Blank canvas", type: "info" });
  }

  function currentSheets(name?: string, family?: UmlFamily): DiagramSheet[] {
    return sheetsRef.current.map((sheet) => (
      sheet.id === sheetIdRef.current
        ? { ...sheet, name: name ?? sheet.name, family: family ?? umlFamily, nodes: nodesRef.current, connections: connectionsRef.current }
        : sheet
    ));
  }

  function armRelation(family: UmlFamily) {
    if (family === "dataflow") {
      if (relationKind) setRelationKind("");
      return;
    }
    if (relationKind && !relationsFor(family).some((relation) => relation.id === relationKind)) setRelationKind("");
  }

  function rememberFamily(family: UmlFamily) {
    setUmlFamily(family);
    const saved = currentSheets(undefined, family);
    sheetsRef.current = saved;
    setSheets(saved);
    armRelation(family);
  }

  function chooseLanguage(language: ModelLanguage) {
    const next = language === "uml" && languageOf(umlFamily) === "uml" ? umlFamily : defaultFamily(language);
    if (next === umlFamily) return;
    rememberFamily(next);
  }

  function chooseDiagram(family: UmlFamily) {
    if (languageOf(family) !== "uml" || family === umlFamily) return;
    rememberFamily(family);
  }

  function loadSheet(target: DiagramSheet) {
    nodesRef.current = target.nodes;
    connectionsRef.current = target.connections;
    setNodes(target.nodes);
    setConnections(target.connections);
    setUmlFamily(target.family);
    setActiveChallenge("freeform");
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setParticles([]);
    armRelation(target.family);
  }

  function openSheet(id: string) {
    if (id === sheetIdRef.current) return;
    const saved = currentSheets();
    const target = saved.find((sheet) => sheet.id === id);
    if (!target) return;
    sheetsRef.current = saved;
    setSheets(saved);
    setSheetId(id);
    sheetIdRef.current = id;
    loadSheet(target);
  }

  function newDiagram() {
    const saved = currentSheets();
    const id = freshBoardId("diagram");
    const blank: DiagramSheet = { id, name: `Diagram ${saved.length + 1}`, family: umlFamily, nodes: [], connections: [] };
    const next = [...saved, blank];
    sheetsRef.current = next;
    setSheets(next);
    setSheetId(id);
    sheetIdRef.current = id;
    loadSheet(blank);
  }

  function renameSheet(name: string) {
    const next = currentSheets(name);
    sheetsRef.current = next;
    setSheets(next);
  }

  function openDrawing(file: File) {
    file.text().then((text) => {
      const data = JSON.parse(text) as { nodes?: unknown; connections?: unknown; sheets?: unknown };
      const stored = readStoredProject(data);
      if (!stored) throw new Error("nodes");
      if (Array.isArray(data.sheets)) {
        const parsed: DiagramSheet[] = stored.sheets.map((sheet) => {
          const nextNodes = sheet.nodes.map(readImportedNode).filter((node): node is SystemNode => !!node);
          const ids = new Set(nextNodes.map((node) => node.id));
          return { id: sheet.id, name: sheet.name, family: sheet.family, nodes: nextNodes, connections: readImportedConnections(sheet.connections, ids) };
        });
        const current = parsed.find((sheet) => sheet.id === stored.sheetId) ?? parsed[0];
        remember();
        sheetsRef.current = parsed;
        setSheets(parsed);
        setSheetId(current.id);
        sheetIdRef.current = current.id;
        loadSheet(current);
        setToast({ message: parsed.length === 1 ? "Drawing opened" : `Opened ${parsed.length} diagrams`, type: "success" });
        scheduleCheck(sheetsToModel(parsed), false);
        return;
      }
      const nextNodes = stored.sheets[0].nodes.map(readImportedNode).filter((node): node is SystemNode => !!node);
      const ids = new Set(nextNodes.map((node) => node.id));
      const nextConnections = readImportedConnections(stored.sheets[0].connections, ids);
      remember();
      nodesRef.current = nextNodes;
      connectionsRef.current = nextConnections;
      const saved = currentSheets();
      sheetsRef.current = saved;
      setSheets(saved);
      setActiveChallenge("freeform");
      setNodes(nextNodes);
      setConnections(nextConnections);
      setSelectedNodeId(null);
      setSelectedConnId(null);
      setToast({ message: "Drawing opened", type: "success" });
      scheduleCheck(sheetsToModel(saved), false);
    }).catch(() => setToast({ message: "That file is not a Foundry drawing. Open a JSON file saved from this lab.", type: "error" }));
  }

  function shareProjectPayload() {
    const saved = currentSheets();
    return {
      specVersion: "2.0-keel-foundry" as const,
      sheetId: sheetIdRef.current,
      sheets: saved.map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
        family: sheet.family,
        nodes: sheet.nodes.map(nodeExportRecord),
        connections: sheet.connections.map(connectionExportRecord),
      })),
    };
  }

  function sendShareProject() {
    const room = shareRoomRef.current;
    const channel = shareChannel.current;
    const self = shareClient.current;
    if (!shareOnRef.current || !room || !channel || !self) return;
    const project = shareProjectPayload();
    try {
      if (JSON.stringify(project).length > SHARE_LIMIT) return;
      channel.postMessage({ room, from: self, kind: "project", project });
    } catch {
      // The other tab closed the channel.
    }
  }

  function applySharedProject(project: unknown) {
    const stored = readStoredProject(project);
    if (!stored) return;
    const parsed: DiagramSheet[] = stored.sheets.map((sheet) => {
      const nextNodes = sheet.nodes.map(readImportedNode).filter((node): node is SystemNode => !!node);
      const ids = new Set(nextNodes.map((node) => node.id));
      return { id: sheet.id, name: sheet.name, family: sheet.family, nodes: nextNodes, connections: readImportedConnections(sheet.connections, ids) };
    });
    if (parsed.length === 0) return;
    const current = parsed.find((sheet) => sheet.id === stored.sheetId) ?? parsed[0];
    shareEcho.current = true;
    remember();
    sheetsRef.current = parsed;
    setSheets(parsed);
    setSheetId(current.id);
    sheetIdRef.current = current.id;
    loadSheet(current);
  }

  function changeShareRoom(value: string) {
    setShareRoomName(value);
  }

  function toggleShare() {
    if (shareOn) {
      setShareOn(false);
      setModelNote("Share is off.");
      return;
    }
    const room = shareRoom(shareRoomName);
    if (!room) {
      setShowModeling(true);
      setModelNote("Use a room name such as harbor, then share again.");
      return;
    }
    setShareOn(true);
    setModelNote(`Sharing ${room} in this browser.`);
  }

  useEffect(() => {
    commands.current = { undo, redo, copy: duplicateSelected, remove: deleteSelection };
    paletteRef.current = () => setShowCommands((open) => !open);
    shareApply.current = applySharedProject;
    shareSend.current = sendShareProject;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) commands.current.redo();
        else commands.current.undo();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && key === "y") {
        event.preventDefault();
        commands.current.redo();
        return;
      }
      if (!typing && (event.metaKey || event.ctrlKey) && !event.altKey && key === "k" && !event.shiftKey) {
        event.preventDefault();
        paletteRef.current();
        return;
      }
      if (!typing && (event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey && key === "f") {
        event.preventDefault();
        paletteRef.current();
        return;
      }
      if (typing) return;
      if ((event.metaKey || event.ctrlKey) && key === "d") {
        event.preventDefault();
        commands.current.copy();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        if (!nodesRef.current.length && !connectionsRef.current.length) return;
        event.preventDefault();
        commands.current.remove();
      } else if (event.key === "Escape") {
        setToolMode("select");
        setConnectFromId(null);
        setEditingId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    shareOnRef.current = shareOn;
    const room = shareRoom(shareRoomName);
    shareRoomRef.current = room;
    if (!shareOn || !room || typeof BroadcastChannel === "undefined") return;
    const self = shareClient.current || crypto.randomUUID();
    shareClient.current = self;
    const channel = new BroadcastChannel(SHARE_CHANNEL);
    shareChannel.current = channel;
    // An empty tab must not publish on join. The other tab answers hello with its drawing.
    shareSkip.current = true;
    const onMessage = (event: MessageEvent) => {
      if (!shareOnRef.current || shareRoomRef.current !== room) return;
      const message = readShareMessage(event.data, room, self);
      if (!message) return;
      if (message.kind === "hello") {
        shareSend.current();
        return;
      }
      shareApply.current(message.project);
    };
    channel.addEventListener("message", onMessage);
    try {
      channel.postMessage({ room, from: self, kind: "hello" });
    } catch {
      // The tab closed the channel.
    }
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
      if (shareChannel.current === channel) shareChannel.current = null;
    };
  }, [shareOn, shareRoomName]);

  useEffect(() => {
    if (!shareOn) return;
    if (shareSkip.current) {
      shareSkip.current = false;
      return;
    }
    if (shareEcho.current) {
      shareEcho.current = false;
      return;
    }
    shareSend.current();
  }, [nodes, connections, sheets, umlFamily, sheetId, shareOn, shareRoomName]);

  // Export Topology
  const exportTopology = () => {
    const saved = currentSheets();
    scheduleCheck(sheetsToModel(saved), false);
    const active = saved.find((sheet) => sheet.id === sheetIdRef.current) ?? saved[0];
    const exportedAt = new Date().toISOString();
    const topology = {
      specVersion: "2.0-keel-foundry",
      exportedAt,
      sheetId: active?.id,
      sheets: saved.map((sheet) => ({
        id: sheet.id,
        name: sheet.name,
        family: sheet.family,
        nodes: sheet.nodes.map(nodeExportRecord),
        connections: sheet.connections.map(connectionExportRecord),
      })),
      nodes: (active?.nodes ?? []).map(nodeExportRecord),
      connections: (active?.connections ?? []).map(connectionExportRecord),
    };
    const blob = new Blob([JSON.stringify(topology, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keel-architecture-spec-${exportedAt.slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: saved.length === 1 ? "Architecture topology exported as JSON." : `Exported ${saved.length} diagrams.`, type: "success" });
  };

  const runService = async (action: "run" | "download") => {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({
        action,
        nodes: nodes.map((node) => ({ id: node.id, type: node.type })),
        connections: connections.map((edge) => ({ from: edge.from, to: edge.to })),
      }),
    });
    if (response.status === 401) {
      setToast({ message: "Sign in to run this service.", type: "error" });
      return;
    }
    if (action === "download") {
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { reason?: string } | null;
        setToast({ message: data?.reason || "The service file was not made.", type: "error" });
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "keel-service.zip";
      link.click();
      URL.revokeObjectURL(url);
      setToast({ message: "Service downloaded. Run it with node server.js.", type: "success" });
      return;
    }
    const data = (await response.json().catch(() => null)) as { url?: string; reason?: string } | null;
    if (!response.ok || !data?.url) {
      setToast({ message: data?.reason || "This board cannot run yet.", type: "error" });
      return;
    }
    setToast({ message: data.url, type: "success" });
    window.open(data.url, "_blank", "noopener");
  };

  // Compute live system stats
  const measured = nodes.filter((n) => !drawnShape(n.type));
  const healthyCount = measured.filter((n) => n.health === "healthy").length;
  const availability = measured.length ? Math.round((healthyCount / measured.length) * 100) : 100;
  const avgLatency = measured.length ? Math.round(measured.reduce((acc, n) => acc + (n.health === "down" ? 500 : n.latency), 0) / measured.length) : 0;
  const extent = boardExtent(nodes);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedConn = connections.find((c) => c.id === selectedConnId);
  function shapeGlyph(type: string): UmlGlyph | "" {
    return umlGlyph(type) || extensionTools.find((tool) => tool.id === type)?.glyph || (isExtensionType(type) ? "class" : "");
  }
  function faceMeta(type: string): NodeMeta {
    const known = nodeTypeMeta[type as NodeType];
    if (known) return known;
    const tool = extensionTools.find((item) => item.id === type);
    return { name: tool?.name ?? "Extension", color: "#d4d4d8", Icon: GLYPH_ICON[tool?.glyph ?? "class"], tool: "", desc: tool?.name ?? "Extension" };
  }
  function readDiagram(): DiagramSnapshot {
    return {
      language: languageOf(umlFamily),
      family: umlFamily,
      selectedNodeId,
      nodes: nodesRef.current.map((node) => {
        const size = nodeSize(node);
        return { id: node.id, type: node.type, label: node.label, x: node.x, y: node.y, w: size.w, h: size.h, stereotype: node.stereotype ?? "" };
      }),
      connections: connectionsRef.current.map((link) => ({ id: link.id, from: link.from, to: link.to, kind: link.kind ?? "", label: link.protocol ?? "" })),
    };
  }
  const selectedGlyph = selectedNode ? shapeGlyph(selectedNode.type) : "";
  const currentCh = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];
  const connectSourceNode = nodes.find((n) => n.id === connectFromId);

  function scheduleCheck(source: ModelSheet[], reveal: boolean) {
    const token = checkToken.current + 1;
    checkToken.current = token;
    setModelBusy(true);
    setModelIssues([]);
    setModelNote("Checking this sheet…");
    if (reveal) setShowModeling(true);
    queueMicrotask(() => {
      if (checkToken.current !== token) return;
      const issues = checkModel(source);
      setModelIssues(issues);
      setModelBusy(false);
      setModelNote(issues.length === 0 ? "Checked. No notes." : issues.length === 1 ? "1 note." : `${issues.length} notes.`);
      if (issues.length > 0) setShowModeling(true);
    });
  }

  function choosePage(value: "a4" | "letter") {
    setPrintPage(value);
    chooseFoundryPage(value);
  }

  function printSheet() {
    chooseFoundryPage(printPage);
    window.print();
  }

  function activeModel() {
    const model = sheetsToModel(currentSheets());
    return model.find((sheet) => sheet.id === sheetIdRef.current) ?? model[0];
  }

  function writeSketch(language: SketchLanguage) {
    setCodeLanguage(language);
    const text = sketchModel(sheetsToModel(currentSheets()), language);
    setSketchText(text);
    setDeskLines([]);
    setLooseShapes([]);
    setShowModeling(true);
    downloadText(`keel-foundry.${sketchFileExtension(language)}`, text, "text/plain;charset=utf-8");
  }

  function showRelationships() {
    const sheet = activeModel();
    setDeskLines(sheet && selectedNodeId ? relationshipLines(sheet, selectedNodeId) : ["Select a shape, then look at its lines again."]);
    setLooseShapes([]);
    setSketchText("");
    setShowModeling(true);
  }

  function showUnconnected() {
    const sheet = activeModel();
    const loose = sheet ? unconnectedNodes(sheet) : [];
    setLooseShapes(loose);
    setDeskLines(loose.length ? [] : ["Every shape on this sheet has a line."]);
    setSketchText("");
    setShowModeling(true);
  }

  function removeLoose(id: string) {
    const node = nodesRef.current.find((item) => item.id === id);
    if (!node) return;
    remember();
    const nextNodes = nodesRef.current.filter((item) => item.id !== id);
    const nextConnections = connectionsRef.current.filter((link) => link.from !== id && link.to !== id);
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setNodes(nextNodes);
    setConnections(nextConnections);
    if (selectedNodeId === id) setSelectedNodeId(null);
    setLooseShapes((current) => current.filter((item) => item.id !== id));
    setToast({ message: `${node.label.trim() || node.type} was removed.`, type: "info" });
  }

  function copyShapeName() {
    const node = nodesRef.current.find((item) => item.id === selectedNodeId);
    if (!node) {
      setToast({ message: "Select a shape, then copy the name again.", type: "error" });
      return;
    }
    const name = node.label.trim() || node.type;
    const clip = navigator.clipboard;
    if (clip?.writeText) void clip.writeText(name).catch(() => {});
    setToast({ message: name, type: "success" });
  }

  function publishNotes() {
    const model = sheetsToModel(currentSheets());
    const active = model.find((sheet) => sheet.id === sheetIdRef.current) ?? model[0];
    downloadText("keel-foundry-notes.html", htmlNotes(model, active?.name || "Foundry notes"), "text/html;charset=utf-8");
    setShowModeling(true);
  }

  function publishSvg() {
    const model = sheetsToModel(currentSheets());
    const active = model.find((sheet) => sheet.id === sheetIdRef.current) ?? model[0];
    if (!active) return;
    downloadText("keel-foundry-diagram.svg", diagramSvg(active), "image/svg+xml");
    setShowModeling(true);
  }

  function checkSheet() {
    scheduleCheck(sheetsToModel(currentSheets()), true);
  }

  function placeScreenFromDesk() {
    const drawn = wireframeScreen(readDiagram());
    if (drawn.patch.addNodes.length === 0) {
      setToast({ message: drawn.patch.summary || "The desk could not place that screen. Clear a little space and try again.", type: "error" });
      return;
    }
    rememberFamily("wireframe");
    applyExtensionPatch(drawn.patch);
    setSketchWire(true);
  }

  function focusShape(id: string) {
    setSelectedNodeId(id);
    setSelectedConnId(null);
    const node = nodesRef.current.find((item) => item.id === id);
    const view = viewportRef.current;
    if (!node || !view) return;
    const scale = zoomRef.current || 1;
    view.scrollTo({ left: Math.max(0, node.x * scale - 48), top: Math.max(0, node.y * scale - 48) });
  }

  const deskCommands: DeskCommand[] = [
    { id: "undo", label: "Undo", run: undo },
    { id: "redo", label: "Redo", run: redo },
    { id: "blank", label: "Blank canvas", run: blankCanvas },
    { id: "fit", label: "Fit", run: fitView },
    { id: "check", label: "Check sheet", run: checkSheet },
    { id: "screen", label: "Place a screen", run: placeScreenFromDesk },
    { id: "mermaid", label: "Open Mermaid", run: () => setShowMermaid(true) },
    { id: "export", label: "Export JSON", run: exportTopology },
    { id: "java", label: "Sketch Java", run: () => writeSketch("java") },
    { id: "cs", label: "Sketch C#", run: () => writeSketch("cs") },
    { id: "cpp", label: "Sketch C++", run: () => writeSketch("cpp") },
    { id: "py", label: "Sketch Python", run: () => writeSketch("py") },
    { id: "html", label: "HTML notes", run: publishNotes },
    { id: "print", label: "Print", run: printSheet },
    { id: "light", label: "Light theme", run: () => chooseFoundryTheme("light") },
    { id: "dark", label: "Dark theme", run: () => chooseFoundryTheme("dark") },
    { id: "lines", label: "Relationships", run: showRelationships },
    { id: "loose", label: "Unconnected", run: showUnconnected },
    { id: "copy-name", label: "Copy name", run: copyShapeName },
    { id: "php", label: "Sketch PHP", run: () => writeSketch("php") },
    { id: "js", label: "Sketch JavaScript", run: () => writeSketch("js") },
    { id: "ts", label: "Sketch TypeScript", run: () => writeSketch("ts") },
    { id: "ruby", label: "Sketch Ruby", run: () => writeSketch("ruby") },
    { id: "sql", label: "Sketch SQL", run: () => writeSketch("sql") },
    { id: "graphql", label: "Sketch GraphQL", run: () => writeSketch("graphql") },
    ...extensionCommands.map((command) => ({
      id: `${command.extensionId}-${command.index}`,
      label: command.name,
      run: () => extensionRun.current(command),
    })),
  ];

  const lab = (
    <div data-foundry-root="" data-foundry-page={printPage} className={fullPage ? "fixed inset-0 z-40 flex flex-col overflow-hidden bg-paper" : "mx-auto max-w-7xl px-4 py-8"}>
      <FoundryCommands
        key={showCommands ? "commands-open" : "commands-shut"}
        open={showCommands}
        commands={deskCommands}
        shapes={nodes.map((node) => ({ id: node.id, label: node.label || node.type }))}
        diagrams={sheets.map((sheet) => ({ id: sheet.id, label: sheet.name }))}
        onClose={() => setShowCommands(false)}
        onShape={focusShape}
        onDiagram={openSheet}
      />
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="foundry-print-hide fixed bottom-24 right-6 z-[60] flex items-center gap-3 rounded-lg border border-line bg-raised px-4 py-3 shadow-xl transition-all"
        >
          <span className="text-base font-bold">
            {toast.type === "success" ? <IconCheck size={16} className="text-good" /> : toast.type === "error" ? <IconChaos size={16} className="text-danger" /> : <IconArchitect size={16} className="text-copper" />}
          </span>
          <span className="text-xs font-semibold text-ink">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ms-3 text-soft hover:text-ink flex items-center justify-center"
            aria-label="Dismiss notification"
          >
            <IconClose size={12} />
          </button>
        </div>
      )}

      {/* Header & Academic Lineage */}
      <section className={fullPage ? "foundry-print-hide shrink-0 border-b border-line bg-paper px-3 py-2" : "foundry-print-hide rounded-xl border border-line bg-raised p-5 shadow-xs"}>
        {!fullPage && (<>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">DevOps & Systems Engineering Foundry</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Systems Architecture & Dataflow Lab
            </h1>
            <p className="mt-1 text-sm text-soft">
              Interactive 2D/3D visual architecture simulator with live directional dataflow, entity relations, full CRUD, and an AI Architect Tutor.
            </p>
            <p className="mt-2"><Link className="text-sm underline" href="/foundry/pipeline">{m.pipeline}</Link></p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-soft font-semibold">Gained Experience:</span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-sm font-bold text-copper shadow-xs">
              <IconXP size={13} className="text-copper" /> {xp} XP
            </span>
            <span className="rounded-full border border-good/30 bg-good/10 px-3 py-1 text-xs font-semibold text-good">
              {solvedChallenges.length}/5 Missions Complete
            </span>
          </div>
        </div>

        {/* Visual Lineage Prerequisites */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 1</span>
            <h3 className="text-xs font-bold text-ink">CSC2031 — Security Programming</h3>
            <p className="mt-1 text-xs text-soft">RBAC, JWT tokens, WAF shields, encryption boundaries.</p>
          </div>

          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 2</span>
            <h3 className="text-xs font-bold text-ink">CSC2035 — Systems Design</h3>
            <p className="mt-1 text-xs text-soft">3-Tier architecture, Redis caches, read-replicas, decoupling.</p>
          </div>

          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 3</span>
            <h3 className="text-xs font-bold text-ink">CSC2033 — Team Project</h3>
            <p className="mt-1 text-xs text-soft">CI/CD pipelines, automated testing, merge gates, git flow.</p>
          </div>

          <div className="rounded-lg border-2 border-copper bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs text-copper font-bold">Capstone Foundry</span>
            <h3 className="text-xs font-bold text-ink">CSC3131 — DevOps & Operations</h3>
            <p className="mt-1 text-xs text-soft">Observability, MTTD/MTTR, SLA/SLO, chaos recovery.</p>
          </div>
        </div>
        </>)}

        {/* Missions Selector */}
        <div className={`${fullPage ? "flex max-h-14 shrink-0 flex-nowrap items-center gap-2 overflow-x-auto md:max-h-none md:flex-wrap md:overflow-visible" : "mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4"}`}>
          {fullPage && <h1 className="text-sm font-bold text-ink">Foundry</h1>}
          <span className="text-xs font-bold text-soft uppercase tracking-wider">Missions:</span>
          {CHALLENGES.map((ch) => {
            const isSolved = solvedChallenges.includes(ch.id);
            const isActive = activeChallenge === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => selectChallenge(ch.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                  isActive
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper hover:bg-raised"
                }`}
              >
                <span>{ch.badge}</span>
                <span>{ch.title.split(":")[1]?.trim() || ch.title}</span>
                {isSolved && <IconCheck size={14} className="text-good font-bold" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mission Objective Bar */}
      {!fullPage && <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-raised px-4 py-3 text-sm shadow-xs">
        <div className="flex items-center gap-3">
          <span className="rounded bg-paper border border-line px-2 py-0.5 text-xs font-mono font-bold text-copper">
            {currentCh.badge}
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">{currentCh.title}</h2>
            <p className="text-xs text-soft mt-0.5">{currentCh.goal}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-soft">Need guidance?</span>
          <button
            onClick={() => setShowAiGuide((prev) => !prev)}
            className="rounded border border-line bg-paper px-2.5 py-1 text-xs font-bold text-ink hover:border-copper transition-colors shadow-xs flex items-center gap-1.5"
          >
            <IconArchitect size={15} className="text-copper" />
            <span>{showAiGuide ? "Hide AI Architect" : "Show AI Architect"}</span>
          </button>
        </div>
      </div>}

      {/* Main Studio Area */}
      <div className={fullPage ? "relative flex min-h-0 flex-1 flex-col" : "relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4"}>
        {/* Left Sidebar: Component Palette & Control Panel */}
        <div className={fullPage ? (showRail ? "foundry-print-hide absolute start-3 top-16 z-30 max-h-[calc(100%-5rem)] w-72 space-y-4 overflow-auto" : "hidden") : "foundry-print-hide space-y-4 lg:col-span-1"}>
          {/* Architecture Toolbox with Premium Vector Icons */}
          <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Architecture Toolbox</h2>
            <p className="mt-1 text-xs text-soft">Click to spawn enterprise nodes into the canvas.</p>
            <div className="mt-3 space-y-1.5">
              {SERVICE_TYPES.map((type) => {
                const meta = nodeTypeMeta[type];
                const NodeIcon = meta.Icon;
                return (
                  <button
                    key={type}
                    onClick={() => addNode(type)}
                    className="flex w-full items-center justify-between rounded-lg border border-line bg-paper px-3 py-2 text-left text-xs font-medium text-ink transition-all hover:border-copper hover:bg-raised shadow-xs group"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-copper group-hover:scale-110 transition-transform">
                        <NodeIcon size={18} />
                      </span>
                      <span className="font-semibold">{meta.name.split("/")[0]}</span>
                    </span>
                    <span className="font-mono text-[10px] text-soft">{meta.tool.split("/")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry HUD */}
          <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Live Telemetry HUD</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Availability</span>
                <p className={`text-lg font-mono font-bold mt-0.5 ${availability >= 90 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {availability}%
                </p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Avg Latency</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">
                  {avgLatency}<span className="text-xs font-normal text-soft ms-0.5">ms</span>
                </p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Active Nodes</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">{nodes.length}</p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Traffic Load</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">{trafficMultiplier}x <span className="text-xs font-normal text-soft">RPS</span></p>
              </div>
            </div>

            {/* High-Contrast Fault & Operational Testing Controls with Enterprise Vector Icons */}
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-ink">Fault Injection & Simulation</h3>
            <div className="mt-2.5 space-y-2">
              <button
                onClick={() => setTrafficMultiplier((prev) => (prev >= 4 ? 1 : prev + 1))}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconSurge size={16} className="text-ink" />
                  <span>Traffic Surge</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">
                  {trafficMultiplier}x LOAD
                </span>
              </button>

              <button
                onClick={triggerChaos}
                className="w-full rounded-lg border border-red-300 dark:border-red-800 bg-paper px-3 py-2 text-xs text-left font-bold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconChaos size={16} className="text-red-700 dark:text-red-400" />
                  <span>Fault Injection: Outage</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                  INJECT
                </span>
              </button>

              <button
                onClick={runCiPipeline}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconCI size={16} className="text-ink" />
                  <span>Trigger CI Pipeline</span>
                </span>
                <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  ciStatus === "passed"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : ciStatus === "failed"
                      ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                      : "bg-raised text-ink border-line"
                }`}>
                  {ciStatus}
                </span>
              </button>

              <button
                onClick={autoHeal}
                className="w-full rounded-lg border border-emerald-300 dark:border-emerald-800 bg-paper px-3 py-2 text-xs text-left font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconAutoHeal size={16} className="text-emerald-700 dark:text-emerald-400" />
                  <span>Auto-Heal & Restore</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  RESTORE
                </span>
              </button>

              <button
                onClick={exportTopology}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconExport size={16} className="text-ink" />
                  <span>Export Architecture Spec</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">
                  JSON
                </span>
              </button>

              <button
                onClick={() => void runService("run")}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconPlay size={16} className="text-ink" />
                  <span>Run this service</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">LIVE</span>
              </button>

              <button
                onClick={() => void runService("download")}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconExport size={16} className="text-ink" />
                  <span>Download the service</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">ZIP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Canvas & Toolbar */}
        <div className={fullPage ? "flex min-h-0 flex-1 flex-col gap-2 p-2" : "flex flex-col gap-4 lg:col-span-3"}>
          <div className="foundry-print-hide flex shrink-0 gap-1 overflow-x-auto rounded-xl border border-line bg-raised px-2 py-1.5" aria-label="Modeling language">
            {MODEL_LANGUAGES.map((language) => {
              const current = languageOf(umlFamily) === language.id;
              return (
                <button
                  key={language.id}
                  type="button"
                  aria-pressed={current}
                  onClick={() => chooseLanguage(language.id)}
                  className={`flex min-h-11 min-w-16 shrink-0 flex-col items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-semibold leading-none ${current ? "text-copper" : "text-soft hover:text-ink"}`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-paper ${current ? "border-copper text-copper" : "border-transparent text-ink"}`}>
                    <LanguageIcon id={language.id} />
                  </span>
                  <span className="whitespace-nowrap">{language.name}</span>
                </button>
              );
            })}
          </div>
          {/* Canvas Enterprise Toolbar with Precision Vector Icons */}
          <div className={`foundry-print-hide flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-raised px-3 py-2 shadow-xs ${fullPage ? "max-h-40 overflow-y-auto md:max-h-64" : ""}`}>
            {/* Interactive Modes */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { setToolMode("select"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "select"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <IconPointer size={15} />
                <span>Select / Move</span>
              </button>

              <button
                onClick={() => { setToolMode("connect"); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "connect" || connectFromId
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <IconConnect size={15} />
                <span>Connect Arrow</span>
              </button>

              <button
                onClick={() => { setToolMode("disconnect"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "disconnect"
                    ? "border-danger bg-danger text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-danger hover:text-danger"
                }`}
              >
                <IconCut size={15} />
                <span>Cut Wire</span>
              </button>

              <button
                type="button"
                onClick={() => { setToolMode("pan"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "pan"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <span>Hand</span>
              </button>

              <button
                type="button"
                onClick={() => { setToolMode("text"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "text"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <span>Text</span>
              </button>

              {DRAW_TYPES.filter((type) => type !== "text").map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addNode(type)}
                  className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper"
                >
                  {nodeTypeMeta[type].name}
                </button>
              ))}

              {languageOf(umlFamily) === "uml" ? (
                <>
                  <label className="sr-only" htmlFor="uml-diagram">UML diagram</label>
                  <select
                    id="uml-diagram"
                    aria-label="UML diagram"
                    value={umlFamily}
                    onChange={(e) => chooseDiagram(e.target.value as UmlFamily)}
                    className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink"
                  >
                    {diagramsFor("uml").map((family) => (
                      <option key={family.id} value={family.id}>{family.name}</option>
                    ))}
                  </select>
                </>
              ) : null}
              <div className="flex max-w-full flex-wrap items-end gap-2" aria-label="Toolbox">
                {toolboxFor(umlFamily).map((group) => (
                  <div key={group.name} className="flex flex-wrap items-center gap-1">
                    <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-soft">{group.name}</span>
                    {group.entries.map((entry) => {
                      const armed = selectedConn ? relationKindOf(selectedConn.kind) : relationKind;
                      const pressed = entry.kind === "relation" ? armed === entry.id : entry.kind === "wire" ? armed === "" : false;
                      return (
                        <button
                          key={entryKey(entry)}
                          type="button"
                          aria-pressed={entry.kind === "relation" || entry.kind === "wire" ? pressed : undefined}
                          onClick={() => {
                            if (entry.kind === "node" || entry.kind === "service") addNode(entry.type);
                            else if (entry.kind === "relation") chooseRelation(entry.id);
                            else chooseRelation("");
                          }}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${pressed ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink hover:border-copper"}`}
                        >
                          {entry.name}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {extensionTools.some((tool) => toolVisible(tool, languageOf(umlFamily), umlFamily)) ? (
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="px-1 text-[10px] font-bold uppercase tracking-wider text-soft">Extension</span>
                    {extensionTools.filter((tool) => toolVisible(tool, languageOf(umlFamily), umlFamily)).map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => addExtensionNode(tool)}
                        className="min-h-11 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper"
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <label className="sr-only" htmlFor="uml-relation">UML relation</label>
              <select
                id="uml-relation"
                aria-label="UML relation"
                value={selectedConn ? relationKindOf(selectedConn.kind) : relationKind}
                onChange={(e) => chooseRelation(e.target.value)}
                className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink"
              >
                <option value="">Plain wire</option>
                <optgroup label={UML_FAMILIES.find((family) => family.id === umlFamily)?.name ?? "UML"}>
                  {relationsFor(umlFamily).map((relation) => (
                    <option key={relation.id} value={relation.id}>{relation.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Every relation">
                  {UML_RELATIONS.filter((relation) => !relation.families.includes(umlFamily)).map((relation) => (
                    <option key={relation.id} value={relation.id}>{relation.name}</option>
                  ))}
                </optgroup>
              </select>

              <button type="button" onClick={undo} disabled={!canUndo} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40">Undo</button>
              <button type="button" onClick={redo} disabled={!canRedo} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40">Redo</button>
              <button type="button" onClick={duplicateSelected} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Copy</button>
              <button type="button" onClick={deleteSelection} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-danger hover:text-danger">Delete</button>
              <button type="button" aria-pressed={snap} onClick={() => setSnap((value) => !value)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${snap ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Snap</button>
              <button type="button" onClick={() => orderSelected("front")} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Front</button>
              <button type="button" onClick={() => orderSelected("back")} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Back</button>
              <label className="sr-only" htmlFor="wire-style">Connector style</label>
              <select id="wire-style" aria-label="Connector style" value={selectedConn ? wireStyleOf(selectedConn.style) : wireStyle} onChange={(e) => chooseWire(e.target.value as WireStyle)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink">
                <option value="curve">Curve</option>
                <option value="elbow">Elbow</option>
                <option value="straight">Straight</option>
              </select>
              <button type="button" onClick={() => zoomBy(1 / 0.9)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink" aria-label="Zoom in">+</button>
              <button type="button" onClick={() => setZoom(1)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => zoomBy(0.9)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink" aria-label="Zoom out">−</button>
              <button type="button" onClick={fitView} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Fit</button>

              <button
                onClick={() => tidyArchitecture()}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-copper transition-all shadow-xs"
                title="Automatically organize nodes into clean, non-overlapping architectural tiers"
              >
                <IconAutoLayout size={15} />
                <span>Auto-Layout</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2" aria-label="Working diagrams">
              {sheets.map((sheet) => {
                const drawn = sheet.id === sheetId ? nodes : sheet.nodes;
                const ext = boardExtent(drawn);
                return (
                  <button
                    key={sheet.id}
                    type="button"
                    aria-current={sheet.id === sheetId ? "true" : undefined}
                    onClick={() => openSheet(sheet.id)}
                    className={`flex w-28 flex-col gap-1 rounded-lg border p-1 text-left ${sheet.id === sheetId ? "border-copper" : "border-line"}`}
                  >
                    <span className="relative h-10 w-full overflow-hidden rounded bg-zinc-900" aria-hidden="true">
                      {drawn.slice(0, 8).map((node) => (
                        <span
                          key={node.id}
                          className="absolute bg-zinc-300"
                          style={{ left: `${(node.x / ext.w) * 80}%`, top: `${(node.y / ext.h) * 70}%`, width: 8, height: 5 }}
                        />
                      ))}
                    </span>
                    <span className="truncate text-[10px] font-semibold text-ink">{sheet.name}</span>
                    <span className="truncate text-[10px] text-soft">{languageLabel(sheet.id === sheetId ? umlFamily : sheet.family)}</span>
                  </button>
                );
              })}
              <button type="button" onClick={newDiagram} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">New diagram</button>
              <label className="sr-only" htmlFor="diagram-name">Diagram name</label>
              <input
                id="diagram-name"
                value={sheets.find((sheet) => sheet.id === sheetId)?.name ?? ""}
                onChange={(event) => renameSheet(event.target.value)}
                className="w-36 rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink"
              />
              <button type="button" aria-pressed={showExplorer} onClick={() => setShowExplorer((open) => !open)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showExplorer ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Model explorer</button>
              <button type="button" aria-pressed={showExtensions} onClick={() => setShowExtensions((open) => !open)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showExtensions ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Extensions</button>
              <button type="button" aria-pressed={showAi} onClick={() => setShowAi((open) => !open)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showAi ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>AI desk</button>
              <button type="button" aria-pressed={showMermaid} onClick={() => setShowMermaid((open) => !open)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showMermaid ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Mermaid</button>
              {languageOf(umlFamily) === "wireframe" ? (
                <button type="button" aria-pressed={sketchWire} onClick={() => setSketchWire((on) => !on)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${sketchWire ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Sketch</button>
              ) : null}
              <button type="button" aria-pressed={showCommands} onClick={() => setShowCommands((open) => !open)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showCommands ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Commands</button>
              <button type="button" aria-pressed={showModeling} onClick={() => setShowModeling((open) => !open)} className={`min-h-11 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${showModeling ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Modeling</button>
              <Link href="/foundry/guide" className="inline-flex min-h-11 items-center rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Guide</Link>
              <Link href="/foundry/help" className="inline-flex min-h-11 items-center rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Help</Link>
            </div>

            {/* Template Selector Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="add-part" className="sr-only">Add a part</label>
              <select
                id="add-part"
                aria-label="Add a part"
                value=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  addNode(e.target.value as NodeType);
                }}
                className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink shadow-xs"
              >
                <option value="">Add a part</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>{nodeTypeMeta[type].name.split("/")[0]}</option>
                ))}
              </select>
              <label htmlFor="tpl-select" className="text-xs font-bold text-soft uppercase tracking-wider hidden sm:inline">
                Template:
              </label>
              <select
                id="tpl-select"
                onChange={(e) => { if (e.target.value) loadTemplate(e.target.value); }}
                defaultValue=""
                className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink shadow-xs"
              >
                <option value="" disabled>Load Demo Practice Template...</option>
                {DEMO_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-medium text-soft hover:text-danger hover:border-danger transition-colors"
                title="Clear all canvas nodes"
              >
                <IconClear size={14} />
                <span>Clear</span>
              </button>
              <button type="button" onClick={blankCanvas} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Blank canvas</button>
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Open</button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                aria-label="Open a Foundry drawing"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) openDrawing(file);
                }}
              />
              {fullPage && (
                <button type="button" onClick={() => setShowRail((value) => !value)} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper" aria-pressed={showRail}>Parts</button>
              )}
              <button type="button" onClick={() => { setFullPage((value) => !value); setShowRail(false); }} className="rounded-lg border border-copper bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-copper hover:text-raised">
                {fullPage ? "Exit full page" : "Full page"}
              </button>
            </div>
          </div>

          {/* Mode Banner / Live Drawing Guide */}
          {(connectFromId || toolMode === "connect" || toolMode === "disconnect") && (
            <div className={`foundry-print-hide flex items-center justify-between rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs ${
              toolMode === "disconnect"
                ? "border-danger/40 bg-danger/10 text-danger"
                : "border-copper/40 bg-copper/10 text-copper"
            }`}>
              <span className="flex items-center gap-2">
                {toolMode === "disconnect" ? (
                  <>
                    <IconCut size={16} />
                    <span>Wire Cutter Active: Click any connection wire (or node) to disconnect it.</span>
                  </>
                ) : connectFromId ? (
                  <>
                    <IconConnect size={16} />
                    <span>Drawing Arrow: Click target node to link from &apos;{connectSourceNode?.label}&apos; with directional arrow.</span>
                  </>
                ) : (
                  <>
                    <IconConnect size={16} />
                    <span>Connect Arrow Active: Click any source node to begin drawing a data link.</span>
                  </>
                )}
              </span>
              <button
                onClick={() => { setToolMode("select"); setConnectFromId(null); }}
                className="underline hover:opacity-80 font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          <FoundryExtensions
            open={showExtensions}
            readDiagram={readDiagram}
            applyPatch={applyExtensionPatch}
            onTools={setExtensionTools}
            onCommands={setExtensionCommands}
            runExtensionRef={extensionRun}
          />
          <FoundryAi open={showAi} readDiagram={readDiagram} applyPatch={applyExtensionPatch} />
          <FoundryMermaid open={showMermaid} readDiagram={readDiagram} applyPatch={applyExtensionPatch} onFamily={rememberFamily} />
          <FoundryModeling
            open={showModeling}
            busy={modelBusy}
            note={modelNote}
            issues={modelIssues}
            language={codeLanguage}
            onLanguage={setCodeLanguage}
            page={printPage}
            onPage={choosePage}
            theme={canvasTheme}
            onTheme={chooseFoundryTheme}
            sketch={sketchText}
            lines={deskLines}
            loose={looseShapes}
            onRemove={removeLoose}
            room={shareRoomName}
            sharing={shareOn}
            onRoom={changeShareRoom}
            onShare={toggleShare}
            onCheck={checkSheet}
            onSketch={() => writeSketch(codeLanguage)}
            onHtml={publishNotes}
            onSvg={publishSvg}
            onPrint={printSheet}
          />

          {/* Interactive canvas. The frame stays on screen. The board inside it scrolls and grows. */}
          <div data-foundry-theme={canvasTheme} className={`foundry-canvas relative w-full rounded-xl border border-zinc-700 bg-zinc-950 shadow-inner ${fullPage ? "min-h-32 flex-1" : "h-[calc(100dvh-9rem)] min-h-[36rem]"}`}>
            {/* Canvas Header Legend & Speed / Flow Controls */}
            <div className="absolute left-3 top-3 z-30 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/75 px-3 py-1.5 backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full ${flowPaused || selectedParticle ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
              <span className="text-xs font-mono text-zinc-200 font-semibold">
                {flowPaused || selectedParticle ? "Flow Frozen" : "Live Dataflow"}
              </span>

              {/* Play / Freeze Flow Toggle */}
              <button
                onClick={() => {
                  setFlowPaused((prev) => !prev);
                  if (selectedParticle) setSelectedParticle(null);
                }}
                className="flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 text-[11px] font-mono font-bold text-zinc-200 transition-colors"
                title={flowPaused ? "Resume flow" : "Pause flow to inspect behavior"}
              >
                {flowPaused ? <IconPlay size={11} className="text-emerald-400" /> : <IconPause size={11} className="text-amber-400" />}
                <span>{flowPaused ? "Resume" : "Freeze"}</span>
              </button>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 rounded bg-zinc-900/90 px-1 py-0.5 border border-zinc-700/60">
                {([0.25, 0.5, 1, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => { setFlowSpeed(spd); setFlowPaused(false); }}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      flowSpeed === spd && !flowPaused
                        ? "bg-copper text-zinc-100 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Live Graphs & Analytics Toggle */}
              <button
                onClick={() => setShowAnalyticsDrawer((prev) => !prev)}
                className={`flex items-center gap-1 rounded px-2.5 py-0.5 text-[11px] font-mono font-semibold transition-all ${
                  showAnalyticsDrawer
                    ? "bg-copper text-raised border border-copper"
                    : "bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-700"
                }`}
                title="Toggle In-Lab Live Telemetry & Architecture Graphs"
              >
                <IconAnalytics size={12} />
                <span>Live Graphs</span>
              </button>
            </div>

            <div
              ref={viewportRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute inset-0 z-0 overflow-auto ${toolMode === "pan" ? "cursor-grab" : ""}`}
            >
              <div style={{ width: extent.w * zoom, height: extent.h * zoom }}>
                <div
                  ref={boardRef}
                  className="foundry-board relative"
                  style={{
                    width: extent.w,
                    height: extent.h,
                    transform: `scale(${zoom})`,
                    transformOrigin: "0 0",
                    backgroundImage: canvasTheme === "light"
                      ? "radial-gradient(circle at 1px 1px, rgba(28,25,22,0.12) 1px, transparent 0)"
                      : "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                >

            {showExplorer ? (
              <aside aria-label="Model explorer" className="absolute end-2 top-2 z-30 max-h-64 w-52 overflow-auto rounded-lg border border-line bg-paper p-2 text-ink shadow-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-soft">Model explorer</p>
                {nodes.length === 0 ? <p className="mt-2 text-xs text-soft">This diagram is empty.</p> : null}
                <ul className="mt-1">
                  {nodes.map((node) => (
                    <li key={node.id}>
                      <button
                        type="button"
                        onClick={() => { setSelectedNodeId(node.id); setSelectedConnId(null); }}
                        className={`block w-full truncate rounded px-1 py-1 text-left text-xs ${selectedNodeId === node.id ? "bg-copper text-raised" : "hover:bg-raised"}`}
                      >
                        {faceMeta(node.type).name}: {node.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {/* SVG Directional Connections Layer */}
            <svg className="absolute inset-0 h-full w-full pointer-events-auto">
              <rect width="100%" height="100%" fill="transparent" onPointerDown={onBackgroundPointerDown} />
              <defs>
                {/* Directional Arrowheads */}
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="arrow-error"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="arrow-temp"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#d08968" />
                </marker>
                <marker id="uml-open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto">
                  <path d="M 1 1.5 L 11 6 L 1 10.5" fill="none" stroke="#e4e4e7" strokeWidth="1.4" />
                </marker>
                <marker id="uml-arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto">
                  <path d="M 0 1 L 12 6 L 0 11 Z" fill="#e4e4e7" />
                </marker>
                <marker id="uml-triangle" viewBox="0 0 14 12" refX="13" refY="6" markerWidth="14" markerHeight="12" orient="auto">
                  <path d="M 1 1 L 13 6 L 1 11 Z" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.2" />
                </marker>
                <marker id="uml-ball" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" orient="auto">
                  <circle cx="6" cy="6" r="4" fill="#e4e4e7" />
                </marker>
                <marker id="uml-diamond" viewBox="0 0 16 12" refX="0" refY="6" markerWidth="16" markerHeight="12" orient="auto">
                  <path d="M 0 6 L 8 1 L 16 6 L 8 11 Z" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.2" />
                </marker>
                <marker id="uml-diamond-filled" viewBox="0 0 16 12" refX="0" refY="6" markerWidth="16" markerHeight="12" orient="auto">
                  <path d="M 0 6 L 8 1 L 16 6 L 8 11 Z" fill="#e4e4e7" />
                </marker>
                <marker id="uml-plus" viewBox="0 0 14 14" refX="7" refY="7" markerWidth="14" markerHeight="14" orient="0">
                  <circle cx="7" cy="7" r="5.5" fill="#09090b" stroke="#e4e4e7" strokeWidth="1.2" />
                  <path d="M 7 3.5 V 10.5 M 3.5 7 H 10.5" stroke="#e4e4e7" strokeWidth="1.2" />
                </marker>

                <linearGradient id="activeWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="errorWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Render Connections */}
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromPort = anchors(fromNode).out;
                const toPort = anchors(toNode).inn;
                const self = fromNode.id === toNode.id;
                const x1 = fromPort.x;
                const y1 = fromPort.y;
                const x2 = toPort.x;
                const y2 = toPort.y;
                const isError = conn.status === "error" || fromNode.health === "down" || toNode.health === "down";
                const isSelected = selectedConnId === conn.id;
                const style = wireStyleOf(conn.style);
                const pathD = self ? loopPath(x1, y1) : wirePath(x1, y1, x2, y2, style);
                const look = relationLook(conn.kind);
                const markerEnd = !look ? (isError ? "url(#arrow-error)" : "url(#arrow-active)") : look.end === "none" ? undefined : `url(#uml-${look.end})`;
                const markerStart = look && look.start !== "none" ? `url(#uml-${look.start})` : undefined;
                const mid = self ? { x: x1 + 48, y: y1 + 8 } : pointOnWire(x1, y1, x2, y2, 0.5, style);
                const nearStart = self ? { x: x1 + 18, y: y1 - 16 } : pointOnWire(x1, y1, x2, y2, 0.18, style);
                const nearEnd = self ? { x: x1 + 18, y: y1 + 28 } : pointOnWire(x1, y1, x2, y2, 0.82, style);
                const midLabel = (conn.protocol && conn.protocol !== "HTTPS / Dataflow" ? conn.protocol : look?.label) || "";
                const fromLabel = [conn.fromMult, conn.fromRole].filter(Boolean).join(" ");
                const toLabel = [conn.toMult, conn.toRole].filter(Boolean).join(" ");

                return (
                  <g
                    key={conn.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (toolMode === "disconnect") {
                        remember();
                        const next = connectionsRef.current.filter((c) => c.id !== conn.id);
                        connectionsRef.current = next;
                        setConnections(next);
                        setToast({ message: "Connection severed", type: "info" });
                      } else {
                        setSelectedConnId(conn.id);
                        setSelectedNodeId(null);
                      }
                    }}
                  >
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isError ? "url(#errorWire)" : isSelected ? "#d08968" : look ? "#e4e4e7" : "url(#activeWire)"}
                      strokeWidth={isSelected ? "3.5" : isError ? "2.5" : "2"}
                      strokeDasharray={look?.dashed ? "7 4" : isError ? "4 4" : undefined}
                      opacity={isSelected ? 1 : isError ? 0.9 : 0.75}
                      markerEnd={markerEnd}
                      markerStart={markerStart}
                      className="group-hover:stroke-copper transition-colors"
                    />
                    {fromLabel ? <text x={nearStart.x} y={nearStart.y - 6} fill="#e4e4e7" fontSize="11" textAnchor="middle">{fromLabel}</text> : null}
                    {midLabel ? <text x={mid.x} y={mid.y - 8} fill="#e4e4e7" fontSize="11" textAnchor="middle">{midLabel}</text> : null}
                    {toLabel ? <text x={nearEnd.x} y={nearEnd.y - 6} fill="#e4e4e7" fontSize="11" textAnchor="middle">{toLabel}</text> : null}
                    {conn.kind === "crows" && !self ? (
                      <>
                        <CrowFoot
                          x={x1}
                          y={y1}
                          degrees={(Math.atan2(y1 - pointOnWire(x1, y1, x2, y2, 0.08, style).y, x1 - pointOnWire(x1, y1, x2, y2, 0.08, style).x) * 180) / Math.PI}
                          mark={crowMark(conn.fromMult)}
                        />
                        <CrowFoot
                          x={x2}
                          y={y2}
                          degrees={(Math.atan2(y2 - pointOnWire(x1, y1, x2, y2, 0.92, style).y, x2 - pointOnWire(x1, y1, x2, y2, 0.92, style).x) * 180) / Math.PI}
                          mark={crowMark(conn.toMult)}
                        />
                      </>
                    ) : null}
                  </g>
                );
              })}

              {/* Temporary live wire following mouse when drawing connection */}
              {connectFromId && connectSourceNode && (
                <path
                  d={wirePath(anchors(connectSourceNode).out.x, anchors(connectSourceNode).out.y, mousePos.x, mousePos.y, wireStyle)}
                  fill="none"
                  stroke="#d08968"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  markerEnd={relationLook(relationKind)?.end && relationLook(relationKind)?.end !== "none" ? `url(#uml-${relationLook(relationKind)?.end})` : "url(#arrow-temp)"}
                  markerStart={relationLook(relationKind)?.start && relationLook(relationKind)?.start !== "none" ? `url(#uml-${relationLook(relationKind)?.start})` : undefined}
                  className="pointer-events-none"
                />
              )}

              {/* Animated Data Particles with Interactive Inspection */}
              {particles.map((p) => {
                const conn = connections.find((c) => c.id === p.connId);
                if (!conn) return null;
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromPort = anchors(fromNode).out;
                const toPort = anchors(toNode).inn;
                const spot = pointOnWire(fromPort.x, fromPort.y, toPort.x, toPort.y, p.progress, wireStyleOf(conn.style));
                const cx = spot.x;
                const cy = spot.y;

                const color =
                  p.type === "cache_hit"
                    ? "#34d399"
                    : p.type === "blocked"
                      ? "#f43f5e"
                      : p.type === "db_write"
                        ? "#fbbf24"
                        : p.type === "ci_test"
                          ? "#38bdf8"
                          : "#818cf8";

                const isHovered = hoveredParticle?.id === p.id;
                const isSelected = selectedParticle?.id === p.id;

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer"
                    onPointerEnter={() => setHoveredParticle(p)}
                    onPointerLeave={() => setHoveredParticle((curr) => (curr?.id === p.id ? null : curr))}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedParticle?.id === p.id) {
                        setSelectedParticle(null);
                        setFlowPaused(false);
                      } else {
                        setSelectedParticle(p);
                        setFlowPaused(true);
                      }
                    }}
                  >
                    {/* Invisible large hit-box for easy click/hover */}
                    <circle cx={cx} cy={cy} r={18} fill="transparent" />

                    {/* Outer glowing pulse ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 10 : isHovered ? 8 : 6}
                      fill={color}
                      opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.2}
                      className={isSelected ? "animate-ping" : undefined}
                    />

                    {/* Inner high-contrast solid packet core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : isHovered ? 5 : 4}
                      fill={color}
                      stroke="var(--raised)"
                      strokeWidth={isSelected ? 2 : 1}
                      filter="drop-shadow(0 0 6px currentColor)"
                    />

                    {/* Floating Label HUD Tooltip right above packet when hovered or selected */}
                    {(isHovered || isSelected) && (
                      <foreignObject
                        x={Math.max(10, Math.min(1000, cx - 110))}
                        y={Math.max(10, cy - 75)}
                        width="220"
                        height="65"
                        className="overflow-visible pointer-events-auto"
                      >
                        <div
                          className="rounded-lg border border-line bg-raised p-2 text-ink shadow-xl text-[11px] backdrop-blur-md"
                          style={{ borderLeft: `3px solid ${color}` }}
                        >
                          <div className="flex items-center justify-between gap-1 font-bold">
                            <span className="truncate">{p.label}</span>
                            <span className="text-[9px] font-mono text-soft uppercase tracking-wider px-1 rounded bg-paper">
                              {p.latencyMs}ms
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-soft mt-0.5">
                            <span>{p.sourceLabel} → {p.targetLabel}</span>
                            <span className="font-mono text-good">{p.status}</span>
                          </div>
                          <div className="text-[9px] text-copper font-mono mt-1 text-center font-semibold">
                            {isSelected ? "Flow Stopped • Click to Resume" : "Click to Freeze & Inspect"}
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Drag & Drop Nodes with Vector Icons */}
            {[...nodes].sort((a, b) => (a.z ?? 0) - (b.z ?? 0)).map((node) => {
              const meta = faceMeta(node.type);
              const NodeIcon = meta.Icon;
              const isSelected = selectedNodeId === node.id;
              const isDown = node.health === "down";
              const isDegraded = node.health === "degraded";
              const isConnectSource = connectFromId === node.id;
              const drawing = drawnShape(node.type);
              const glyph = shapeGlyph(node.type);
              const size = nodeSize(node);
              const sketch = sketchWire && node.type.startsWith("wf-");
              const bare = glyph === "actor" || glyph === "start" || glyph === "stop" || glyph === "end" || glyph === "hist" || glyph === "ball" || glyph === "socket" || glyph === "port" || glyph === "fork" || glyph === "decide" || glyph === "choice";
              const ownChrome = glyph === "package" || glyph === "model" || glyph === "frame" || glyph === "bound" || glyph === "lane" || glyph === "life" || glyph === "frag" || glyph === "art" || glyph === "node" || glyph === "device" || glyph === "exec" || glyph === "comp";
              const openFace = node.type === "text" || node.type === "diamond" || bare || ownChrome;
              const shapeClass = glyph === "case" || glyph === "attr" || node.type === "ellipse" || node.type === "cylinder"
                ? "rounded-full"
                : glyph === "action" || glyph === "state"
                  ? "rounded-2xl"
                  : node.type === "cloud"
                    ? "rounded-[2rem]"
                    : node.type === "note"
                      ? "rounded-sm bg-amber-100 text-zinc-900"
                      : openFace
                        ? "border-transparent bg-transparent shadow-none"
                        : "rounded-xl";

              return (
                <div
                  key={node.id}
                  data-uml={glyph || undefined}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(node.id);
                  }}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                    width: size.w,
                    height: node.h || drawing ? size.h : undefined,
                    zIndex: 10 + (node.z ?? 0),
                    fontFamily: node.font === "Georgia" ? "Georgia, serif" : node.font === "monospace" ? "ui-monospace, monospace" : node.font === "Arial" ? "Arial, sans-serif" : undefined,
                    textAlign: node.align,
                    borderColor: sketch ? "transparent" : node.ink === "copper" ? "#d08968" : node.ink === "amber" ? "#d97706" : undefined,
                    borderStyle: node.lineStyle === "dashed" ? "dashed" : undefined,
                  }}
                  className={`absolute flex cursor-grab flex-col border p-2.5 active:cursor-grabbing ${sketch ? "foundry-sketch " : ""}${node.active ? "outline outline-1 outline-offset-2 outline-zinc-200 " : ""}${
                    openFace
                      ? shapeClass
                      : `${shapeClass} shadow-xl ${
                        node.type === "note"
                          ? ""
                          : isConnectSource
                            ? "border-amber-400 ring-2 ring-amber-400/60 bg-zinc-900 text-zinc-100"
                            : isSelected
                              ? "border-copper ring-2 ring-copper/60 bg-zinc-900 text-zinc-100"
                              : isDown
                                ? "border-rose-600 bg-rose-950/90 text-rose-100"
                                : isDegraded
                                  ? "border-amber-500 bg-amber-950/90 text-amber-100"
                                  : drawing
                                    ? "border-zinc-600 bg-zinc-900/90 text-zinc-100"
                                    : "border-zinc-700/80 bg-zinc-900/95 text-zinc-100 hover:border-zinc-500"
                      }`
                  }`}
                >
                  {sketch ? (
                    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" aria-hidden="true">
                      <path d={sketchPath(size.w, size.h, node.id)} fill="none" stroke={canvasTheme === "light" ? "#1c1916" : "#f3e6d4"} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  ) : null}
                  {(node.type === "diamond" || glyph === "decide" || glyph === "choice" || glyph === "rel") && (
                    <div
                      className={`pointer-events-none absolute inset-0 ${isSelected ? "bg-zinc-800" : "bg-zinc-900"}`}
                      style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
                    />
                  )}
                  <div
                    onClick={(e) => endPortConnect(node.id, e)}
                    title="Input"
                    className="absolute -left-2 top-1/2 z-20 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-emerald-400 hover:scale-125 transition-transform cursor-pointer"
                  />
                  <div
                    onClick={(e) => startPortConnect(node.id, e)}
                    title="Output"
                    className="absolute -right-2 top-1/2 z-20 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-copper hover:scale-125 transition-transform cursor-pointer"
                  />

                  {!glyph && node.type !== "text" && (
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={node.type === "note" ? "text-zinc-800" : "text-zinc-300"}>
                        <NodeIcon size={18} />
                      </span>
                      {!drawing || node.health !== "healthy" ? (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isDown ? "bg-rose-500 animate-ping" : isDegraded ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                        />
                      ) : <span />}
                    </div>
                  )}

                  {editingId === node.id ? (
                    <input
                      autoFocus
                      aria-label="Name"
                      value={node.label}
                      onFocus={rememberOnce}
                      onBlur={() => {
                        editRemembered.current = false;
                        setEditingId(null);
                      }}
                      onChange={(e) => updateSelectedNode("label", e.target.value)}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") setEditingId(null);
                      }}
                      className="relative z-10 mt-1 w-full bg-transparent text-xs font-bold text-inherit outline-none"
                    />
                  ) : glyph ? null : (
                    <div className={`relative z-10 ${node.type === "note" ? "[&_p]:text-zinc-900" : ""}`}>
                      <NodeWords label={node.label} role={node.role} tool={drawing ? "" : node.industryTool} type={node.type} />
                    </div>
                  )}
                  {glyph ? <UmlFace node={node} glyph={glyph} hideName={editingId === node.id} /> : null}

                  {!drawing && (
                    <div className="relative z-10 mt-2 flex items-center justify-between gap-2 border-t border-zinc-700/60 pt-1.5 text-[9px] text-zinc-300">
                      <span className="truncate font-mono">{node.latency} ms</span>
                      <span className="truncate font-mono">{node.rps} rps</span>
                    </div>
                  )}

                  {showTooltips && !drawing && node.industryTool && (
                    <div className="relative z-10 mt-1 truncate rounded bg-black/60 px-1 py-0.5 text-center font-mono text-[8px] text-zinc-400">
                      {node.industryTool.split("/")[0]}
                    </div>
                  )}

                  {isSelected && toolMode === "select" && (
                    <button
                      type="button"
                      aria-label="Resize"
                      className="absolute -bottom-1.5 -right-1.5 z-20 h-3.5 w-3.5 cursor-nwse-resize rounded-sm border border-zinc-900 bg-copper"
                      onPointerDown={(e) => startResize(node.id, e)}
                    />
                  )}
                </div>
              );
            })}
                </div>
              </div>
            </div>

            {/* Deep Packet Inspector HUD Card (Active when particle is clicked / frozen) */}
            {selectedParticle && (
              <div className="absolute top-14 left-4 right-4 z-30 mx-auto max-w-xl rounded-xl border border-copper bg-raised p-4 text-xs shadow-2xl backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-copper/15 text-copper">
                      <IconTelemetry size={14} />
                    </span>
                    <div>
                      <h4 className="font-bold text-ink">
                        Deep Packet Inspection #{selectedParticle.id}: {selectedParticle.label}
                      </h4>
                      <p className="text-[10px] text-soft">Dataflow stopped for behavioral analysis</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-danger">
                      ❚❚ FLOW STOPPED
                    </span>
                    <button
                      onClick={() => {
                        setSelectedParticle(null);
                        setFlowPaused(false);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-copper bg-copper px-3 py-1 font-bold text-raised shadow-xs hover:opacity-90 transition-opacity"
                    >
                      <IconPlay size={12} />
                      <span>Resume Flow</span>
                    </button>
                  </div>
                </div>

                {/* Packet Specs Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-[11px]">
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Route</span>
                    <span className="font-bold text-ink truncate block">
                      {selectedParticle.sourceLabel} → {selectedParticle.targetLabel}
                    </span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Protocol</span>
                    <span className="font-bold text-copper truncate block">{selectedParticle.protocol}</span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Latency</span>
                    <span className="font-bold text-good block">{selectedParticle.latencyMs} ms</span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Wire Status</span>
                    <span className="font-bold text-ink block">{selectedParticle.status}</span>
                  </div>
                </div>

                <p className="mt-2.5 rounded bg-paper/60 p-2 text-xs text-soft leading-relaxed border border-line/50">
                  <strong className="text-ink">Architectural Mechanism: </strong>
                  {selectedParticle.description}
                </p>
              </div>
            )}
          </div>

          {/* Live In-Lab Architecture Telemetry & Graph Drawer */}
          {showAnalyticsDrawer && (
            <div className="rounded-xl border border-line bg-raised p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-copper">
                    <IconAnalytics size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">In-Lab Real-Time Telemetry & Architecture Graphs</h3>
                    <p className="text-[11px] text-soft">Live flight metrics, latency waterfalls, and throughput telemetry.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalyticsDrawer(false)}
                  className="rounded-md border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-soft hover:text-ink"
                >
                  <IconClose size={12} className="inline mr-1" />
                  Close Graphs
                </button>
              </div>

              {/* 3-Column Analytics Grid */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* 1. Live RPS Waveform (Area Graph) */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconSurge size={14} className="text-copper" />
                        Live Throughput
                      </span>
                      <span className="font-mono text-copper font-bold">{Math.round(nodes.reduce((acc, n) => acc + (n.health === 'down' ? 0 : n.rps), 0) * trafficMultiplier * (flowPaused ? 0 : 1))} RPS</span>
                    </div>
                    <p className="text-[10px] text-soft">Aggregated request rate across active cluster nodes</p>

                    {/* SVG Mini Waveform */}
                    <div className="mt-3">
                      <svg viewBox="0 0 200 60" className="w-full h-16 overflow-visible" aria-label="Live throughput mini graph">
                        <defs>
                          <linearGradient id="miniAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d08968" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#d08968" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 45 Q 25 30, 50 38 T 100 20 T 150 28 T 200 15 L 200 60 L 0 60 Z"
                          fill="url(#miniAreaGrad)"
                        />
                        <path
                          d="M 0 45 Q 25 30, 50 38 T 100 20 T 150 28 T 200 15"
                          fill="none"
                          stroke="#d08968"
                          strokeWidth="2"
                        />
                        <line x1="0" y1="12" x2="200" y2="12" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      </svg>
                      <div className="flex justify-between font-mono text-[9px] text-soft mt-1">
                        <span>-30s</span>
                        <span className="text-danger font-semibold">Ceiling: 1,000 RPS</span>
                        <span>Now</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Latency Breakdown */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconTelemetry size={14} className="text-copper" />
                        Latency Percentiles
                      </span>
                      <span className="font-mono text-good font-bold">{Math.round(nodes.reduce((acc, n) => acc + (n.health === 'down' ? 0 : n.latency), 0) / Math.max(1, nodes.length))} ms avg</span>
                    </div>
                    <p className="text-[10px] text-soft">End-to-end roundtrip delay by percentile</p>

                    <div className="mt-3 space-y-2 font-mono text-[10px]">
                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p50 (Median)</span>
                          <span className="text-ink font-bold">12 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-good w-[20%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p90 (Standard)</span>
                          <span className="text-ink font-bold">34 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-copper w-[45%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p99 (Tail Peak)</span>
                          <span className="text-danger font-bold">68 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-danger w-[75%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Traffic Composition */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconCache size={14} className="text-copper" />
                        Traffic Breakdown
                      </span>
                      <span className="font-mono text-ink font-bold">{particles.length} in flight</span>
                    </div>
                    <p className="text-[10px] text-soft">Real-time classification of flowing packets</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">Cache Hits</span>
                        <span className="font-bold text-good">
                          {particles.filter((p) => p.type === 'cache_hit').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">DB Writes</span>
                        <span className="font-bold text-amber-500">
                          {particles.filter((p) => p.type === 'db_write').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">Blocked / 401</span>
                        <span className="font-bold text-danger">
                          {particles.filter((p) => p.type === 'blocked').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">HTTP Ingress</span>
                        <span className="font-bold text-sky-400">
                          {particles.filter((p) => p.type === 'request').length} pkts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Flight Packet Audit Stream */}
              <div className="rounded-lg border border-line bg-paper p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-ink">Live Flight Packet Audit Ledger</span>
                  <span className="text-[10px] font-mono text-soft">Showing recent wire transits • Click to inspect</span>
                </div>

                <div className="max-h-36 overflow-y-auto font-mono text-[11px] divide-y divide-line/40">
                  {recentPacketLedger.length === 0 ? (
                    <p className="py-2 text-center text-soft text-[11px]">Awaiting wire traffic...</p>
                  ) : (
                    recentPacketLedger.slice(0, 8).map((pkt) => (
                      <div
                        key={pkt.id}
                        onClick={() => {
                          setSelectedParticle(pkt);
                          setFlowPaused(true);
                        }}
                        className="py-1.5 flex items-center justify-between hover:bg-raised px-2 rounded cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-copper font-bold">#{pkt.id}</span>
                          <span className="truncate">{pkt.label}</span>
                          <span className="text-[9px] text-soft">({pkt.sourceLabel} → {pkt.targetLabel})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-good">{pkt.latencyMs}ms</span>
                          <span className="rounded bg-raised px-1 py-0.5 text-[9px] text-ink font-semibold">
                            {pkt.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Connection Inspector Drawer */}
          {selectedConn && (
            <div className={`foundry-print-hide rounded-xl border border-line bg-paper p-4 shadow-xs ${fullPage ? "max-h-44 shrink-0 overflow-auto" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-raised text-ink">
                    <IconConnect size={18} />
                  </span>
                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                    <span>Connection: {nodes.find((n) => n.id === selectedConn.from)?.label}</span>
                    <IconArrowRight size={13} className="text-copper" />
                    <span>{nodes.find((n) => n.id === selectedConn.to)?.label}</span>
                  </h4>
                </div>
                <button
                  onClick={() => {
                    remember();
                    const next = connectionsRef.current.filter((c) => c.id !== selectedConn.id);
                    connectionsRef.current = next;
                    setConnections(next);
                    setSelectedConnId(null);
                    setToast({ message: "Connection removed", type: "info" });
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3.5 py-1.5 font-mono text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-100/60 transition-colors shadow-xs"
                >
                  <IconCut size={14} />
                  <span>Disconnect Wire</span>
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label htmlFor="conn-protocol" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">{selectedConn.kind ? "Name" : "Protocol"}</label>
                  <input
                    id="conn-protocol"
                    value={selectedConn.protocol || ""}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedConn({ protocol: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink"
                  />
                </div>
                <div>
                  <label htmlFor="conn-from-role" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">From role</label>
                  <input id="conn-from-role" value={selectedConn.fromRole || ""} onFocus={rememberOnce} onBlur={() => { editRemembered.current = false; }} onChange={(e) => updateSelectedConn({ fromRole: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink" />
                </div>
                <div>
                  <label htmlFor="conn-from-mult" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">From multiplicity</label>
                  <input id="conn-from-mult" value={selectedConn.fromMult || ""} onFocus={rememberOnce} onBlur={() => { editRemembered.current = false; }} onChange={(e) => updateSelectedConn({ fromMult: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink" />
                </div>
                <div>
                  <label htmlFor="conn-to-role" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">To role</label>
                  <input id="conn-to-role" value={selectedConn.toRole || ""} onFocus={rememberOnce} onBlur={() => { editRemembered.current = false; }} onChange={(e) => updateSelectedConn({ toRole: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink" />
                </div>
                <div>
                  <label htmlFor="conn-to-mult" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">To multiplicity</label>
                  <input id="conn-to-mult" value={selectedConn.toMult || ""} onFocus={rememberOnce} onBlur={() => { editRemembered.current = false; }} onChange={(e) => updateSelectedConn({ toMult: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink" />
                </div>
              </div>
            </div>
          )}

          {/* Selected Node Inspector Drawer (Full CRUD) */}
          {selectedNode && (
            <div className={`foundry-print-hide rounded-xl border border-line bg-paper p-5 shadow-xs ${fullPage ? (selectedGlyph ? "max-h-56 shrink-0 overflow-auto" : "max-h-48 shrink-0 overflow-auto") : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-raised shadow-2xs"
                    style={{ color: faceMeta(selectedNode.type).color }}
                  >
                    {(() => {
                      const SelectedIcon = faceMeta(selectedNode.type).Icon;
                      return <SelectedIcon size={20} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-ink tracking-tight">{selectedNode.label}</h3>
                    <p className="font-mono text-xs text-soft">{faceMeta(selectedNode.type).name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setConnectFromId(selectedNode.id);
                      setToast({ message: "Click destination node to link arrow", type: "info" });
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-bold transition-all shadow-xs ${
                      connectFromId === selectedNode.id
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink hover:border-ink hover:bg-raised"
                    }`}
                  >
                    <IconConnect size={14} />
                    <span>{connectFromId === selectedNode.id ? "Connecting..." : "Connect Wire"}</span>
                  </button>
                  <button
                    onClick={deleteSelectedNode}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3.5 py-1.5 font-mono text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-100/60 transition-colors shadow-xs"
                  >
                    <IconClear size={14} />
                    <span>Delete Node</span>
                  </button>
                </div>
              </div>

              {/* Node Customization Controls (CRUD Update) */}
              <div className={`mt-4 grid grid-cols-1 gap-4 ${selectedGlyph ? "sm:grid-cols-2" : "sm:grid-cols-4"}`}>
                <div>
                  <label htmlFor="node-label" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    Node Label
                  </label>
                  <input
                    id="node-label"
                    type="text"
                    value={selectedNode.label}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("label", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>

                {selectedGlyph ? (
                  <div>
                    <label htmlFor="node-stereotype" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Stereotype</label>
                    <input
                      id="node-stereotype"
                      type="text"
                      value={selectedNode.stereotype || ""}
                      onFocus={rememberOnce}
                      onBlur={() => { editRemembered.current = false; }}
                      onChange={(e) => updateSelectedNode("stereotype", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="node-health" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Health Status</label>
                      <select
                        id="node-health"
                        value={selectedNode.health}
                        onChange={(e) => updateSelectedNode("health", e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                      >
                        <option value="healthy">Healthy (Operational)</option>
                        <option value="degraded">Degraded (High Latency)</option>
                        <option value="down">Down (Outage / Crash)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="node-latency" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Latency (ms)</label>
                      <input
                        id="node-latency"
                        type="number"
                        value={selectedNode.latency}
                        onFocus={rememberOnce}
                        onBlur={() => { editRemembered.current = false; }}
                        onChange={(e) => updateSelectedNode("latency", Number(e.target.value))}
                        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label htmlFor="node-rps" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">RPS Capacity</label>
                      <input
                        id="node-rps"
                        type="number"
                        value={selectedNode.capacity}
                        onFocus={rememberOnce}
                        onBlur={() => { editRemembered.current = false; }}
                        onChange={(e) => updateSelectedNode("capacity", Number(e.target.value))}
                        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                      />
                    </div>
                  </>
                )}
              </div>

              {selectedGlyph ? (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-line/60 pt-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="node-visibility" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Visibility</label>
                    <select id="node-visibility" value={selectedNode.visibility || ""} onChange={(e) => updateSelectedNode("visibility", visibilityOf(e.target.value) || undefined)} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs text-ink">
                      <option value="">Unspecified</option>
                      <option value="public">public</option>
                      <option value="private">private</option>
                      <option value="protected">protected</option>
                      <option value="package">package</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-5 text-xs text-ink">
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!selectedNode.abstract} onChange={(e) => updateSelectedNode("abstract", e.target.checked || undefined)} /> isAbstract</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!selectedNode.finalSpec} onChange={(e) => updateSelectedNode("finalSpec", e.target.checked || undefined)} /> isFinalSpecialization</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!selectedNode.leaf} onChange={(e) => updateSelectedNode("leaf", e.target.checked || undefined)} /> isLeaf</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!selectedNode.active} onChange={(e) => updateSelectedNode("active", e.target.checked || undefined)} /> isActive</label>
                  </div>
                  <div>
                    <label htmlFor="node-font" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Font</label>
                    <select id="node-font" value={selectedNode.font || ""} onChange={(e) => updateSelectedNode("font", e.target.value === "Arial" || e.target.value === "Georgia" || e.target.value === "monospace" ? e.target.value : undefined)} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink">
                      <option value="">Canvas</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="node-ink" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Line</label>
                    <select id="node-ink" value={selectedNode.ink || ""} onChange={(e) => updateSelectedNode("ink", e.target.value === "ink" || e.target.value === "copper" || e.target.value === "amber" ? e.target.value : undefined)} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink">
                      <option value="">Ink</option>
                      <option value="ink">Ink</option>
                      <option value="copper">Copper</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="node-align" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Alignment</label>
                    <select id="node-align" value={selectedNode.align || ""} onChange={(e) => updateSelectedNode("align", e.target.value === "left" || e.target.value === "center" || e.target.value === "right" ? e.target.value : undefined)} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink">
                      <option value="">Default</option>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="node-line" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Line style</label>
                    <select id="node-line" value={selectedNode.lineStyle || "solid"} onChange={(e) => updateSelectedNode("lineStyle", e.target.value === "dashed" ? "dashed" : "solid")} className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink">
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <DocumentationField id="node-docs" value={selectedNode.documentation || ""} onChange={(value) => updateSelectedNode("documentation", value)} />
                  </div>
                </div>
              ) : null}

              {selectedGlyph ? (
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-line/60 pt-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="node-attributes" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                      {selectedGlyph === "enum" ? "Literals" : selectedGlyph === "state" ? "Internal" : selectedGlyph === "object" ? "Slots" : selectedGlyph === "frag" ? "Operands" : "Attributes"}
                    </label>
                    <textarea
                      id="node-attributes"
                      rows={2}
                      value={selectedNode.attributes || ""}
                      onFocus={rememberOnce}
                      onBlur={() => { editRemembered.current = false; }}
                      onChange={(e) => updateSelectedNode("attributes", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="node-operations" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">{selectedGlyph === "frag" ? "Guards" : "Operations"}</label>
                    <textarea
                      id="node-operations"
                      rows={3}
                      value={selectedNode.operations || ""}
                      onFocus={rememberOnce}
                      onBlur={() => { editRemembered.current = false; }}
                      onChange={(e) => updateSelectedNode("operations", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-line/60 pt-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="node-role" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Role</label>
                    <input
                      id="node-role"
                      type="text"
                      value={selectedNode.role}
                      onFocus={rememberOnce}
                      onBlur={() => { editRemembered.current = false; }}
                      onChange={(e) => updateSelectedNode("role", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label htmlFor="node-tool" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Field name</label>
                    <input
                      id="node-tool"
                      type="text"
                      value={selectedNode.industryTool}
                      onFocus={rememberOnce}
                      onBlur={() => { editRemembered.current = false; }}
                      onChange={(e) => updateSelectedNode("industryTool", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DocumentationField id="node-docs" value={selectedNode.documentation || ""} onChange={(value) => updateSelectedNode("documentation", value)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Integrated AI Architecture Tutor & Step-by-Step Guide Panel */}
          {!fullPage && showAiGuide && (
            <div className="rounded-xl border border-line bg-raised p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-copper">
                    <IconArchitect size={22} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Review</h3>
                    <p className="text-xs text-soft">What this drawing is doing, and what to change.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {aiReport && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      aiReport.status === "verified"
                        ? "bg-good/10 text-good border border-good/30"
                        : aiReport.status === "flawed"
                          ? "bg-danger/10 text-danger border border-danger/30"
                          : "bg-warn/10 text-warn border border-warn/30"
                    }`}>
                      {aiReport.status === "verified" ? (
                        <>
                          <IconCheck size={13} />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <IconChaos size={13} />
                          <span>Flaw Detected</span>
                        </>
                      )}
                    </span>
                  )}
                  <button
                    onClick={() => void runAiDiagnostic()}
                    disabled={aiAnalyzing}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink hover:border-copper transition-colors shadow-xs"
                  >
                    <IconRefresh size={13} className={aiAnalyzing ? "animate-spin" : ""} />
                    <span>{aiAnalyzing ? "Checking…" : "Check again"}</span>
                  </button>
                </div>
              </div>

              {/* 4-Section Educational Guidance */}
              {aiReport && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <p className="kicker text-[10px] text-soft">Now</p>
                    <p className="mt-0.5 text-xs font-bold text-ink">{aiReport.statusText}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-danger">The risk</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whatIsWrong}</p>
                    </div>

                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-copper">Why it matters</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whyItMatters}</p>
                    </div>
                  </div>

                  {aiReport.stepByStep.length > 0 ? <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <p className="kicker text-[10px] text-good">What to change</p>
                      {aiReport.canAutoFix && (
                        <button
                          onClick={applyRecommendedFix}
                          className="flex items-center gap-1.5 rounded border border-good/40 bg-good/10 px-2.5 py-1 text-xs font-bold text-good hover:bg-good/20 transition-all shadow-xs"
                        >
                          <IconArchitect size={13} />
                          <span>Apply this change</span>
                        </button>
                      )}
                    </div>
                    <ol className="mt-2 space-y-1 text-xs text-ink list-decimal list-inside">
                      {aiReport.stepByStep.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="font-medium">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div> : null}

                  {/* Ask AI Architecture Question Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (aiQuestion.trim()) {
                        void runAiDiagnostic(aiQuestion);
                        setAiQuestion("");
                      }
                    }}
                    className="mt-3 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Ask about this drawing"
                      className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-xs font-medium text-ink shadow-xs"
                    />
                    <button
                      type="submit"
                      disabled={aiAnalyzing || !aiQuestion.trim()}
                      className="flex items-center gap-1.5 rounded-lg border border-copper bg-copper px-4 py-2 text-xs font-bold text-raised shadow-xs hover:opacity-90 disabled:opacity-50"
                    >
                      <IconArchitect size={14} />
                      <span>Ask Tutor</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {!fullPage && <div className="rounded-xl border border-line bg-raised p-4 text-xs text-soft shadow-xs">
            <h4 className="flex items-center gap-2 font-bold text-ink">
              <IconPrinciple size={16} className="text-copper" />
              <span>One job each</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              Each part of the drawing has one job. The person does not talk to the record directly.
            </p>
          </div>}
        </div>
      </div>
    </div>
  );

  if (fullPage && portalReady) return createPortal(lab, document.body);
  return lab;
}
