"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Messages } from "@/lib/i18n/en";

type Column = { name: string; type: string };
type Dataset = { name: string; version: number; files: string[]; columns: Column[]; rowCount: number; hash: string };
type Transform = {
  id: string;
  name: string;
  inputs: string[];
  statement: string;
  outputName: string;
  outputKind: "dataset" | "object";
  objectType: string;
  grain: string;
};
type Lineage = { id: string; name: string; stale: boolean; inputs: string[]; outputName: string; outputKind: "dataset" | "object" };
type View = {
  branch: string;
  branches: { name: string; base: string | null }[];
  datasets: Dataset[];
  transforms: Transform[];
  objects: { name: string; grain: string; version: number; rowCount: number; hash: string }[];
  lineage: Lineage[];
  build: null | {
    status: string;
    engine: string;
    at: number;
    steps: { name: string; status: string; rows?: number; error?: string }[];
    spark: string;
    flink: string;
  };
};
type Preview = { columns: Column[]; rows: Record<string, string | number | null>[] };
type Draft = {
  name: string;
  inputs: string[];
  statement: string;
  outputName: string;
  outputKind: "dataset" | "object";
  objectType: string;
  grain: string;
};

const emptyDraft: Draft = {
  name: "",
  inputs: [],
  statement: "",
  outputName: "",
  outputKind: "dataset",
  objectType: "",
  grain: "",
};

