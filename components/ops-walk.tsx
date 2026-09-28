"use client";

import Link from "next/link";
import { useState } from "react";
import type { Messages } from "@/lib/i18n/en";
import { previewFlags, webWire, type LabFields } from "@/lib/ops/preview";
import type { OpsId } from "@/lib/ops/meta";
import { useKeel } from "./keel-context";
import { CaseForm, CheckForm, LikeButton, postGrade } from "./work";

type Option = { id: string; text: string };
type Field = { id: string; kind: "order" | "single" | "multi"; prompt: string; options: Option[]; start?: string[] };
type Decision = { id: string; prompt: string; options: Option[] };

export type OpsWalkModel = {
  id: OpsId;
  no: string;
  minutes: number;
  level: string;
  title: string;
  promise: string;
  objectives: string[];
  start: string[];
  how: string[];
  expert: string[];
  figure: string;
  picture: string;
  links: { href: string; label: string }[];
  checkPrompt: string;
  checkOptions: Option[];
  labTitle: string;
  labScene: string[];
  labWarn: string;
  fields: Field[];
  caseFile: string;
  caseOrg: string;
  caseTitle: string;
  caseSituation: string[];
  caseTask: string;
  caseSteps: string[];
  decisions: Decision[];
  noteLabel: string;
  noteHint: string;
  previousId: OpsId | null;
  nextHref: string;
  nextLabel: string;
  blocked: boolean;
  saved: { check: boolean; lab: boolean; case: boolean };
};

