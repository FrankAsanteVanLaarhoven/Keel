import { cookies, headers } from "next/headers";
import { isLocale, matchAccept, type Locale } from "../locale";

export async function resolveLocale(): Promise<Locale> {
  const jar = await cookies();
  const chosen = jar.get("keel_locale")?.value;
  if (isLocale(chosen)) return chosen;
  return matchAccept((await headers()).get("accept-language") ?? "");
}
