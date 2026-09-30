import type { Metadata } from "next";
import Link from "next/link";
import { PipelineBuilder } from "@/components/pipeline-builder";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.pipelineTitle,
    description: m.pipelineDeck,
    robots: { index: false, follow: false },
  };
}

export default async function PipelinePage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
        <p className="kicker">{m.pipeline}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.pipelineTitle}</h1>
        <p className="mt-4 max-w-2xl leading-7">{m.pipelineDeck}</p>
        <p className="mt-6">{m.pipelineSignIn}</p>
        <p className="mt-3"><Link className="underline" href="/sign-in">{m.signIn}</Link></p>
      </div>
    );
  }
  return <PipelineBuilder m={m} />;
}
