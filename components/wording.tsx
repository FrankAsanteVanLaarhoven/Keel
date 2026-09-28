"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { wordingText, type WordingMode } from "@/lib/glossary";

const WordingContext = createContext<{ mode: WordingMode; setMode: (mode: WordingMode) => void }>({
  mode: "industry",
  setMode: () => undefined,
});

export function WordingProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<WordingMode>("industry");
  useEffect(() => {
    const saved = window.localStorage.getItem("keel.wording");
    if (saved === "plain" || saved === "expand" || saved === "industry") setMode(saved);
  }, []);
  function choose(next: WordingMode) {
    setMode(next);
    window.localStorage.setItem("keel.wording", next);
  }
  return <WordingContext.Provider value={{ mode, setMode: choose }}>{children}</WordingContext.Provider>;
}

export function useWording(): WordingMode {
  return useContext(WordingContext).mode;
}

export function useSetWording(): (mode: WordingMode) => void {
  return useContext(WordingContext).setMode;
}

export function Shown({ text }: { text: string }) {
  const mode = useWording();
  return <>{wordingText(text, mode)}</>;
}

export function WordingSelect({ label, industry, plain, expand }: { label: string; industry: string; plain: string; expand: string }) {
  const mode = useWording();
  const setMode = useSetWording();
  return (
    <select className="bg-transparent text-sm" aria-label={label} value={mode} onChange={(event) => setMode(event.target.value as WordingMode)}>
      <option value="industry">{industry}</option>
      <option value="plain">{plain}</option>
      <option value="expand">{expand}</option>
    </select>
  );
}
