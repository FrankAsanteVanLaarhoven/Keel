"use client";

import { useState } from "react";
import { markdownBlocks, markdownInlines } from "@/lib/markdown";
import { codeTokens, SKETCH_LANGUAGES, type ModelIssue, type SketchLanguage } from "@/lib/foundry-model";

export type DeskCommand = { id: string; label: string; run: () => void };
export type DeskHit = { id: string; label: string };

export function chooseFoundryTheme(value: "light" | "dark") {
  document.documentElement.dataset.theme = value;
  localStorage.setItem("keel.theme", value);
  window.dispatchEvent(new Event("keel-theme"));
}

export function chooseFoundryPage(value: "a4" | "letter") {
  document.documentElement.dataset.foundryPage = value;
}

export function subscribeCanvasTheme(listener: () => void) {
  window.addEventListener("keel-theme", listener);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  return () => {
    window.removeEventListener("keel-theme", listener);
    media.removeEventListener("change", listener);
  };
}

export function readCanvasTheme(): "light" | "dark" {
  const stored = document.documentElement.dataset.theme || localStorage.getItem("keel.theme") || "system";
  if (stored === "light") return "light";
  if (stored === "dark") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function FoundryCommands({
  open,
  commands,
  shapes,
  diagrams,
  onClose,
  onShape,
  onDiagram,
}: {
  open: boolean;
  commands: DeskCommand[];
  shapes: DeskHit[];
  diagrams: DeskHit[];
  onClose: () => void;
  onShape: (id: string) => void;
  onDiagram: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  if (!open) return null;
  const q = query.trim().toLowerCase();
  const commandHits = commands.filter((command) => !q || command.label.toLowerCase().includes(q)).slice(0, 24);
  const shapeHits = q ? shapes.filter((shape) => shape.label.toLowerCase().includes(q)).slice(0, 12) : [];
  const diagramHits = q ? diagrams.filter((diagram) => diagram.label.toLowerCase().includes(q)).slice(0, 8) : [];

  function runFirst() {
    if (commandHits[0]) {
      commandHits[0].run();
      onClose();
      return;
    }
    if (shapeHits[0]) {
      onShape(shapeHits[0].id);
      onClose();
      return;
    }
    if (diagramHits[0]) {
      onDiagram(diagramHits[0].id);
      onClose();
    }
  }

  return (
    <div className="foundry-print-hide fixed inset-0 z-[80] flex items-start justify-center bg-ink/40 p-3" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Commands"
        data-foundry-commands=""
        className="mt-10 w-full max-w-lg rounded-xl border border-line bg-paper p-3 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          } else if (event.key === "Enter") {
            event.preventDefault();
            runFirst();
          }
        }}
      >
        <label className="sr-only" htmlFor="foundry-find">Find a command or shape</label>
        <input
          id="foundry-find"
          autoFocus
          aria-label="Find a command or shape"
          value={query}
          placeholder="Commands, shapes, diagrams"
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-11 w-full rounded-lg border border-line bg-raised px-3 text-sm text-ink"
        />
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-soft">Commands</p>
        <ul className="mt-1 max-h-40 overflow-auto">
          {commandHits.length === 0 ? <li className="px-1 py-1 text-xs text-soft">No command matches.</li> : null}
          {commandHits.map((command) => (
            <li key={command.id}>
              <button
                type="button"
                className="min-h-11 w-full rounded-lg px-2 text-left text-sm font-semibold text-ink hover:bg-raised"
                onClick={() => {
                  command.run();
                  onClose();
                }}
              >
                {command.label}
              </button>
            </li>
          ))}
        </ul>
        {q ? (
          <>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-soft">Shapes</p>
            <ul>
              {shapeHits.length === 0 ? <li className="px-1 py-1 text-xs text-soft">No shape matches.</li> : null}
              {shapeHits.map((shape) => (
                <li key={shape.id}>
                  <button type="button" className="min-h-11 w-full rounded-lg px-2 text-left text-sm text-ink hover:bg-raised" onClick={() => { onShape(shape.id); onClose(); }}>
                    {shape.label}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-soft">Diagrams</p>
            <ul>
              {diagramHits.length === 0 ? <li className="px-1 py-1 text-xs text-soft">No diagram matches.</li> : null}
              {diagramHits.map((diagram) => (
                <li key={diagram.id}>
                  <button type="button" className="min-h-11 w-full rounded-lg px-2 text-left text-sm text-ink hover:bg-raised" onClick={() => { onDiagram(diagram.id); onClose(); }}>
                    {diagram.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-xs text-soft">Type to find a shape or a diagram.</p>
        )}
      </div>
    </div>
  );
}

export function FoundryModeling({
  open,
  busy,
  note,
  issues,
  language,
  onLanguage,
  page,
  onPage,
  theme,
  onTheme,
  sketch,
  lines,
  loose,
  onRemove,
  room,
  sharing,
  onRoom,
  onShare,
  onCheck,
  onSketch,
  onHtml,
  onSvg,
  onPrint,
}: {
  open: boolean;
  busy: boolean;
  note: string;
  issues: ModelIssue[];
  language: SketchLanguage;
  onLanguage: (language: SketchLanguage) => void;
  page: "a4" | "letter";
  onPage: (page: "a4" | "letter") => void;
  theme: "light" | "dark";
  onTheme: (theme: "light" | "dark") => void;
  sketch: string;
  lines: string[];
  loose: { id: string; label: string }[];
  onRemove: (id: string) => void;
  room: string;
  sharing: boolean;
  onRoom: (value: string) => void;
  onShare: () => void;
  onCheck: () => void;
  onSketch: () => void;
  onHtml: () => void;
  onSvg: () => void;
  onPrint: () => void;
}) {
  return (
    <section
      aria-label="Modeling"
      data-foundry-modeling=""
      className={open ? "foundry-print-hide max-h-36 shrink-0 overflow-auto rounded-xl border border-line bg-raised px-3 py-2 md:max-h-48" : "hidden"}
    >
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Modeling</h2>
      <div className="mt-2 flex flex-nowrap items-center gap-1 overflow-x-auto sm:gap-2">
        <label className="sr-only" htmlFor="foundry-share-room">Room</label>
        <input
          id="foundry-share-room"
          value={room}
          onChange={(event) => onRoom(event.target.value)}
          placeholder="harbor"
          autoComplete="off"
          className="min-h-11 w-28 shrink-0 rounded-lg border border-line bg-paper px-2 text-xs text-ink"
        />
        <button type="button" aria-pressed={sharing} onClick={onShare} className={`min-h-11 shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${sharing ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Share</button>
      </div>
      <p className="mt-1 text-xs leading-5 text-soft">Other Foundry tabs in this browser that use this room follow the drawing. Share does not leave this browser, and it does not reach GitHub.</p>
      <div className="mt-2 flex flex-nowrap items-center gap-1 overflow-x-auto sm:gap-2">
        <button type="button" onClick={onCheck} className="min-h-11 shrink-0 rounded-lg border border-copper bg-copper px-1 py-1.5 text-xs font-semibold text-raised sm:px-2.5">Check</button>
        <button type="button" onClick={onSketch} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">Sketch code</button>
        <button type="button" onClick={onHtml} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">HTML notes</button>
        <button type="button" onClick={onSvg} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">SVG</button>
        <button type="button" onClick={onPrint} className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 py-1.5 text-xs font-semibold text-ink sm:px-2.5">Print</button>
        <label className="sr-only" htmlFor="foundry-code-language">Sketch language</label>
        <select
          id="foundry-code-language"
          aria-label="Sketch language"
          value={language}
          onChange={(event) => {
            const next = SKETCH_LANGUAGES.find((item) => item.id === event.target.value);
            if (next) onLanguage(next.id);
          }}
          className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 text-xs font-semibold text-ink sm:px-2"
        >
          {SKETCH_LANGUAGES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <label className="sr-only" htmlFor="foundry-page">Page size</label>
        <select
          id="foundry-page"
          aria-label="Page size"
          value={page}
          onChange={(event) => onPage(event.target.value === "letter" ? "letter" : "a4")}
          className="min-h-11 shrink-0 rounded-lg border border-line bg-paper px-1 text-xs font-semibold text-ink sm:px-2"
        >
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
        <button type="button" aria-pressed={theme === "light"} onClick={() => onTheme("light")} className={`min-h-11 shrink-0 rounded-lg border px-1 py-1.5 text-xs font-semibold sm:px-2.5 ${theme === "light" ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Light</button>
        <button type="button" aria-pressed={theme === "dark"} onClick={() => onTheme("dark")} className={`min-h-11 shrink-0 rounded-lg border px-1 py-1.5 text-xs font-semibold sm:px-2.5 ${theme === "dark" ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Dark</button>
      </div>
      {note ? (
        <p role={busy || issues.length === 0 ? "status" : "alert"} className={`mt-2 text-xs ${busy || issues.length === 0 ? "text-ink" : "text-danger"}`}>{note}</p>
      ) : null}
      {issues.slice(0, 4).map((issue) => (
        <p key={`${issue.target}-${issue.message}`} className="mt-1 text-xs text-danger">{issue.message}</p>
      ))}
      {lines.slice(0, 8).map((line, index) => (
        <p key={`${index}-${line}`} className="mt-1 text-xs text-ink">{line}</p>
      ))}
      {loose.slice(0, 6).map((shape) => (
        <button key={shape.id} type="button" onClick={() => onRemove(shape.id)} className="mt-1 flex min-h-11 w-full items-center rounded-lg border border-line bg-paper px-2 text-left text-xs font-semibold text-ink">
          Remove {shape.label}
        </button>
      ))}
      {sketch ? (
        <pre className="mt-2 max-h-24 overflow-auto rounded-lg border border-line bg-paper p-2 font-mono text-[11px] leading-5 text-ink">
          {codeTokens(sketch).map((token, index) => token.keyword
            ? <span key={`${index}-${token.text}`} className="text-copper">{token.text}</span>
            : <span key={`${index}-${token.text}`}>{token.text}</span>)}
        </pre>
      ) : null}
      <details className="mt-2 text-xs leading-5 text-soft">
        <summary className="cursor-pointer font-semibold text-ink">How the sheet is stored</summary>
        <p className="mt-1">
          The drawing is a JSON file. This page is the class build. Open it in a browser on Windows, macOS, or Linux, and load it again to use the build that is running.
          From this machine, node --experimental-strip-types scripts/foundry-cli.mjs drawing.json --code java writes a Java sketch. --html writes notes, --svg writes an image, and --check prints the same notes as Check sheet.
          PHP, JavaScript, TypeScript, Ruby, SQL, and GraphQL are the same kind of local sketch. A Java attribute also gets a getter and a setter. The desk does not install an extension from the web, and it does not read a source file back into the drawing.
        </p>
      </details>
    </section>
  );
}

export function DocumentationField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Documentation</label>
        <button type="button" aria-pressed={preview} onClick={() => setPreview((on) => !on)} className="min-h-11 rounded-lg border border-line bg-paper px-2 text-[10px] font-semibold text-ink">
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      <textarea
        id={id}
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink"
      />
      {preview ? (
        <div data-foundry-doc-preview="" className="mt-1 max-h-24 overflow-auto rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink">
          <DocPreview source={value} />
        </div>
      ) : null}
    </div>
  );
}

function DocPreview({ source }: { source: string }) {
  const blocks = markdownBlocks(source);
  if (blocks.length === 0) return <p className="text-soft">Nothing to preview yet.</p>;
  return (
    <div className="space-y-1">
      {blocks.map((block, index) => {
        if (block.type === "h") {
          const Tag = block.level === 1 ? "h3" : block.level === 2 ? "h4" : "h5";
          return <Tag key={index} className="text-xs font-bold text-ink"><Inline source={block.text} /></Tag>;
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc ps-4">
              {block.items.map((item, itemIndex) => <li key={itemIndex}><Inline source={item} /></li>)}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal ps-4">
              {block.items.map((item, itemIndex) => <li key={itemIndex}><Inline source={item} /></li>)}
            </ol>
          );
        }
        if (block.type === "task") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" disabled checked={item.checked} aria-label={item.checked ? "Checked" : "Unchecked"} />
                  <Inline source={item.text} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>{block.header.map((cell, cellIndex) => <th key={cellIndex} className="border border-line px-1 text-left font-semibold"><Inline source={cell} /></th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className="border border-line px-1"><Inline source={cell} /></td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "quote") return <blockquote key={index} className="border-s-2 border-line ps-2"><Inline source={block.text} /></blockquote>;
        if (block.type === "code") {
          return (
            <pre key={index} className="overflow-auto font-mono text-[11px]">
              <code>
                {codeTokens(block.text).map((token, tokenIndex) => token.keyword
                  ? <span key={tokenIndex} className="text-copper">{token.text}</span>
                  : <span key={tokenIndex}>{token.text}</span>)}
              </code>
            </pre>
          );
        }
        if (block.type === "hr") return <hr key={index} className="border-line" />;
        return <p key={index}><Inline source={block.text} /></p>;
      })}
    </div>
  );
}

function Inline({ source }: { source: string }) {
  return markdownInlines(source).map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    if (part.type === "em") return <em key={index}>{part.text}</em>;
    if (part.type === "del") return <del key={index}>{part.text}</del>;
    if (part.type === "code") return <code key={index} className="font-mono text-copper">{part.text}</code>;
    if (part.type === "link") return <a key={index} href={part.href} className="text-copper underline">{part.text}</a>;
    return <span key={index}>{part.text}</span>;
  });
}
