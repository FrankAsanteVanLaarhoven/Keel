import type { Locale } from "../locale";
import { en, type Messages } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { pt } from "./pt";
import { zh } from "./zh";
import { ja } from "./ja";
import { ar } from "./ar";

export const messages: Record<Locale, Messages> = { en, es, fr, de, pt, zh, ja, ar };

export function t(locale: Locale): Messages {
  return messages[locale];
}
