export const locales = ["en", "es", "fr", "de", "pt", "zh", "ja", "ar"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function htmlLang(locale: Locale): string {
  if (locale === "zh") return "zh-Hans";
  if (locale === "pt") return "pt";
  return locale;
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

const bases: Record<string, Locale> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  zh: "zh",
  ja: "ja",
  ar: "ar",
};

export function matchAccept(header: string): Locale {
  const parts = header.split(",").map((part) => part.split(";")[0]?.trim().toLowerCase() ?? "");
  for (const part of parts) {
    if (!part) continue;
    const base = part.split("-")[0] ?? "";
    const locale = bases[base];
    if (locale) return locale;
  }
  return "en";
}

export function voiceLanguage(locale: Locale): string {
  switch (locale) {
    case "es":
      return "es-MX";
    case "pt":
      return "pt-BR";
    case "ar":
      return "ar-SA";
    default:
      return locale;
  }
}

export function speechLang(locale: Locale): string {
  switch (locale) {
    case "en":
      return "en-GB";
    case "es":
      return "es-ES";
    case "pt":
      return "pt-BR";
    case "zh":
      return "zh-CN";
    case "ar":
      return "ar-SA";
    default:
      return locale;
  }
}
