"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

export type Scope = { id: string; title: string; narration: string; promise: string; how: string };

export type Me = {
  signedIn: boolean;
  live: boolean;
  name?: string;
  email?: string;
  role?: "staff" | "student";
  consent?: boolean;
  xp?: number;
  cases?: number;
  streak?: number;
  marks?: string[];
  progress?: Record<string, { check: boolean; bench: boolean; case: boolean }>;
  brief?: boolean;
  likes: Record<string, { count: number; mine: boolean }>;
};

type KeelValue = {
  me: Me | null;
  refresh: () => Promise<void>;
  scope: Scope;
  setScope: (scope: Scope) => void;
};

const KeelContext = createContext<KeelValue | null>(null);

let currentScope: Scope = { id: "programme", title: "", narration: "", promise: "", how: "" };
const scopeListeners = new Set<() => void>();

export function publishScope(scope: Scope) {
  currentScope = scope;
  scopeListeners.forEach((listener) => listener());
}

function subscribeScope(listener: () => void) {
  scopeListeners.add(listener);
  return () => scopeListeners.delete(listener);
}

export function usePublishedScope(initial: Scope) {
  return useSyncExternalStore(subscribeScope, () => currentScope, () => initial);
}

export function KeelState({ children, initial }: { children: ReactNode; initial: Scope }) {
  const [me, setMe] = useState<Me | null>(null);
  const scope = usePublishedScope(initial);
  const pathname = usePathname();
  async function refresh() {
    const response = await fetch("/api/me", { cache: "no-store" });
    if (response.ok) setMe((await response.json()) as Me);
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/me", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: Me | null) => {
        if (data) setMe(data);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [pathname]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return <KeelContext.Provider value={{ me, refresh, scope, setScope: publishScope }}>{children}</KeelContext.Provider>;
}

export function useKeel() {
  const value = useContext(KeelContext);
  if (!value) throw new Error("Keel");
  return value;
}

export function SectionScope({ scope, children }: { scope: Scope; children: ReactNode }) {
  useEffect(() => {
    publishScope(scope);
  }, [scope]);
  return children;
}
