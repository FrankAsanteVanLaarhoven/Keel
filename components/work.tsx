"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";

type Option = { id: string; text: string };
type Decision = { id: string; prompt: string; options: Option[] };

async function postGrade(body: unknown): Promise<{ correct?: boolean; why?: string[]; saved?: boolean; locked?: boolean; error?: string }> {
  const response = await fetch("/api/grade", {
    method: "POST",
    headers: { "content-type": "application/json", "x-keel": "1" },
    body: JSON.stringify({ ...((body ?? {}) as object), day: new Date().toISOString().slice(0, 10) }),
  });
  if (response.status === 429) return { error: "rate" };
  return (await response.json()) as { correct?: boolean; why?: string[]; saved?: boolean; locked?: boolean; error?: string };
}

export function CheckForm({
  kind,
  sectionId,
  prompt,
  options,
  m,
}: {
  kind: "check";
  sectionId: string;
  prompt: string;
  options: Option[];
  m: Messages;
}) {
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState<{ correct?: boolean; why?: string[]; error?: string; saved?: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="mt-10 border-t border-line pt-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setResult(await postGrade({ kind, sectionId, choice }));
        setPending(false);
      }}
    >
      <h2 className="text-2xl font-medium">{m.check}</h2>
      <fieldset className="mt-4">
        <legend className="text-lg">{prompt}</legend>
        <div className="mt-4 space-y-2">
          {options.map((option) => (
            <label key={option.id} className="flex items-start gap-3 border border-line bg-raised px-3 py-3">
              <input className="mt-1" type="radio" name="choice" value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Submit m={m} pending={pending} disabled={!choice} />
      <Result m={m} result={result} />
    </form>
  );
}

export function BenchForm({
  sectionId,
  title,
  prompt,
  kind,
  items,
  slots,
  choose,
  m,
}: {
  sectionId: string;
  title: string;
  prompt: string;
  kind: "order" | "single" | "multi" | "label";
  items: Option[];
  slots: Option[];
  choose?: number;
  m: Messages;
}) {
  const [order, setOrder] = useState(items.map((item) => item.id));
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ correct?: boolean; why?: string[]; error?: string; saved?: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const text = new Map(items.map((item) => [item.id, item.text]));

  function move(index: number, direction: -1 | 1) {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index];
    const swap = next[target];
    if (!current || !swap) return;
    next[index] = swap;
    next[target] = current;
    setOrder(next);
  }

  return (
    <form
      className="mt-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const payload =
          kind === "order" ? { order } : kind === "single" ? { choice } : kind === "multi" ? { choices } : { labels };
        setResult(await postGrade({ kind: "bench", sectionId, ...payload }));
        setPending(false);
      }}
    >
      <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
      <p className="mt-4 text-lg">{prompt}</p>
      {kind === "order" ? (
        <ol className="mt-6 space-y-2">
          {order.map((id, index) => (
            <li key={id} className="flex items-center justify-between gap-3 border border-line bg-raised px-3 py-3">
              <span>
                <span className="num me-3 text-soft">{String(index + 1).padStart(2, "0")}</span>
                {text.get(id)}
              </span>
              <span className="flex gap-2">
                <button type="button" className="text-sm underline" onClick={() => move(index, -1)}>
                  {m.orderUp}
                </button>
                <button type="button" className="text-sm underline" onClick={() => move(index, 1)}>
                  {m.orderDown}
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {kind === "single" ? <Radios name="bench" options={items} value={choice} onChange={setChoice} /> : null}
      {kind === "multi" ? (
        <div className="mt-6 space-y-2">
          <p className="kicker">{m.chooseN}</p>
          {items.map((item) => (
            <label key={item.id} className="flex items-start gap-3 border border-line bg-raised px-3 py-3">
              <input
                className="mt-1"
                type="checkbox"
                checked={choices.includes(item.id)}
                onChange={() =>
                  setChoices((current) =>
                    current.includes(item.id) ? current.filter((id) => id !== item.id) : current.length >= (choose ?? 3) ? current : [...current, item.id],
                  )
                }
              />
              <span>{item.text}</span>
            </label>
          ))}
        </div>
      ) : null}
      {kind === "label" ? (
        <div className="mt-6 space-y-4">
          {slots.map((slot) => (
            <label key={slot.id} className="block">
              <span className="block text-sm text-soft">{slot.text}</span>
              <select
                className="mt-1 w-full border border-line bg-raised px-3 py-2"
                value={labels[slot.id] ?? ""}
                onChange={(event) => setLabels((current) => ({ ...current, [slot.id]: event.target.value }))}
              >
                <option value="">—</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.text}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}
      <Submit m={m} pending={pending} />
      <Result m={m} result={result} />
    </form>
  );
}

export function CaseForm({
  sectionId,
  decisions,
  noteLabel,
  noteHint,
  m,
  brief = false,
  locked = false,
}: {
  sectionId?: string;
  decisions: Decision[];
  noteLabel: string;
  noteHint: string;
  m: Messages;
  brief?: boolean;
  locked?: boolean;
}) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ correct?: boolean; why?: string[]; error?: string; locked?: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="mt-8"
      onSubmit={async (event) => {
        event.preventDefault();
        if (locked) return;
        setPending(true);
        setResult(await postGrade({ kind: brief ? "brief" : "case", sectionId, choices, note }));
        setPending(false);
      }}
    >
      {decisions.map((decision, index) => (
        <fieldset key={decision.id} className="mt-8">
          <legend className="text-lg">
            <span className="num me-2 text-soft">{String(index + 1).padStart(2, "0")}</span>
            {decision.prompt}
          </legend>
          <Radios
            name={decision.id}
            options={decision.options}
            value={choices[decision.id] ?? ""}
            onChange={(value) => setChoices((current) => ({ ...current, [decision.id]: value }))}
          />
        </fieldset>
      ))}
      <label className="mt-8 block">
        <span className="text-lg">{noteLabel}</span>
        <textarea
          className="mt-2 min-h-36 w-full border border-line bg-raised px-3 py-3"
          value={note}
          placeholder={noteHint}
          onChange={(event) => setNote(event.target.value)}
          disabled={locked}
        />
      </label>
      <Submit m={m} pending={pending} disabled={locked} />
      <Result m={m} result={result} />
    </form>
  );
}

function Radios({ name, options, value, onChange }: { name: string; options: Option[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-3 space-y-2">
      {options.map((option) => (
        <label key={option.id} className="flex items-start gap-3 border border-line bg-raised px-3 py-3">
          <input className="mt-1" type="radio" name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
}

function Submit({ m, pending, disabled = false }: { m: Messages; pending: boolean; disabled?: boolean }) {
  return (
    <button className="mt-6 border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" type="submit" disabled={pending || disabled}>
      {pending ? m.loading : m.submit}
    </button>
  );
}

function Result({ m, result }: { m: Messages; result: { correct?: boolean; why?: string[]; error?: string; locked?: boolean; saved?: boolean } | null }) {
  if (!result) return null;
  const tone = result.error === "rate" ? m.rateLimited : result.locked ? m.briefLocked : result.correct ? m.correct : m.notYet;
  return (
    <div className="mt-6 border-s-2 border-copper ps-4" role="status">
      <p>{tone}</p>
      {result.correct && result.saved ? <p className="mt-2 text-sm text-soft">{m.saved}</p> : null}
      {result.why?.map((line) => (
        <p key={line} className="mt-3">
          {line}
        </p>
      ))}
      {result.correct && result.saved === false ? <p className="mt-3 text-sm text-soft">{m.signInToSave}</p> : null}
    </div>
  );
}

export function LikeButton({ sectionId, m }: { sectionId: string; m: Messages }) {
  const { me, refresh } = useKeel();
  const row = me?.likes?.[sectionId];
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      className="border border-line px-4 py-2 text-sm"
      disabled={pending || !me?.signedIn}
      onClick={async () => {
        setPending(true);
        await fetch("/api/like", {
          method: "POST",
          headers: { "content-type": "application/json", "x-keel": "1" },
          body: JSON.stringify({ sectionId }),
        });
        await refresh();
        setPending(false);
      }}
    >
      {row?.mine ? m.usefulDone : m.useful}
      <span className="num ms-2 text-soft">{row?.count ?? 0}</span>
    </button>
  );
}
