import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOps } from "@/lib/ops";
import { nextOpsId, opsById, opsPictures, previousOpsId } from "@/lib/ops/meta";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { listProgress } from "@/lib/store";
import { OpsWalk } from "@/components/ops-walk";
import { SectionScope } from "@/components/keel-context";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const meta = opsById(id);
  if (!meta) return {};
  const locale = await resolveLocale();
  const copy = getOps(locale).sections[meta.id];
  const m = t(locale);
  return { title: `${copy.title} — Keel`, description: copy.promise };
}

export default async function OpsLevelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = opsById(id);
  if (!meta) notFound();
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getOps(locale);
  const copy = pack.sections[meta.id];
  const user = await currentUser();
  const rows = user ? listProgress(user.id) : [];
  const previous = previousOpsId(meta.id);
  const done = (itemId: string, kind: string) => rows.some((row) => row.itemId === itemId && row.kind === kind && row.score === 1);
  const next = nextOpsId(meta.id);
  const nextCopy = next && next !== "brief" ? pack.sections[next] : null;
  const levelName = { ease: m.levelEase, practice: m.levelPractice, operator: m.levelOperator, expert: m.levelExpert };
  return (
    <SectionScope scope={{ id: meta.id, title: copy.title, narration: copy.narration, promise: copy.promise, how: copy.how[0] }}>
      <OpsWalk
        m={m}
        model={{
          id: meta.id,
          no: meta.no,
          minutes: meta.minutes,
          level: levelName[meta.level],
          title: copy.title,
          promise: copy.promise,
          objectives: [...copy.objectives],
          start: [...copy.start],
          how: [...copy.how],
          expert: [...copy.expert],
          figure: copy.figure,
          picture: opsPictures[meta.id],
          links: copy.links,
          checkPrompt: copy.checkPrompt,
          checkOptions: meta.checkIds.map((optionId, index) => ({ id: optionId, text: copy.checkOptions[index] ?? "" })),
          labTitle: copy.labTitle,
          labScene: [...copy.labScene],
          labWarn: copy.labWarn,
          fields: meta.lab.map((field) => ({
            id: field.id,
            kind: field.kind,
            prompt: copy.fields[field.id]?.prompt ?? "",
            options: field.optionIds.map((optionId, index) => ({ id: optionId, text: copy.fields[field.id]?.options[index] ?? "" })),
            start: field.kind === "order" ? field.start : undefined,
          })),
          caseFile: copy.caseFile,
          caseOrg: copy.caseOrg,
          caseTitle: copy.caseTitle,
          caseSituation: [...copy.caseSituation],
          caseTask: copy.caseTask,
          caseSteps: [...copy.caseSteps],
          decisions: meta.decisions.map((decision, index) => ({
            id: decision.id,
            prompt: copy.decisions[index]?.prompt ?? "",
            options: decision.optionIds.map((optionId, optionIndex) => ({
              id: optionId,
              text: copy.decisions[index]?.options[optionIndex] ?? "",
            })),
          })),
          noteLabel: copy.noteLabel,
          noteHint: copy.noteHint,
          previousId: previous,
          nextHref: next === "brief" ? "/ops/brief" : next ? `/ops/${next}` : "/ops",
          nextLabel: nextCopy ? nextCopy.title : pack.brief.title,
          foundryId: meta.foundry,
          blocked: Boolean(previous && user && !done(previous, "ops-case")),
          saved: { check: done(meta.id, "check"), lab: done(meta.id, "lab"), case: done(meta.id, "ops-case") },
        }}
      />
    </SectionScope>
  );
}
