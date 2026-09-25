"use client";

import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";

export function Marks({ id, m, minutes }: { id: string; m: Messages; minutes: number }) {
  const { me } = useKeel();
  const row = me?.progress?.[id];
  return (
    <p className="text-sm text-soft">
      <span className="num">{minutes} {m.minutes}</span>
      <span className="ms-3">{row?.check ? "●" : "○"} {m.check}</span>
      <span className="ms-3">{row?.bench ? "●" : "○"} {m.bench}</span>
      <span className="ms-3">{row?.case ? "●" : "○"} {m.capstone}</span>
    </p>
  );
}