export function PipelineBuilder({ m }: { m: Messages }) {
  const [view, setView] = useState<View | null>(null);
  const [notice, setNotice] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [landName, setLandName] = useState("");
  const [fileName, setFileName] = useState("data.csv");
  const [fileText, setFileText] = useState("");
  const [branchName, setBranchName] = useState("");
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const load = useCallback(async (branch: string) => {
    setLoading(true);
    setProblem("");
    const response = await fetch(`/api/pipeline?branch=${encodeURIComponent(branch)}`);
    const body = await response.json().catch(() => ({ error: "unavailable" }));
    setLoading(false);
    if (!response.ok) {
      setProblem(pipelineError(String(body.error ?? ""), m));
      return;
    }
    setView(body as View);
  }, [m]);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const response = await fetch("/api/pipeline?branch=main", { signal: controller.signal });
        const body = await response.json().catch(() => ({ error: "unavailable" }));
        if (controller.signal.aborted) return;
        setLoading(false);
        if (!response.ok) {
          setProblem(pipelineError(String(body.error ?? ""), m));
          return;
        }
        setView(body as View);
      } catch {
        if (!controller.signal.aborted) setProblem(m.pipelineFailed);
      }
    })();
    return () => controller.abort();
  }, [m]);

  async function post(payload: Record<string, unknown>, okMessage = "") {
    setBusy(true);
    setProblem("");
    setNotice("");
    const response = await fetch("/api/pipeline", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({ branch: view?.branch ?? "main", ...payload }),
    });
    const body = await response.json().catch(() => ({ error: "unavailable" }));
    setBusy(false);
    if (!response.ok) {
      setProblem(pipelineError(String(body.error ?? ""), m));
      return null;
    }
    if (body.preview) {
      setPreview(body.preview as Preview);
      return null;
    }
    setPreview(null);
    setView(body as View);
    if (payload.action === "deliver" && body.build?.status === "failed") setProblem(m.pipelineFailed);
    else if (okMessage) setNotice(okMessage);
    return body as View;
  }

  function toggleInput(name: string) {
    setDraft((current) => ({
      ...current,
      inputs: current.inputs.includes(name) ? current.inputs.filter((item) => item !== name) : [...current.inputs, name],
    }));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.pipeline}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.pipelineTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{m.pipelineDeck}</p>
      <p className="mt-3"><Link className="text-sm underline" href="/foundry">{m.pipelineDrawing}</Link></p>

      {problem ? <p className="mt-6 border border-line px-4 py-3 text-sm" role="alert">{problem}</p> : null}
      {notice ? <p className="mt-6 text-sm" role="status">{notice}</p> : null}
      {loading ? <p className="mt-8 text-sm" aria-busy="true">{m.opening}</p> : null}

      {view ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section aria-labelledby="lineage-heading">
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-sm">
                <span className="kicker block">{m.pipelineBranch}</span>
                <select
                  className="mt-2 border border-line bg-transparent px-3 py-2"
                  value={view.branch}
                  onChange={(event) => void load(event.target.value)}
                >
                  {view.branches.map((branch) => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}{branch.base ? ` ← ${branch.base}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <form
                className="flex flex-wrap items-end gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void post({ action: "branch", name: branchName, from: view.branch }).then((next) => {
                    if (next) setBranchName("");
                  });
                }}
              >
                <label className="text-sm">
                  <span className="kicker block">{m.pipelineNewBranch}</span>
                  <input className="mt-2 border border-line bg-transparent px-3 py-2" value={branchName} onChange={(event) => setBranchName(event.target.value)} />
                </label>
                <button className="border border-line px-3 py-2 text-sm" type="submit" disabled={busy}>{m.pipelineCreateBranch}</button>
              </form>
            </div>

            <h2 id="lineage-heading" className="mt-8 text-2xl font-medium">{m.pipelineLineage}</h2>
            <PipelineGraph datasets={view.datasets} lineage={view.lineage} onDataset={toggleInput} />
            {view.datasets.length === 0 ? <p className="mt-4 text-sm">{m.pipelineEmpty}</p> : null}
            <ul className="mt-4 grid gap-3">
              {view.datasets.map((dataset) => (
                <li key={dataset.name} className="border border-line px-4 py-3">
                  <p className="text-sm">{dataset.name}</p>
                  <p className="mt-1 text-sm text-soft">{m.pipelineVersion} {dataset.version} · {m.pipelineRows} {dataset.rowCount} · {dataset.files.join(", ")} · {dataset.hash.slice(0, 12)}</p>
                </li>
              ))}
            </ul>
            {view.lineage.length === 0 ? <p className="mt-4 text-sm">{m.pipelineNoTransforms}</p> : null}
            <ul className="mt-4 grid gap-3">
              {view.lineage.map((item) => (
                <li key={item.id} className="border border-line px-4 py-3">
                  <p className="text-sm">{item.name}</p>
                  <p className="mt-1 text-sm text-soft">{item.inputs.join(", ")} → {item.outputName} · {item.outputKind === "object" ? m.pipelineKindObject : m.pipelineKindDataset} · {item.stale ? m.pipelineStale : m.pipelineCurrent}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="border border-line px-3 py-2 text-sm" type="button" disabled={busy} onClick={() => void post({ action: "preview", id: item.id })}>{m.pipelinePreview}</button>
                    <button className="border border-line px-3 py-2 text-sm" type="button" disabled={busy} onClick={() => void post({ action: "remove", id: item.id })}>{m.pipelineRemove}</button>
                  </div>
                </li>
              ))}
            </ul>
            {view.objects.length > 0 ? (
              <>
                <h2 className="mt-8 text-2xl font-medium">{m.pipelineObjects}</h2>
                <ul className="mt-4 grid gap-3">
                  {view.objects.map((object) => (
                    <li key={object.name} className="border border-line px-4 py-3 text-sm">
                      {object.name} · {m.pipelineGrain} {object.grain} · {m.pipelineVersion} {object.version} · {m.pipelineRows} {object.rowCount}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {preview ? <PreviewTable m={m} preview={preview} /> : null}
            {view.build ? <BuildRecord m={m} build={view.build} /> : null}
          </section>

          <section className="grid gap-8" aria-label={m.pipeline}>
            <form
              className="border border-line px-4 py-5"
              onSubmit={(event) => {
                event.preventDefault();
                void post({ action: "land", name: landName, files: [{ name: fileName, text: fileText }] }).then((next) => {
                  if (!next) return;
                  setLandName("");
                  setFileText("");
                });
              }}
            >
              <h2 className="text-2xl font-medium">{m.pipelineDatasets}</h2>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineDatasetName}</span>
                <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={landName} onChange={(event) => setLandName(event.target.value)} required />
              </label>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineFileName}</span>
                <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={fileName} onChange={(event) => setFileName(event.target.value)} required />
              </label>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineFileText}</span>
                <textarea className="mt-2 min-h-32 w-full border border-line bg-transparent px-3 py-2 font-mono text-sm" value={fileText} onChange={(event) => setFileText(event.target.value)} required />
              </label>
              <button className="mt-4 border border-ink bg-ink px-3 py-2 text-sm text-paper" type="submit" disabled={busy}>{m.pipelineLand}</button>
              <button className="ms-2 mt-4 border border-line px-3 py-2 text-sm" type="button" disabled={busy} onClick={() => void post({ action: "sample" })}>{m.pipelineSample}</button>
            </form>

            <form
              className="border border-line px-4 py-5"
              onSubmit={(event) => {
                event.preventDefault();
                void post({ action: "transform", ...draft, id: "" }).then((next) => {
                  if (next) setDraft(emptyDraft);
                });
              }}
            >
              <h2 className="text-2xl font-medium">{m.pipelineTransforms}</h2>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineTransformName}</span>
                <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
              </label>
              <fieldset className="mt-4">
                <legend className="kicker">{m.pipelineInputs}</legend>
                <div className="mt-2 grid gap-2">
                  {view.datasets.map((dataset) => (
                    <label key={dataset.name} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.inputs.includes(dataset.name)}
                        onChange={() => toggleInput(dataset.name)}
                      />
                      {dataset.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineStatement}</span>
                <textarea className="mt-2 min-h-28 w-full border border-line bg-transparent px-3 py-2 font-mono text-sm" value={draft.statement} onChange={(event) => setDraft({ ...draft, statement: event.target.value })} required />
              </label>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineOutputName}</span>
                <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={draft.outputName} onChange={(event) => setDraft({ ...draft, outputName: event.target.value })} required />
              </label>
              <label className="mt-4 block text-sm">
                <span className="kicker">{m.pipelineKindDataset}</span>
                <select
                  className="mt-2 w-full border border-line bg-transparent px-3 py-2"
                  value={draft.outputKind}
                  onChange={(event) => setDraft({ ...draft, outputKind: event.target.value === "object" ? "object" : "dataset" })}
                >
                  <option value="dataset">{m.pipelineKindDataset}</option>
                  <option value="object">{m.pipelineKindObject}</option>
                </select>
              </label>
              {draft.outputKind === "object" ? (
                <>
                  <label className="mt-4 block text-sm">
                    <span className="kicker">{m.pipelineObjectType}</span>
                    <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={draft.objectType} onChange={(event) => setDraft({ ...draft, objectType: event.target.value })} required />
                  </label>
                  <label className="mt-4 block text-sm">
                    <span className="kicker">{m.pipelineGrain}</span>
                    <input className="mt-2 w-full border border-line bg-transparent px-3 py-2" value={draft.grain} onChange={(event) => setDraft({ ...draft, grain: event.target.value })} required />
                  </label>
                </>
              ) : null}
              <button className="mt-4 border border-ink bg-ink px-3 py-2 text-sm text-paper" type="submit" disabled={busy}>{m.pipelineSave}</button>
            </form>

            <div className="border border-line px-4 py-5">
              <h2 className="text-2xl font-medium">{m.pipelineDeliver}</h2>
              <p className="mt-3 text-sm leading-6">{m.pipelineEngineNote}</p>
              <button className="mt-4 border border-ink bg-ink px-3 py-2 text-sm text-paper" type="button" disabled={busy} onClick={() => void post({ action: "deliver" }, m.pipelineBuilt)}>{m.pipelineDeliver}</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function PipelineGraph({ datasets, lineage, onDataset }: { datasets: Dataset[]; lineage: Lineage[]; onDataset: (name: string) => void }) {
  const row = 64;
  const height = Math.max(datasets.length, lineage.length, 1) * row + 24;
  return (
    <div className="mt-4 overflow-x-auto border border-line">
      <svg className="min-w-[640px]" viewBox={`0 0 640 ${height}`} aria-hidden="true" width="640" height={height}>
        {datasets.map((dataset, index) => (
          <g key={dataset.name}>
            <rect x="16" y={16 + index * row} width="160" height="40" fill="none" stroke="currentColor" />
            <text x="24" y={40 + index * row} fontSize="12">{dataset.name}</text>
          </g>
        ))}
        {lineage.map((item, index) => (
          <g key={item.id}>
            <rect x="240" y={16 + index * row} width="160" height="40" fill="none" stroke="currentColor" />
            <text x="248" y={40 + index * row} fontSize="12">{item.outputName}</text>
            <rect x="460" y={16 + index * row} width="160" height="40" fill="none" stroke="currentColor" />
            <text x="468" y={40 + index * row} fontSize="12">{item.stale ? "·" : ""} {item.outputKind}</text>
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-2 px-3 py-3">
        {datasets.map((dataset) => (
          <button key={dataset.name} className="border border-line px-3 py-2 text-sm" type="button" onClick={() => onDataset(dataset.name)}>{dataset.name}</button>
        ))}
      </div>
    </div>
  );
}

function PreviewTable({ m, preview }: { m: Messages; preview: Preview }) {
  return (
    <div className="mt-6 overflow-x-auto border border-line">
      <table className="w-full text-sm">
        <caption className="px-3 py-2 text-start">{m.pipelinePreview}</caption>
        <thead>
          <tr>{preview.columns.map((column) => <th key={column.name} className="px-3 py-2 text-start font-medium">{column.name}</th>)}</tr>
        </thead>
        <tbody>
          {preview.rows.slice(0, 40).map((row, index) => (
            <tr key={index} className="border-t border-line">
              {preview.columns.map((column) => <td key={column.name} className="px-3 py-2">{row[column.name] == null ? "" : String(row[column.name])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BuildRecord({ m, build }: { m: Messages; build: NonNullable<View["build"]> }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-medium">{m.pipelineEngine}</h2>
      <p className="mt-2 text-sm" role="status">{build.status === "built" ? m.pipelineBuilt : m.pipelineFailed}</p>
      <ul className="mt-3 grid gap-2">
        {build.steps.map((step) => (
          <li key={step.name} className="text-sm">{step.name} · {step.status}{step.rows != null ? ` · ${m.pipelineRows} ${step.rows}` : ""}{step.error ? ` · ${pipelineError(step.error, m)}` : ""}</li>
        ))}
      </ul>
      <h3 className="mt-6 text-lg font-medium">{m.pipelineSpark}</h3>
      <pre className="mt-2 overflow-x-auto border border-line p-3 text-xs">{build.spark}</pre>
      <h3 className="mt-6 text-lg font-medium">{m.pipelineFlink}</h3>
      <pre className="mt-2 overflow-x-auto border border-line p-3 text-xs">{build.flink}</pre>
    </div>
  );
}

function pipelineError(code: string, m: Messages): string {
  const known: Record<string, string> = {
    auth: m.pipelineSignIn,
    name: m.pipelineErrorName,
    file: m.pipelineErrorFile,
    columns: m.pipelineErrorColumns,
    statement: m.pipelineErrorStatement,
    cycle: m.pipelineErrorCycle,
    missing: m.pipelineErrorMissing,
    grain: m.pipelineErrorGrain,
    output: m.pipelineErrorOutput,
    rows: m.pipelineErrorRows,
    "object-input": m.pipelineErrorObject,
  };
  return known[code] ?? m.pipelineFailed;
}
