"use client";

import Link from "next/link";
import { sections } from "@/lib/course/meta";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";

export function ContinueLink({ m }: { m: Messages }) {
  const { me } = useKeel();
  const next = sections.find((section) => !me?.progress?.[section.id]?.check);
  const href = me?.brief ? "/record" : me && me.cases === 11 ? "/brief" : `/course/${next?.id ?? "tools"}`;
  return (
    <Link className="border border-ink bg-ink px-4 py-2 text-sm text-paper" href={href}>
      {me?.signedIn && next ? m.continue : m.begin}
    </Link>
  );
}
