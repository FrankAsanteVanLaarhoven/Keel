import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectionById } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { Reading } from "@/components/reading";
import { SectionScope } from "@/components/keel-context";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) return { title: "Case" };
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  return {
    title: `${copy.title} · ${m.section} ${meta.no}`,
    description: copy.promise,
    alternates: { canonical: `/course/${meta.id}` },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) notFound();
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  return (
    <SectionScope scope={{ id: meta.id, title: copy.title, narration: copy.narration, promise: copy.promise, how: copy.how[0] }}>
      <Reading meta={meta} copy={copy} m={m} locale={locale} />
    </SectionScope>
  );
}
