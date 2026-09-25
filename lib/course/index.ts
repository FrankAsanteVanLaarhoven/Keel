import type { Locale } from "../locale";
import { ar } from "./ar";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ja } from "./ja";
import { pt } from "./pt";
import type { Pack } from "./types";
import { zh } from "./zh";

const packs: Record<Locale, Pack> = { en, es, fr, de, pt, zh, ja, ar };

export function getPack(locale: Locale): Pack {
  return packs[locale];
}
