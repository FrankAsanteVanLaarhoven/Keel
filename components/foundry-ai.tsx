"use client";

import { useState } from "react";
import type { AcceptedPatch, DiagramSnapshot } from "@/lib/foundry-extensions";

type Tone = "ok" | "error" | "wait";

type McpPayload = {
  summary?: string;
  note?: string;
  patch?: AcceptedPatch | null;
  code?: string;
  suggestions?: string[];
};

export function FoundryAi({
  open,
  readDiagram,
  applyPatch,
}: {
  open: boolean;
  readDiagram: () => DiagramSnapshot;
  applyPatch: (patch: AcceptedPatch) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState<"diagram" | "suggest" | "code" | null>(null);
  const [note, setNote] = useState<{ tone: Tone; text: string }>({ tone: "wait", text: "" });
  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function ask(kind: "diagram" | "suggest" | "code") {
    if (busy) return;
    const diagram = readDiagram();
    if (kind === "diagram" && !prompt.trim()) {
      setNote({ tone: "error", text: "Describe the diagram, then draw again." });
      return;
    }
    setBusy(kind);
    setNote({ tone: "wait", text: "Reading the sheet…" });
    const name = kind === "diagram" ? "generate_diagram" : kind === "suggest" ? "suggest_diagram" : "generate_code";
    const args = kind === "diagram" ? { prompt: prompt.trim(), diagram } : { diagram };
    try {
      const response = await fetch("/api/foundry/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
          "mcp-protocol-version": "2025-06-18",
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
        signal: AbortSignal.timeout(25000),
      });
      const data = (await response.json()) as {
        error?: { message?: string };
        result?: { isError?: boolean; content?: { text?: string }[]; structuredContent?: McpPayload };
      };
      if (!response.ok || data.error) {
        setNote({ tone: "error", text: data.error?.message || "The MCP server refused that call. Try again." });
        return;
      }
      const result = data.result;
      const payload = result?.structuredContent;
      const text = result?.content?.[0]?.text || payload?.summary || "The desk answered without a readable note. Try again.";
      if (result?.isError) {
        setNote({ tone: "error", text });
        return;
      }
      if (payload?.patch) applyPatch(payload.patch);
      if (kind === "code") setCode(payload?.code ?? "");
      if (kind === "suggest") setSuggestions(payload?.suggestions ?? []);
      if (kind === "diagram") {
        setCode("");
        setSuggestions([]);
      }
      setNote({ tone: "ok", text });
    } catch {
      setNote({ tone: "error", text: "The desk could not reach the MCP server. Try the action again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section
      aria-label="AI desk"
      aria-busy={busy !== null}
      data-foundry-ai=""
      className={open ? "foundry-print-hide max-h-44 shrink-0 overflow-auto rounded-xl border border-line bg-raised px-3 py-2 md:max-h-64" : "foundry-print-hide hidden"}
    >
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink">AI desk</h2>
      <label htmlFor="foundry-ai-prompt" className="mt-1 block text-xs font-semibold text-ink">What should this sheet show?</label>
      <textarea
        id="foundry-ai-prompt"
        value={prompt}
        maxLength={500}
        rows={1}
        onChange={(event) => setPrompt(event.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-xs text-ink"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" disabled={busy !== null} onClick={() => ask("diagram")} className="min-h-11 rounded-lg border border-copper bg-copper px-2.5 py-1.5 text-xs font-semibold text-raised disabled:opacity-60">
          {busy === "diagram" ? "Drawing…" : "Draw diagram"}
        </button>
        <button type="button" disabled={busy !== null} onClick={() => ask("suggest")} className="min-h-11 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink disabled:opacity-60">
          {busy === "suggest" ? "Reading…" : "Suggest"}
        </button>
        <button type="button" disabled={busy !== null} onClick={() => ask("code")} className="min-h-11 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink disabled:opacity-60">
          {busy === "code" ? "Sketching…" : "Sketch code"}
        </button>
      </div>
      <details className="mt-2 text-xs leading-5 text-soft">
        <summary className="cursor-pointer font-semibold text-ink">When an answer uses the class model</summary>
        <p className="mt-1">
          Draw diagram, Suggest, and Sketch code call /api/foundry/mcp.
          The key stays on the class server.
          A signed-in learner who allowed the live tutor can get a model drawing or code sketch.
          Otherwise the desk answers from this sheet.
          The server does not reach GitHub, CI, Docker, or a cloud account.
        </p>
      </details>
      {note.text ? (
        <p role={note.tone === "error" ? "alert" : "status"} className={`mt-2 text-xs ${note.tone === "error" ? "text-danger" : "text-ink"}`}>
          {note.text}
        </p>
      ) : null}
      {suggestions.length > 0 ? (
        <ul aria-label="Suggestions" className="mt-2 list-disc pl-4 text-xs leading-5 text-ink">
          {suggestions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {code ? (
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-ink">Code sketch</h3>
          <pre className="mt-1 max-h-32 overflow-auto rounded-lg border border-line bg-paper p-2 text-xs text-ink">{code}</pre>
        </div>
      ) : null}
    </section>
  );
}
