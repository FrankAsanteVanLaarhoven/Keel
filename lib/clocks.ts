import { htmlLang, isLocale } from "./locale";

export const clockStorageKey = "keel.clocks";
export const localClockId = "local";
export const clockLimit = 8;
export const defaultClockIds = [
  localClockId,
  "Europe/London",
  "America/New_York",
  "Africa/Lagos",
  "Asia/Tokyo",
] as const;

export type ClockPlace = { region: string; zone: string };

/** One capital zone for most countries. A few large countries keep more than one zone. */
export const clockPlaces: readonly ClockPlace[] = [
  { region: "AF", zone: "Asia/Kabul" },
  { region: "AL", zone: "Europe/Tirane" },
  { region: "DZ", zone: "Africa/Algiers" },
  { region: "AD", zone: "Europe/Andorra" },
  { region: "AO", zone: "Africa/Luanda" },
  { region: "AG", zone: "America/Antigua" },
  { region: "AR", zone: "America/Argentina/Buenos_Aires" },
  { region: "AM", zone: "Asia/Yerevan" },
  { region: "AU", zone: "Australia/Sydney" },
  { region: "AU", zone: "Australia/Adelaide" },
  { region: "AU", zone: "Australia/Perth" },
  { region: "AT", zone: "Europe/Vienna" },
  { region: "AZ", zone: "Asia/Baku" },
  { region: "BS", zone: "America/Nassau" },
  { region: "BH", zone: "Asia/Bahrain" },
  { region: "BD", zone: "Asia/Dhaka" },
  { region: "BB", zone: "America/Barbados" },
  { region: "BY", zone: "Europe/Minsk" },
  { region: "BE", zone: "Europe/Brussels" },
  { region: "BZ", zone: "America/Belize" },
  { region: "BJ", zone: "Africa/Porto-Novo" },
  { region: "BT", zone: "Asia/Thimphu" },
  { region: "BO", zone: "America/La_Paz" },
  { region: "BA", zone: "Europe/Sarajevo" },
  { region: "BW", zone: "Africa/Gaborone" },
  { region: "BR", zone: "America/Sao_Paulo" },
  { region: "BR", zone: "America/Manaus" },
  { region: "BN", zone: "Asia/Brunei" },
  { region: "BG", zone: "Europe/Sofia" },
  { region: "BF", zone: "Africa/Ouagadougou" },
  { region: "BI", zone: "Africa/Bujumbura" },
  { region: "CV", zone: "Atlantic/Cape_Verde" },
  { region: "KH", zone: "Asia/Phnom_Penh" },
  { region: "CM", zone: "Africa/Douala" },
  { region: "CA", zone: "America/Toronto" },
  { region: "CA", zone: "America/Vancouver" },
  { region: "CF", zone: "Africa/Bangui" },
  { region: "TD", zone: "Africa/Ndjamena" },
  { region: "CL", zone: "America/Santiago" },
  { region: "CN", zone: "Asia/Shanghai" },
  { region: "CO", zone: "America/Bogota" },
  { region: "KM", zone: "Indian/Comoro" },
  { region: "CG", zone: "Africa/Brazzaville" },
  { region: "CD", zone: "Africa/Kinshasa" },
  { region: "CR", zone: "America/Costa_Rica" },
  { region: "CI", zone: "Africa/Abidjan" },
  { region: "HR", zone: "Europe/Zagreb" },
  { region: "CU", zone: "America/Havana" },
  { region: "CY", zone: "Asia/Nicosia" },
  { region: "CZ", zone: "Europe/Prague" },
  { region: "DK", zone: "Europe/Copenhagen" },
  { region: "DJ", zone: "Africa/Djibouti" },
  { region: "DM", zone: "America/Dominica" },
  { region: "DO", zone: "America/Santo_Domingo" },
  { region: "EC", zone: "America/Guayaquil" },
  { region: "EG", zone: "Africa/Cairo" },
  { region: "SV", zone: "America/El_Salvador" },
  { region: "GQ", zone: "Africa/Malabo" },
  { region: "ER", zone: "Africa/Asmara" },
  { region: "EE", zone: "Europe/Tallinn" },
  { region: "SZ", zone: "Africa/Mbabane" },
  { region: "ET", zone: "Africa/Addis_Ababa" },
  { region: "FJ", zone: "Pacific/Fiji" },
  { region: "FI", zone: "Europe/Helsinki" },
  { region: "FR", zone: "Europe/Paris" },
  { region: "GA", zone: "Africa/Libreville" },
  { region: "GM", zone: "Africa/Banjul" },
  { region: "GE", zone: "Asia/Tbilisi" },
  { region: "DE", zone: "Europe/Berlin" },
  { region: "GH", zone: "Africa/Accra" },
  { region: "GR", zone: "Europe/Athens" },
  { region: "GD", zone: "America/Grenada" },
  { region: "GT", zone: "America/Guatemala" },
  { region: "GN", zone: "Africa/Conakry" },
  { region: "GW", zone: "Africa/Bissau" },
  { region: "GY", zone: "America/Guyana" },
  { region: "HT", zone: "America/Port-au-Prince" },
  { region: "HN", zone: "America/Tegucigalpa" },
  { region: "HK", zone: "Asia/Hong_Kong" },
  { region: "HU", zone: "Europe/Budapest" },
  { region: "IS", zone: "Atlantic/Reykjavik" },
  { region: "IN", zone: "Asia/Kolkata" },
  { region: "ID", zone: "Asia/Jakarta" },
  { region: "IR", zone: "Asia/Tehran" },
  { region: "IQ", zone: "Asia/Baghdad" },
  { region: "IE", zone: "Europe/Dublin" },
  { region: "IL", zone: "Asia/Jerusalem" },
  { region: "IT", zone: "Europe/Rome" },
  { region: "JM", zone: "America/Jamaica" },
  { region: "JP", zone: "Asia/Tokyo" },
  { region: "JO", zone: "Asia/Amman" },
  { region: "KZ", zone: "Asia/Almaty" },
  { region: "KE", zone: "Africa/Nairobi" },
  { region: "KI", zone: "Pacific/Tarawa" },
  { region: "KW", zone: "Asia/Kuwait" },
  { region: "KG", zone: "Asia/Bishkek" },
  { region: "LA", zone: "Asia/Vientiane" },
  { region: "LV", zone: "Europe/Riga" },
  { region: "LB", zone: "Asia/Beirut" },
  { region: "LS", zone: "Africa/Maseru" },
  { region: "LR", zone: "Africa/Monrovia" },
  { region: "LY", zone: "Africa/Tripoli" },
  { region: "LI", zone: "Europe/Vaduz" },
  { region: "LT", zone: "Europe/Vilnius" },
  { region: "LU", zone: "Europe/Luxembourg" },
  { region: "MO", zone: "Asia/Macau" },
  { region: "MG", zone: "Indian/Antananarivo" },
  { region: "MW", zone: "Africa/Blantyre" },
  { region: "MY", zone: "Asia/Kuala_Lumpur" },
  { region: "MV", zone: "Indian/Maldives" },
  { region: "ML", zone: "Africa/Bamako" },
  { region: "MT", zone: "Europe/Malta" },
  { region: "MH", zone: "Pacific/Majuro" },
  { region: "MR", zone: "Africa/Nouakchott" },
  { region: "MU", zone: "Indian/Mauritius" },
  { region: "MX", zone: "America/Mexico_City" },
  { region: "FM", zone: "Pacific/Pohnpei" },
  { region: "MD", zone: "Europe/Chisinau" },
  { region: "MC", zone: "Europe/Monaco" },
  { region: "MN", zone: "Asia/Ulaanbaatar" },
  { region: "ME", zone: "Europe/Podgorica" },
  { region: "MA", zone: "Africa/Casablanca" },
  { region: "MZ", zone: "Africa/Maputo" },
  { region: "MM", zone: "Asia/Yangon" },
  { region: "NA", zone: "Africa/Windhoek" },
  { region: "NR", zone: "Pacific/Nauru" },
  { region: "NP", zone: "Asia/Kathmandu" },
  { region: "NL", zone: "Europe/Amsterdam" },
  { region: "NZ", zone: "Pacific/Auckland" },
  { region: "NI", zone: "America/Managua" },
  { region: "NE", zone: "Africa/Niamey" },
  { region: "NG", zone: "Africa/Lagos" },
  { region: "KP", zone: "Asia/Pyongyang" },
  { region: "MK", zone: "Europe/Skopje" },
  { region: "NO", zone: "Europe/Oslo" },
  { region: "OM", zone: "Asia/Muscat" },
  { region: "PK", zone: "Asia/Karachi" },
  { region: "PW", zone: "Pacific/Palau" },
  { region: "PS", zone: "Asia/Gaza" },
  { region: "PA", zone: "America/Panama" },
  { region: "PG", zone: "Pacific/Port_Moresby" },
  { region: "PY", zone: "America/Asuncion" },
  { region: "PE", zone: "America/Lima" },
  { region: "PH", zone: "Asia/Manila" },
  { region: "PL", zone: "Europe/Warsaw" },
  { region: "PT", zone: "Europe/Lisbon" },
  { region: "QA", zone: "Asia/Qatar" },
  { region: "RO", zone: "Europe/Bucharest" },
  { region: "RU", zone: "Europe/Moscow" },
  { region: "RU", zone: "Asia/Vladivostok" },
  { region: "RW", zone: "Africa/Kigali" },
  { region: "KN", zone: "America/St_Kitts" },
  { region: "LC", zone: "America/St_Lucia" },
  { region: "VC", zone: "America/St_Vincent" },
  { region: "WS", zone: "Pacific/Apia" },
  { region: "SM", zone: "Europe/San_Marino" },
  { region: "ST", zone: "Africa/Sao_Tome" },
  { region: "SA", zone: "Asia/Riyadh" },
  { region: "SN", zone: "Africa/Dakar" },
  { region: "RS", zone: "Europe/Belgrade" },
  { region: "SC", zone: "Indian/Mahe" },
  { region: "SL", zone: "Africa/Freetown" },
  { region: "SG", zone: "Asia/Singapore" },
  { region: "SK", zone: "Europe/Bratislava" },
  { region: "SI", zone: "Europe/Ljubljana" },
  { region: "SB", zone: "Pacific/Guadalcanal" },
  { region: "SO", zone: "Africa/Mogadishu" },
  { region: "ZA", zone: "Africa/Johannesburg" },
  { region: "KR", zone: "Asia/Seoul" },
  { region: "SS", zone: "Africa/Juba" },
  { region: "ES", zone: "Europe/Madrid" },
  { region: "LK", zone: "Asia/Colombo" },
  { region: "SD", zone: "Africa/Khartoum" },
  { region: "SR", zone: "America/Paramaribo" },
  { region: "SE", zone: "Europe/Stockholm" },
  { region: "CH", zone: "Europe/Zurich" },
  { region: "SY", zone: "Asia/Damascus" },
  { region: "TW", zone: "Asia/Taipei" },
  { region: "TJ", zone: "Asia/Dushanbe" },
  { region: "TZ", zone: "Africa/Dar_es_Salaam" },
  { region: "TH", zone: "Asia/Bangkok" },
  { region: "TL", zone: "Asia/Dili" },
  { region: "TG", zone: "Africa/Lome" },
  { region: "TO", zone: "Pacific/Tongatapu" },
  { region: "TT", zone: "America/Port_of_Spain" },
  { region: "TN", zone: "Africa/Tunis" },
  { region: "TR", zone: "Europe/Istanbul" },
  { region: "TM", zone: "Asia/Ashgabat" },
  { region: "TV", zone: "Pacific/Funafuti" },
  { region: "UG", zone: "Africa/Kampala" },
  { region: "UA", zone: "Europe/Kyiv" },
  { region: "AE", zone: "Asia/Dubai" },
  { region: "GB", zone: "Europe/London" },
  { region: "US", zone: "America/New_York" },
  { region: "US", zone: "America/Chicago" },
  { region: "US", zone: "America/Denver" },
  { region: "US", zone: "America/Los_Angeles" },
  { region: "UY", zone: "America/Montevideo" },
  { region: "UZ", zone: "Asia/Tashkent" },
  { region: "VU", zone: "Pacific/Efate" },
  { region: "VA", zone: "Europe/Vatican" },
  { region: "VE", zone: "America/Caracas" },
  { region: "VN", zone: "Asia/Ho_Chi_Minh" },
  { region: "YE", zone: "Asia/Aden" },
  { region: "ZM", zone: "Africa/Lusaka" },
  { region: "ZW", zone: "Africa/Harare" },
  { region: "GL", zone: "America/Nuuk" },
];