export function OpsWalk({ model, m }: { model: OpsWalkModel; m: Messages }) {
  const { me, refresh } = useKeel();
  const [step, setStep] = useState(0);
  const [session, setSession] = useState({ check: false, lab: false });
  const saved = me?.ops?.[model.id] ?? model.saved;
  const signedIn = Boolean(me?.signedIn);
  const previousDone = !model.previousId || Boolean(model.previousId && me?.ops?.[model.previousId]?.case);
  const blocked = me === null ? model.blocked : signedIn && Boolean(model.previousId) && !previousDone;
  const checkDone = saved.check || session.check;
  const labDone = saved.lab || session.lab;
  const steps = [
    { id: "read", label: m.stepRead, open: true },
    { id: "check", label: m.stepCheck, open: !blocked },
    { id: "lab", label: m.stepLab, open: !blocked && checkDone },
    { id: "case", label: m.stepCase, open: !blocked && labDone },
  ];

  async function recorded(kind: "check" | "lab", result: { correct?: boolean; locked?: boolean; saved?: boolean }) {
    if (!result.correct || result.locked) return;
    setSession((current) => ({ ...current, [kind]: true }));
    if (result.saved) await refresh();
    setStep(kind === "check" ? 2 : 3);
  }

  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
      <p className="kicker">
        {model.level} · {m.section} {model.no} · {model.minutes} {m.minutes}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{model.title}</h1>
      <p className="mt-4 text-xl leading-snug">{model.promise}</p>
      <ol className="mt-8 flex flex-wrap gap-2" aria-label={m.steps}>
        {steps.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={step === index ? "border border-ink bg-ink px-3 py-2 text-sm text-paper disabled:opacity-40" : "border border-line px-3 py-2 text-sm disabled:opacity-40"}
              aria-current={step === index ? "step" : undefined}
              disabled={!item.open}
              onClick={() => setStep(index)}
            >
              <span className="num me-2">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ol>
      {blocked ? (
        <p className="mt-6 border-s-2 border-copper ps-4" role="status">
          {m.stepLocked}{" "}
          {model.previousId ? (
            <Link className="underline" href={`/ops/${model.previousId}`}>
              {m.back}
            </Link>
          ) : null}
        </p>
      ) : null}
      {step === 0 ? (
        <div className="mt-8">
          <h2 className="kicker">{m.objectives}</h2>
          <ul className="mt-3 space-y-2">
            {model.objectives.map((item) => (
              <li key={item} className="border-s border-copper ps-4">
                {item}
              </li>
            ))}
          </ul>
          <Prose heading={m.depthStart} paragraphs={model.start} />
          <figure className="my-6">
            <pre dir="ltr" className="diagram overflow-x-auto border border-line bg-raised p-4 text-ink">
              {model.picture.replace(/^\n/, "").replace(/\n$/, "")}
            </pre>
            <figcaption className="mt-2 text-sm leading-6 text-soft">{model.figure}</figcaption>
          </figure>
          <Prose heading={m.depthHow} paragraphs={model.how} />
          <Prose heading={m.depthExpert} paragraphs={model.expert} />
          {model.links.length ? (
            <p className="mt-6 text-sm">
              <span className="kicker me-3">{m.further}</span>
              {model.links.map((link) => (
                <a key={link.href} className="me-4 underline" href={link.href} rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </p>
          ) : null}
          <button className="mt-8 border border-ink bg-ink px-4 py-2 text-sm text-paper" type="button" onClick={() => setStep(1)} disabled={blocked}>
            {m.readContinue}
          </button>
        </div>
      ) : null}
      {step === 1 ? (
        <CheckForm
          kind="check"
          sectionId={model.id}
          prompt={model.checkPrompt}
          options={model.checkOptions}
          m={m}
          onDone={(result) => void recorded("check", result)}
        />
      ) : null}
      {step === 2 ? (
        <LabForm model={model} m={m} onDone={(result) => void recorded("lab", result)} />
      ) : null}
      {step === 3 ? (
        <div className="mt-10 border-t border-line pt-8">
          <p className="kicker">
            {model.caseFile} · {model.caseOrg}
          </p>
          <h2 className="mt-3 text-2xl font-medium">{model.caseTitle}</h2>
          {model.caseSituation.map((paragraph) => (
            <p key={paragraph} className="mt-4 leading-8">
              {paragraph}
            </p>
          ))}
          <h3 className="mt-8 text-xl font-medium">{m.task}</h3>
          <p className="mt-3">{model.caseTask}</p>
          <ol className="mt-4 list-decimal space-y-2 ps-5">
            {model.caseSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-soft">{m.fictional}</p>
          <CaseForm
            sectionId={model.id}
            decisions={model.decisions}
            noteLabel={model.noteLabel}
            noteHint={model.noteHint}
            m={m}
            gradeKind="ops-case"
            locked={blocked || !labDone}
            lockedText={m.stepLocked}
            onDone={async (result) => {
              if (result.correct && result.saved) await refresh();
            }}
          />
        </div>
      ) : null}
      <div className="mt-10 flex flex-wrap gap-3">
        <LikeButton sectionId={model.id} m={m} />
        <Link className="border border-line px-4 py-2 text-sm" href="/ops">
          {m.opsNav}
        </Link>
        <Link className="border border-line px-4 py-2 text-sm" href={model.nextHref}>
          {m.next}: {model.nextLabel}
        </Link>
      </div>
    </article>
  );
}

function Prose({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium tracking-tight">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-[1.05rem] leading-8">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function LabForm({ model, m, onDone }: { model: OpsWalkModel; m: Messages; onDone: (result: { correct?: boolean; locked?: boolean; saved?: boolean }) => void }) {
  const [order, setOrder] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    for (const field of model.fields) if (field.kind === "order" && field.start) initial[field.id] = field.start;
    return initial;
  });
  const [singles, setSingles] = useState<Record<string, string>>({});
  const [multis, setMultis] = useState<Record<string, string[]>>({});
  const [ran, setRan] = useState(false);
  const [result, setResult] = useState<{ correct?: boolean; why?: string[]; error?: string; locked?: boolean; saved?: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const fields = collect(model.fields, order, singles, multis);
  const ready = model.fields.every((field) => {
    const value = fields[field.id];
    if (field.kind === "single") return typeof value === "string" && value.length > 0;
    if (field.kind === "multi") return Array.isArray(value) && value.length > 0;
    return Array.isArray(value) && value.length === field.options.length;
  });
  const flags = previewFlags(model.id, fields);

  function move(id: string, index: number, direction: -1 | 1) {
    setOrder((current) => {
      const next = [...(current[id] ?? [])];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const left = next[index];
      const right = next[target];
      if (!left || !right) return current;
      next[index] = right;
      next[target] = left;
      return { ...current, [id]: next };
    });
    setRan(false);
  }

  return (
    <form
      className="mt-10 border-t border-line pt-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        const next = await postGrade({ kind: "lab", sectionId: model.id, fields });
        setResult(next);
        setRan(true);
        onDone(next);
        setPending(false);
      }}
    >
      <h2 className="text-2xl font-medium">{m.liveLab}</h2>
      <p className="mt-2 text-lg">{model.labTitle}</p>
      {model.labScene.map((paragraph) => (
        <p key={paragraph} className="mt-3 leading-8">
          {paragraph}
        </p>
      ))}
      {model.fields.map((field) => (
        <fieldset key={field.id} className="mt-8">
          <legend className="text-lg">{field.prompt}</legend>
          {field.kind === "order" ? (
            <ol className="mt-3 space-y-2">
              {(order[field.id] ?? []).map((id, index) => (
                <li key={id} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-raised px-3 py-3">
                  <span>
                    <span className="num me-3 text-soft">{String(index + 1).padStart(2, "0")}</span>
                    {field.options.find((option) => option.id === id)?.text}
                  </span>
                  <span className="flex gap-2">
                    <button className="border border-line px-2 py-1 text-sm" type="button" onClick={() => move(field.id, index, -1)} aria-label={m.orderUp}>
                      {m.orderUp}
                    </button>
                    <button className="border border-line px-2 py-1 text-sm" type="button" onClick={() => move(field.id, index, 1)} aria-label={m.orderDown}>
                      {m.orderDown}
                    </button>
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
          {field.kind === "single" ? (
            <div className="mt-3 space-y-2">
              {field.options.map((option) => (
                <label key={option.id} className="flex items-start gap-3 border border-line bg-raised px-3 py-3">
                  <input
                    className="mt-1"
                    type="radio"
                    name={field.id}
                    value={option.id}
                    checked={singles[field.id] === option.id}
                    onChange={() => {
                      setSingles((current) => ({ ...current, [field.id]: option.id }));
                      setRan(false);
                    }}
                  />
                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          ) : null}
          {field.kind === "multi" ? (
            <div className="mt-3 space-y-2">
              {field.options.map((option) => {
                const picked = multis[field.id] ?? [];
                return (
                  <label key={option.id} className="flex items-start gap-3 border border-line bg-raised px-3 py-3">
                    <input
                      className="mt-1"
                      type="checkbox"
                      checked={picked.includes(option.id)}
                      onChange={() => {
                        setMultis((current) => {
                          const have = current[field.id] ?? [];
                          const next = have.includes(option.id) ? have.filter((item) => item !== option.id) : [...have, option.id];
                          return { ...current, [field.id]: next };
                        });
                        setRan(false);
                      }}
                    />
                    <span>{option.text}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </fieldset>
      ))}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="border border-line px-4 py-2 text-sm" type="button" disabled={!ready} onClick={() => setRan(true)}>
          {m.runLab}
        </button>
        <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" type="submit" disabled={!ready || pending}>
          {pending ? m.loading : m.submit}
        </button>
      </div>
      {ran && ready ? <Preview model={model} m={m} fields={fields} warn={flags.warn} /> : null}
      {result ? (
        <div className="mt-6 border-s-2 border-copper ps-4" role="status">
          <p>{result.error === "rate" ? m.rateLimited : result.locked ? m.stepLocked : result.correct ? m.correct : m.notYet}</p>
          {result.correct && result.saved ? <p className="mt-2 text-sm text-soft">{m.saved}</p> : null}
          {result.why?.map((line) => (
            <p key={line} className="mt-3">
              {line}
            </p>
          ))}
          {result.correct && result.saved === false ? <p className="mt-3 text-sm text-soft">{m.signInToSave}</p> : null}
        </div>
      ) : null}
    </form>
  );
}

function collect(fields: Field[], order: Record<string, string[]>, singles: Record<string, string>, multis: Record<string, string[]>): LabFields {
  const out: LabFields = {};
  for (const field of fields) {
    if (field.kind === "order") out[field.id] = order[field.id] ?? [];
    if (field.kind === "single") out[field.id] = singles[field.id] ?? "";
    if (field.kind === "multi") out[field.id] = multis[field.id] ?? [];
  }
  return out;
}

function Preview({ model, m, fields, warn }: { model: OpsWalkModel; m: Messages; fields: LabFields; warn: boolean }) {
  const wire = model.id === "web" ? webWire(fields) : [];
  return (
    <div className="mt-6 border border-line bg-raised p-4" role="status" aria-label={m.labResult}>
      <h3 className="text-lg font-medium">{m.labResult}</h3>
      {wire.length ? (
        <pre dir="ltr" className="mt-3 overflow-x-auto font-mono text-sm">
          {wire.join("\n")}
        </pre>
      ) : (
        <ul className="mt-3 space-y-2">
          {model.fields.map((field) => {
            const value = fields[field.id];
            const text = Array.isArray(value)
              ? value.map((id) => field.options.find((option) => option.id === id)?.text ?? id).join(", ")
              : field.options.find((option) => option.id === value)?.text ?? "";
            return (
              <li key={field.id}>
                <span className="text-soft">{field.prompt}</span> {text}
              </li>
            );
          })}
        </ul>
      )}
      {warn ? <p className="mt-3">{model.labWarn}</p> : null}
    </div>
  );
}

export function OpsMarks({ id, m }: { id: string; m: Messages }) {
  const { me } = useKeel();
  const row = me?.ops?.[id];
  return (
    <p className="text-sm text-soft">
      <span>{row?.check ? "●" : "○"} {m.check}</span>
      <span className="ms-3">{row?.lab ? "●" : "○"} {m.liveLab}</span>
      <span className="ms-3">{row?.case ? "●" : "○"} {m.capstone}</span>
    </p>
  );
}

export function OpsLevel({ m }: { m: Messages }) {
  const { me } = useKeel();
  const ops = me?.ops;
  let label = m.levelEase;
  if (ops?.web?.case) label = m.levelPractice;
  if (ops?.git?.case) label = m.levelOperator;
  if (ops?.devops?.case) label = m.levelExpert;
  if (ops?.finops?.case) label = m.opsBriefKicker;
  if (me?.opsBrief) label = m.markOpsBrief;
  if (!me?.signedIn) return null;
  return (
    <p className="mt-6 text-sm">
      <span className="kicker me-3">{m.yourLevel}</span>
      {label}
      {typeof me.xp === "number" ? <span className="num ms-4 text-soft">{me.xp} {m.points}</span> : null}
    </p>
  );
}
