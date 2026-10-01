import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { headers } from "next/headers";
import { dirFor, htmlLang } from "@/lib/locale";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { Shell } from "@/components/shell";
import { publicOrigin } from "@/lib/public-origin";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const boot = `(function(){try{var t=localStorage.getItem("keel.theme")||"system";if(t!=="light"&&t!=="dark"&&t!=="system")t="system";document.documentElement.dataset.theme=t;}catch(e){}})();`;

const baseURL = publicOrigin();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    metadataBase: new URL(baseURL),
    title: {
      default: m.metaTitle,
      template: `%s · ${m.footer}`,
    },
    description: m.metaDescription,
    applicationName: "Keel",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
    },
    openGraph: {
      title: m.metaTitle,
      description: m.metaDescription,
      url: "/",
      siteName: "Keel",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.metaTitle,
      description: m.metaDescription,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await resolveLocale();
  const m = t(locale);
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const programme = {
    id: "programme",
    title: m.homeTitle,
    narration: m.programmeNarration,
    promise: m.homeDeck,
    how: m.about1,
  };
  return (
    <html lang={htmlLang(locale)} dir={dirFor(locale)} data-theme="system" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: boot }} />
        <Shell locale={locale} m={m} programme={programme}>
          {children}
        </Shell>
      </body>
    </html>
  );
}