const knownClockIds = new Set<string>([localClockId, ...clockPlaces.map((place) => place.zone)]);
const regionNames = new Map<string, Intl.DisplayNames>();

function localeTag(locale: string): string {
  return isLocale(locale) ? htmlLang(locale) : locale;
}

function regions(locale: string): Intl.DisplayNames {
  const tag = localeTag(locale);
  const cached = regionNames.get(tag);
  if (cached) return cached;
  const created = new Intl.DisplayNames([tag], { type: "region" });
  regionNames.set(tag, created);
  return created;
}

function countryName(region: string, locale: string): string {
  try {
    return regions(locale).of(region) || region;
  } catch {
    return region;
  }
}

function cityOf(zone: string): string {
  const city = zone.split("/").pop() ?? zone;
  return city.replaceAll("_", " ");
}

function norm(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[_/]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fieldHit(field: string, needle: string): boolean {
  if (!field) return false;
  if (field === needle) return true;
  if (needle.length < 3) return false;
  if (field.startsWith(needle)) return true;
  return field.includes(` ${needle}`);
}

export function clockName(zone: string, locale: string): string {
  const place = clockPlaces.find((item) => item.zone === zone);
  if (!place) return zone;
  const country = countryName(place.region, locale);
  const several = clockPlaces.some((item) => item.region === place.region && item.zone !== place.zone);
  if (!several) return country;
  return `${country} (${cityOf(zone)})`;
}

export function clockOptions(locale: string, localLabel: string): { id: string; label: string }[] {
  const countries = clockPlaces.map((place) => ({ id: place.zone, label: clockName(place.zone, locale) }));
  countries.sort((a, b) => a.label.localeCompare(b.label, localeTag(locale)));
  return [{ id: localClockId, label: localLabel }, ...countries];
}

/** Keeps the name that was on the clock, and the country name when they differ. */
export function clockChoiceLabel(shown: string, country: string): string {
  const place = country.trim();
  const seen = shown.trim();
  if (!seen || seen === place) return place || seen;
  const bare = place.replace(new RegExp(`\\s*\\(${escapeRegExp(seen)}\\)\\s*$`), "").trim();
  if (!bare || bare === seen) return seen;
  return `${seen}, ${bare}`;
}

/**
 * Countries that can be put on the clock. A removed place stays here.
 * Starter clocks that are not showing come first, then the rest of the catalog.
 */
export function addableClockIds(showing: readonly string[], orderedIds: readonly string[]): string[] {
  const on = new Set(showing);
  const pinned = defaultClockIds.filter((id) => !on.has(id));
  const pinnedSet = new Set<string>(pinned);
  const rest = orderedIds.filter((id) => knownClockIds.has(id) && !on.has(id) && !pinnedSet.has(id));
  return [...pinned, ...rest];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findClocks(query: string, locale: string): string[] {
  const needle = norm(query);
  if (!needle) return [];
  const hits: string[] = [];
  for (const place of clockPlaces) {
    const fields = [
      norm(countryName(place.region, "en")),
      norm(countryName(place.region, locale)),
      norm(cityOf(place.zone)),
      norm(place.zone),
    ];
    const byCode = needle.length === 2 && needle === place.region.toLowerCase();
    if (byCode || fields.some((field) => fieldHit(field, needle))) hits.push(place.zone);
  }
  return [...new Set(hits)];
}

export function normalizeClockIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [...defaultClockIds];
  const next: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !knownClockIds.has(item) || next.includes(item)) continue;
    next.push(item);
    if (next.length === clockLimit) break;
  }
  return next;
}

export function clocksFromStorage(raw: string | null): string[] {
  if (raw === null) return [...defaultClockIds];
  try {
    return normalizeClockIds(JSON.parse(raw));
  } catch {
    return [...defaultClockIds];
  }
}

let snapshot: readonly string[] = defaultClockIds;
let rawSeen: string | null | undefined;

export function readClockSnapshot(): readonly string[] {
  const raw = localStorage.getItem(clockStorageKey);
  if (raw === rawSeen) return snapshot;
  rawSeen = raw;
  snapshot = clocksFromStorage(raw);
  return snapshot;
}

export function writeClockIds(ids: readonly string[]) {
  const next = normalizeClockIds([...ids]);
  const raw = JSON.stringify(next);
  localStorage.setItem(clockStorageKey, raw);
  rawSeen = raw;
  snapshot = next;
  window.dispatchEvent(new Event("keel-clocks"));
}

export function subscribeClocks(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === clockStorageKey) listener();
  };
  window.addEventListener("keel-clocks", listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("keel-clocks", listener);
    window.removeEventListener("storage", onStorage);
  };
}
