import type { Metadata } from "next";
import Link from "next/link";
import { sections } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { listProgress } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.dossierTitle,
    description: m.dossierBody,
    alternates: { canonical: "/dossier" },
    robots: { index: false, follow: false },
  };
}

export default async function DossierPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getPack(locale);
  const user = await currentUser();
  const rows = user ? listProgress(user.id).filter((row) => row.kind === "case" || row.kind === "brief") : [];
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="kicker">{m.dossier}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.dossierTitle}</h1>
      <p className="mt-4">{m.dossierBody}</p>
      {!user ? <p className="mt-6"><Link className="underline" href="/sign-in">{m.signIn}</Link></p> : null}
      {user && rows.length === 0 ? <p className="mt-6 text-soft">{m.dossierEmpty}</p> : null}
      <div className="mt-8 space-y-8">
        {rows.map((row) => {
          const detail = parseDetail(row.detail);
          const title = row.kind === "brief" ? pack.brief.title : pack.sections[row.itemId as keyof typeof pack.sections]?.title ?? row.itemId;
          const file = row.kind === "brief" ? m.harborFile : sections.find((section) => section.id === row.itemId) ? pack.sections[row.itemId as keyof typeof pack.sections].caseFile : "";
          return (
            <article key={`${row.kind}-${row.itemId}`} className="border-t border-line pt-6">
              <p className="kicker">{file} · {row.score === 1 ? m.acceptedLabel : m.draftLabel}</p>
              <h2 className="mt-2 text-2xl font-medium">{title}</h2>
              {detail.note ? <p className="mt-4 leading-8">{detail.note}</p> : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function parseDetail(detail: string | null): { note?: string } {
  if (!detail) return {};
  try {
    const parsed = JSON.parse(detail) as { note?: unknown };
    return typeof parsed.note === "string" ? { note: parsed.note } : {};
  } catch {
    return {};
  }
}
