import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.dataTitle,
    description: m.dataIntro,
    alternates: { canonical: "/data" },
  };
}

export default async function DataPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const blocks = [m.dataIntro, m.dataSession, m.dataLanguage, m.dataTheme, m.dataCache, m.dataVoice, m.dataLikes, m.dataBoard, m.dataCases, m.dataFiles, m.dataStore, m.dataDelete];
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="kicker">{m.privacy}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.dataTitle}</h1>
      {blocks.map((block) => (
        <p key={block} className="mt-5 leading-8">{block}</p>
      ))}
    </div>
  );
}
