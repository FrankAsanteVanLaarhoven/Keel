"use client";

import { useState } from "react";
import type { UmlFamily } from "@/lib/foundry-board";
import { MERMAID_EXAMPLE, readMermaid, wireframeScreen } from "@/lib/foundry-mermaid";
import type { AcceptedPatch, DiagramSnapshot } from "@/lib/foundry-extensions";

type Tone = "ok" | "error" | "wait";

export function FoundryMermaid({
  open,
  readDiagram,
  applyPatch,
  onFamily,
}: {
  open: boolean;
  readDiagram: () => DiagramSnapshot;
  applyPatch: (patch: AcceptedPatch) => void;
  onFamily: (family: UmlFamily) => void;
}) {
  const [source, setSource] = useState("");
  const [note, setNote] = useState<{ tone: Tone; text: string }>({ tone: "wait", text: "" });

  function draw() {
    const result = readMermaid(source, readDiagram());
    if ("error" in result) {
      setNote({ tone: "error", text: result.error });
      return;
    }
    onFamily(result.family);
    applyPatch(result.patch);
    setNote({ tone: "ok", text: `${result.patch.summary} Drawn from Mermaid.` });
  }

  function placeScreen() {
    const result = wireframeScreen(readDiagram());
    if (result.patch.addNodes.length === 0) {
      setNote({ tone: "error", text: result.patch.summary || "The desk could not place that screen. Clear a little space and try again." });
      return;
    }
    onFamily(result.family);
    applyPatch(result.patch);
    setNote({ tone: "ok", text: `${result.patch.summary} The wireframe uses the sketch line. The AI desk can change it from a description.` });
  }

  return (
    <section
      aria-label="Mermaid"
      data-foundry-mermaid=""
      className={open ? "foundry-print-hide max-h-44 shrink-0 overflow-auto rounded-xl border border-line bg-raised px-3 py-2 md:max-h-64" : "foundry-print-hide hidden"}
    >
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Mermaid</h2>
      <label htmlFor="foundry-mermaid" className="mt-1 block text-xs font-semibold text-ink">Mermaid description</label>
      <textarea
        id="foundry-mermaid"
        value={source}
        maxLength={4000}
        rows={1}
        spellCheck={false}
        onChange={(event) => setSource(event.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink"
      />
      <div className="mt-2 flex flex-nowrap gap-1 overflow-x-auto sm:gap-2">
        <button type="button" onClick={draw} className="min-h-11 shrink-0 rounded-lg border border-copper bg-copper px-1 py-1.5 text-xs font-semibold text-raised sm:px-2.5">Draw from Mermaid</button>
        <button type="button" onClick={() => setSource(MERMAID_EXAMPLE)} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">Insert example</button>
        <button type="button" onClick={placeScreen} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">Place a screen</button>
      </div>
      {note.text ? (
        <p role={note.tone === "error" ? "alert" : "status"} className={`mt-2 text-xs ${note.tone === "error" ? "text-danger" : "text-ink"}`}>{note.text}</p>
      ) : null}
      <details className="mt-2 text-xs leading-5 text-soft">
        <summary className="cursor-pointer font-semibold text-ink">What this desk reads</summary>
        <p className="mt-1">
          flowchart, classDiagram, erDiagram, and sequenceDiagram become shapes on this sheet.
          Place a screen draws a hand-drawn wireframe. With Wireframe selected, the AI desk can redraw that screen from a description.
        </p>
      </details>
    </section>
  );
}
