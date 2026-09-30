"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { dirFor, htmlLang, locales, type Locale } from "@/lib/locale";
import type { Messages } from "@/lib/i18n/en";
import {
  clockLimit,
  clockName,
  clockOptions,
  defaultClockIds,
  findClocks,
  localClockId,
  readClockSnapshot,
  subscribeClocks,
  writeClockIds,
} from "@/lib/clocks";
import { Mark } from "./mark";
import { KeelState, useKeel, type Scope } from "./keel-context";
import { VoiceDock } from "./voice-dock";
import { CharacterBackdrop } from "./character-backdrop";
import { WordingProvider, WordingSelect } from "./wording";
import { authClient } from "@/lib/auth-client";

const languageNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ar: "العربية",
};

export function Shell({ locale, m, programme, children }: { locale: Locale; m: Messages; programme: Scope; children: ReactNode }) {
  return (
    <KeelState initial={programme}>
      <Frame locale={locale} m={m}>
        {children}
      </Frame>
    </KeelState>
  );
}

function Frame({ locale, m, children }: { locale: Locale; m: Messages; children: ReactNode }) {
  const pathname = usePathname();
  const { me, scope, refresh } = useKeel();
  const consentChoice = useSyncExternalStore(subscribeConsent, readConsent, () => "wait");
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "system");
  const clockIds = useSyncExternalStore(subscribeClocks, readClockSnapshot, () => defaultClockIds);
  const [clockOpen, setClockOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [picked, setPicked] = useState("");
  const [notice, setNotice] = useState<{ tone: "alert" | "status"; text: string } | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const options = clockOptions(locale, m.localTime);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    const start = window.setTimeout(() => setNow(new Date()), 0);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(start);
    };
  }, []);

  useEffect(() => {
    if (addOpen) countryRef.current?.focus();
  }, [addOpen]);

  function removeClock(id: string) {
    writeClockIds(clockIds.filter((item) => item !== id));
    setNotice(null);
  }

  function addClock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const typed = countryRef.current?.value ?? "";
    let resolved = "";
    if (picked) {
      resolved = picked;
    } else {
      const query = typed.normalize("NFKC").trim().toLowerCase();
      if (!query) {
        setNotice({ tone: "alert", text: m.clockNone });
        return;
      }
      if (query === "local" || query === m.localTime.normalize("NFKC").trim().toLowerCase()) {
        resolved = localClockId;
      } else {
        const hits = findClocks(typed, locale);
        if (hits.length === 0) {
          setNotice({ tone: "alert", text: m.clockNone });
          return;
        }
        if (hits.length > 1) {
          setNotice({ tone: "alert", text: m.clockMany });
          return;
        }
        resolved = hits[0] ?? "";
      }
    }
    if (!resolved) {
      setNotice({ tone: "alert", text: m.clockNone });
      return;
    }
    if (clockIds.includes(resolved)) {
      setNotice({ tone: "alert", text: m.clockHave });
      return;
    }
    if (clockIds.length >= clockLimit) {
      setNotice({ tone: "alert", text: m.clockFull });
      return;
    }
    writeClockIds([...clockIds, resolved]);
    if (countryRef.current) countryRef.current.value = "";
    setPicked("");
    setNotice({ tone: "status", text: m.savedName });
  }

  function chooseTheme(value: string) {
    document.documentElement.dataset.theme = value;
    localStorage.setItem("keel.theme", value);
    window.dispatchEvent(new Event("keel-theme"));
  }

  function chooseLocale(value: string) {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `keel_locale=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    location.assign(pathname || "/");
  }

  async function chooseConsent(voice: boolean) {
    localStorage.setItem("keel.consent", voice ? "voice" : "essential");
    window.dispatchEvent(new Event("keel-consent"));
    if (me?.signedIn) {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ voice }),
      });
      await refresh();
    }
  }

  const isPrivileged = me?.role === "super_admin" || me?.role === "staff";
  const links = [
    ["/", m.programme],
    ["/course", m.cases],
    ["/term", m.termNav],
    ["/ops", m.opsNav],
    ["/foundry", m.foundry],
    ["/workshop", m.workshop],
    ["/analytics", m.analytics],
    ["/standing", m.standing],
    ["/dossier", m.dossier],
    ...(isPrivileged ? [["/teach", m.teachNav], ["/admin", m.adminPortal]] : []),
  ] as const;

  return (
    <WordingProvider>
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-paper focus:px-3 focus:py-2" href="#content">
        {m.skip}
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-sm tracking-tight" aria-label={m.footer}>
            <Mark />
            <span>Keel</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex" aria-label={m.menu}>
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={navCurrent(pathname, href) ? "border-b border-copper text-sm" : "text-sm text-soft"}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="ms-auto hidden max-w-xl flex-wrap items-end justify-end gap-2 lg:flex" aria-label={m.worldClock}>
            {clockIds.length === 0 ? <p className="text-sm text-soft">{m.clockEmpty}</p> : null}
            {clockIds.map((id) => (
              <Clock
                key={id}
                label={clockLabel(id, locale, m)}
                zone={id === localClockId ? "" : id}
                now={now}
                locale={locale}
                removeLabel={m.clockRemove}
                onRemove={() => removeClock(id)}
              />
            ))}
            <button
              className="mb-1 min-h-11 text-sm underline"
              type="button"
              aria-expanded={addOpen}
              aria-controls="clock-form"
              onClick={() => setAddOpen((open) => !open)}
            >
              {m.clockAdd}
            </button>
          </div>
          <div className="ms-auto flex items-center gap-2 lg:ms-4">
            <button className="text-sm underline lg:hidden" type="button" onClick={() => setClockOpen((open) => !open)}>
              {clockOpen ? m.collapseClock : m.worldShort}
            </button>
            <label className="sr-only" htmlFor="language">{m.language}</label>
            <select id="language" className="bg-transparent text-sm" value={locale} onChange={(event) => chooseLocale(event.target.value)} aria-label={m.language}>
              {locales.map((item) => (
                <option key={item} value={item}>{languageNames[item]}</option>
              ))}
            </select>
            <WordingSelect label={m.wordingLabel} industry={m.wordingIndustry} plain={m.wordingPlain} expand={m.wordingExpand} />
            <label className="sr-only" htmlFor="theme">{m.theme}</label>
            <select id="theme" className="bg-transparent text-sm" value={theme} onChange={(event) => chooseTheme(event.target.value)} aria-label={m.theme}>
              <option value="system">{m.themeSystem}</option>
              <option value="light">{m.themeLight}</option>
              <option value="dark">{m.themeDark}</option>
            </select>
            {me?.signedIn ? (
              <div className="flex items-center gap-1.5">
                <Link className="max-w-28 truncate text-sm" href="/account">{me.name}</Link>
                {isPrivileged && (
                  <Link
                    href="/admin"
                    className="rounded bg-copper/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-copper hover:bg-copper/20"
                    title="Super Admin & Teacher Evaluation Portal"
                  >
                    Admin
                  </Link>
                )}
              </div>
            ) : me ? (
              <Link className="text-sm" href="/sign-in">{m.signIn}</Link>
            ) : (
              <span className="text-sm text-soft">{m.opening}</span>
            )}
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-4 pb-3 md:hidden" aria-label={m.menu}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={navCurrent(pathname, href) ? "border-b border-copper text-sm whitespace-nowrap" : "text-sm whitespace-nowrap text-soft"}>
              {label}
            </Link>
          ))}
        </nav>
        {clockOpen ? (
          <div className="flex items-end gap-3 overflow-x-auto border-t border-line px-4 py-2 lg:hidden">
            {clockIds.length === 0 ? <p className="text-sm text-soft">{m.clockEmpty}</p> : null}
            {clockIds.map((id) => (
              <Clock
                key={id}
                label={clockLabel(id, locale, m)}
                zone={id === localClockId ? "" : id}
                now={now}
                locale={locale}
                removeLabel={m.clockRemove}
                onRemove={() => removeClock(id)}
              />
            ))}
            <button
              className="mb-1 min-h-11 shrink-0 text-sm underline"
              type="button"
              aria-expanded={addOpen}
              aria-controls="clock-form"
              onClick={() => setAddOpen((open) => !open)}
            >
              {m.clockAdd}
            </button>
          </div>
        ) : null}
        {addOpen ? (
          <form id="clock-form" className="border-t border-line px-4 py-3" onSubmit={addClock}>
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-end">
              <label className="block min-w-0 flex-1 text-sm" htmlFor="clock-type">
                <span className="kicker block">{m.clockType}</span>
                <input
                  ref={countryRef}
                  id="clock-type"
                  className="mt-1 w-full border border-line bg-raised px-2 py-2 text-sm"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </label>
              <label className="block min-w-0 flex-1 text-sm" htmlFor="clock-country">
                <span className="kicker block">{m.clockCountry}</span>
                <select
                  id="clock-country"
                  className="mt-1 w-full border border-line bg-raised px-2 py-2 text-sm"
                  value={picked}
                  onChange={(event) => setPicked(event.target.value)}
                >
                  <option value="">{m.clockChoose}</option>
                  {options.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
              <button className="min-h-11 border border-ink bg-ink px-3 py-2 text-sm text-paper" type="submit">{m.clockAdd}</button>
            </div>
            {notice ? (
              <p className="mx-auto mt-2 max-w-6xl text-sm" role={notice.tone}>{notice.text}</p>
            ) : null}
          </form>
        ) : null}
      </header>
      {consentChoice === null ? (
        <div className="border-b border-line bg-raised">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="kicker">{m.cookieTitle}</p>
              <p className="mt-2 max-w-3xl text-sm leading-6">{m.cookieBody}</p>
            </div>
            <div className="flex gap-2">
              <button className="border border-line px-3 py-2 text-sm" type="button" onClick={() => void chooseConsent(false)}>{m.essentialOnly}</button>
              <button className="border border-ink bg-ink px-3 py-2 text-sm text-paper" type="button" onClick={() => void chooseConsent(true)}>{m.allowVoice}</button>
            </div>
          </div>
        </div>
      ) : null}
      <CharacterBackdrop />
      <main id="content" className="relative z-10">{children}</main>
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 pb-36 text-sm text-soft">
        <span>{m.footer}</span>
        <span className="flex gap-4">
          <Link href="/analytics">{m.analytics}</Link>
          <Link href="/data">{m.privacy}</Link>
          <Link href="/record">{m.record}</Link>
        </span>
      </footer>
      <VoiceDock locale={locale} m={m} scope={scope} consent={Boolean(me?.consent || consentChoice === "voice")} live={Boolean(me?.live)} />
      <span className="sr-only">{htmlLang(locale)} {dirFor(locale)}</span>
    </>
    </WordingProvider>
  );
}

function navCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeConsent(listener: () => void) {
  window.addEventListener("keel-consent", listener);
  return () => window.removeEventListener("keel-consent", listener);
}

function readConsent() {
  return localStorage.getItem("keel.consent");
}

function subscribeTheme(listener: () => void) {
  window.addEventListener("keel-theme", listener);
  return () => window.removeEventListener("keel-theme", listener);
}

function readTheme() {
  return document.documentElement.dataset.theme || "system";
}

function clockLabel(id: string, locale: Locale, m: Messages): string {
  if (id === localClockId) return m.localTime;
  if (id === "Europe/London") return m.cityLondon;
  if (id === "America/New_York") return m.cityNewYork;
  if (id === "Africa/Lagos") return m.cityLagos;
  if (id === "Asia/Tokyo") return m.cityTokyo;
  return clockName(id, locale);
}

function Clock({
  label,
  zone,
  now,
  locale,
  removeLabel,
  onRemove,
}: {
  label: string;
  zone: string;
  now: Date | null;
  locale: Locale;
  removeLabel: string;
  onRemove: () => void;
}) {
  const time = now
    ? new Intl.DateTimeFormat(htmlLang(locale), {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: zone || undefined,
      }).format(now)
    : "––:––:––";
  return (
    <div className="flex items-end">
      <p className="min-w-16">
        <span className="kicker block">{label}</span>
        <span className="num text-sm" suppressHydrationWarning>{time}</span>
      </p>
      <button className="min-h-11 min-w-11 text-sm text-soft" type="button" aria-label={`${removeLabel} ${label}`} onClick={onRemove}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

export function signOut() {
  return authClient.signOut();
}
