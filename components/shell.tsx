"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type FocusEvent, type ReactNode } from "react";
import { dirFor, htmlLang, locales, type Locale } from "@/lib/locale";
import type { Messages } from "@/lib/i18n/en";
import {
  addableClockIds,
  clockChoiceLabel,
  clockLimit,
  clockName,
  clockOptions,
  defaultClockIds,
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
  const [now, setNow] = useState<Date | null>(null);
  const options = clockOptions(locale, m.localTime);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    const start = window.setTimeout(() => setNow(new Date()), 0);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(start);
    };
  }, []);

  function chooseClock(value: string) {
    if (value.startsWith("remove:")) {
      const id = value.slice("remove:".length);
      writeClockIds(clockIds.filter((item) => item !== id));
      return;
    }
    if (!value.startsWith("add:")) return;
    const id = value.slice("add:".length);
    if (!id || clockIds.includes(id) || clockIds.length >= clockLimit) return;
    writeClockIds([...clockIds, id]);
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
    ["/csc1033", m.cscNav],
    ["/foundry", m.foundry],
    ["/foundry/pipeline", m.pipeline],
    ["/workshop", m.workshop],
    ["/analytics", m.analytics],
    ["/standing", m.standing],
    ["/dossier", m.dossier],
    ...(isPrivileged ? [["/teach", m.teachNav], ["/admin", m.adminPortal]] : []),
  ] as const;

  return (
    <WordingProvider>
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:bg-paper focus:px-3 focus:py-2" href="#content">
        {m.skip}
      </a>
      <header className="sticky top-0 z-20 overflow-x-clip border-b border-line bg-paper">
        <div className="grid grid-cols-1">
        <div className="overflow-x-auto" onFocus={revealInBar}>
        <div className="flex w-max min-w-full items-center gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-sm tracking-tight" aria-label={m.footer}>
            <Mark />
            <span>Keel</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-4" aria-label={m.menu}>
            {links.map(([href, label]) => {
              const current = navCurrent(pathname, href, links.map(([item]) => item));
              return (
                <Link key={href} href={href} aria-current={current ? "page" : undefined} className={current ? "shrink-0 whitespace-nowrap border-b border-copper text-sm" : "shrink-0 whitespace-nowrap text-sm text-soft"}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden shrink-0 items-end gap-4 xl:flex" aria-label={m.worldClock}>
            {clockIds.map((id) => (
              <Clock key={id} label={clockLabel(id, locale, m)} zone={id === localClockId ? "" : id} now={now} locale={locale} />
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button className="text-sm underline xl:hidden" type="button" onClick={() => setClockOpen((open) => !open)}>
              {clockOpen ? m.collapseClock : m.worldShort}
            </button>
            <ClockMenu clockIds={clockIds} locale={locale} m={m} options={options} onChoose={chooseClock} />
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
        </div>
        </div>
        {clockOpen ? (
          <div className="flex gap-4 overflow-x-auto border-t border-line px-4 py-2 xl:hidden" aria-label={m.worldClock}>
            {clockIds.length === 0 ? <p className="text-sm text-soft">{m.clockEmpty}</p> : null}
            {clockIds.map((id) => (
              <Clock key={id} label={clockLabel(id, locale, m)} zone={id === localClockId ? "" : id} now={now} locale={locale} />
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
      <footer className={`mx-auto flex max-w-6xl items-center justify-between px-4 pt-8 text-sm text-soft ${consentChoice === "essential" || consentChoice === "voice" ? "pb-36" : "pb-8"}`}>
        <span>{m.footer}</span>
        <span className="flex gap-4">
          <Link href="/analytics">{m.analytics}</Link>
          <Link href="/data">{m.privacy}</Link>
          <Link href="/record">{m.record}</Link>
        </span>
      </footer>
      <VoiceDock locale={locale} m={m} scope={scope} consent={Boolean(me?.consent || consentChoice === "voice")} live={Boolean(me?.live)} pinned={consentChoice === "essential" || consentChoice === "voice"} />
      <span className="sr-only">{htmlLang(locale)} {dirFor(locale)}</span>
    </>
    </WordingProvider>
  );
}

function revealInBar(event: FocusEvent<HTMLDivElement>) {
  const scroller = event.currentTarget;
  const item = event.target instanceof HTMLElement ? event.target.closest("a, button, select") : null;
  if (!(item instanceof HTMLElement) || !scroller.contains(item)) return;
  const pad = 12;
  const place = () => {
    const view = scroller.getBoundingClientRect();
    const box = item.getBoundingClientRect();
    if (box.width <= 0 || (box.left >= view.left + pad && box.right <= view.right - pad)) return;
    const delta = box.left < view.left + pad ? box.left - view.left - pad : box.right - view.right + pad;
    scroller.scrollBy({ left: delta });
  };
  place();
  window.requestAnimationFrame(place);
}

function navCurrent(pathname: string, href: string, hrefs: readonly string[]): boolean {
  if (href === "/") return pathname === "/";
  const matched = hrefs.filter((item) => item !== "/" && (pathname === item || pathname.startsWith(`${item}/`)));
  if (!matched.includes(href)) return false;
  return href.length === Math.max(...matched.map((item) => item.length));
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

function ClockMenu({
  clockIds,
  locale,
  m,
  options,
  onChoose,
}: {
  clockIds: readonly string[];
  locale: Locale;
  m: Messages;
  options: { id: string; label: string }[];
  onChoose: (value: string) => void;
}) {
  const [countriesReady, setCountriesReady] = useState(false);
  useEffect(() => {
    // Region names differ between this server and the browser. Fill the list after mount.
    setCountriesReady(true);
  }, []);
  const available = addableClockIds(clockIds, options.map((item) => item.id));
  const countryById = new Map(options.map((item) => [item.id, item.label]));
  return (
    <select
      className="max-w-36 bg-transparent text-sm"
      aria-label={m.clockMenu}
      value=""
      onChange={(event) => onChoose(event.target.value)}
    >
      <option value="">{m.clockMenu}</option>
      {clockIds.length > 0 ? (
        <optgroup label={m.clockRemove}>
          {clockIds.map((id) => (
            <option key={`remove:${id}`} value={`remove:${id}`}>{clockLabel(id, locale, m)}</option>
          ))}
        </optgroup>
      ) : null}
      {countriesReady && clockIds.length < clockLimit && available.length > 0 ? (
        <optgroup label={m.clockAdd}>
          {available.map((id) => (
            <option key={`add:${id}`} value={`add:${id}`}>
              {clockChoiceLabel(clockLabel(id, locale, m), countryById.get(id) ?? clockName(id, locale))}
            </option>
          ))}
        </optgroup>
      ) : null}
    </select>
  );
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
    <p className="min-w-16 shrink-0">
      <span className="kicker block whitespace-nowrap">{label}</span>
      <span className="num text-sm" suppressHydrationWarning>{time}</span>
    </p>
  );
}

export function signOut() {
  return authClient.signOut();
}
