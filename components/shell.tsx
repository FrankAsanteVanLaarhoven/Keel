"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { dirFor, htmlLang, locales, type Locale } from "@/lib/locale";
import type { Messages } from "@/lib/i18n/en";
import { Mark } from "./mark";
import { KeelState, useKeel, type Scope } from "./keel-context";
import { VoiceDock } from "./voice-dock";
import { CharacterBackdrop } from "./character-backdrop";
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

const zones = [
  { key: "localTime" as const, zone: "" },
  { key: "cityLondon" as const, zone: "Europe/London" },
  { key: "cityNewYork" as const, zone: "America/New_York" },
  { key: "cityLagos" as const, zone: "Africa/Lagos" },
  { key: "cityTokyo" as const, zone: "Asia/Tokyo" },
];

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
  const [clockOpen, setClockOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    const start = window.setTimeout(() => setNow(new Date()), 0);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(start);
    };
  }, []);

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

  const links = [
    ["/", m.programme],
    ["/course", m.cases],
    ["/foundry", m.foundry],
    ["/standing", m.standing],
    ["/dossier", m.dossier],
  ] as const;

  return (
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
              <Link key={href} href={href} className={pathname === href ? "border-b border-copper text-sm" : "text-sm text-soft"}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="ms-auto hidden items-end gap-4 lg:flex" aria-label={m.worldClock}>
            {zones.map((item) => (
              <Clock key={item.key} label={m[item.key]} zone={item.zone} now={now} locale={locale} />
            ))}
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
            <label className="sr-only" htmlFor="theme">{m.theme}</label>
            <select id="theme" className="bg-transparent text-sm" value={theme} onChange={(event) => chooseTheme(event.target.value)} aria-label={m.theme}>
              <option value="system">{m.themeSystem}</option>
              <option value="light">{m.themeLight}</option>
              <option value="dark">{m.themeDark}</option>
            </select>
            {me?.signedIn ? (
              <Link className="max-w-32 truncate text-sm" href="/account">{me.name}</Link>
            ) : me ? (
              <Link className="text-sm" href="/sign-in">{m.signIn}</Link>
            ) : (
              <span className="text-sm text-soft">{m.opening}</span>
            )}
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-4 pb-3 md:hidden" aria-label={m.menu}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? "border-b border-copper text-sm whitespace-nowrap" : "text-sm whitespace-nowrap text-soft"}>
              {label}
            </Link>
          ))}
        </nav>
        {clockOpen ? (
          <div className="flex gap-4 overflow-x-auto border-t border-line px-4 py-2 lg:hidden">
            {zones.map((item) => (
              <Clock key={item.key} label={m[item.key]} zone={item.zone} now={now} locale={locale} />
            ))}
          </div>
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
          <Link href="/data">{m.privacy}</Link>
          <Link href="/record">{m.record}</Link>
        </span>
      </footer>
      <VoiceDock locale={locale} m={m} scope={scope} consent={Boolean(me?.consent || consentChoice === "voice")} live={Boolean(me?.live)} />
      <span className="sr-only">{htmlLang(locale)} {dirFor(locale)}</span>
    </>
  );
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

function Clock({ label, zone, now, locale }: { label: string; zone: string; now: Date | null; locale: Locale }) {
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
    <p className="min-w-16">
      <span className="kicker block">{label}</span>
      <span className="num text-sm" suppressHydrationWarning>{time}</span>
    </p>
  );
}

export function signOut() {
  return authClient.signOut();
}
