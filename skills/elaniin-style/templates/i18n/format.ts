import type { Lang } from "./i18n";

/*
  All number, money, date and time formatting goes through Intl with the page language (DESIGN.md section 13.4 rule 5).
  English follows en-US and Spanish follows El Salvador (es-SV), decided by the team on 2026-10-15: both use a decimal
  point and a comma for thousands, "$" before the amount and a 12-hour clock. The region lives only here; <html lang>
  and the URLs stay "en" and "es".
*/
const INTL_LOCALES: Record<Lang, string> = { en: "en-US", es: "es-SV" };

/** The Intl locale of a page language. Components that hand a locale to a library (NumberFlow) use this too. */
export const intlLocale = (lang: Lang): string => INTL_LOCALES[lang];

/** "2026-09" -> "Sep 2026" (en) / "sept 2026" (es). */
export function formatMonth(lang: Lang, isoYearMonth: string): string {
  const [year, month] = isoYearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale(lang), { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

/*
  Intl writes the space inside "p. m." and before "PM" as a no-break (U+00A0) or a narrow no-break (U+202F) space, and
  which one depends on the engine and its ICU version: Node 20 and Chrome disagree on es-SV ("p.\u00a0m." against
  "p. m."). The server and the browser must print the same text or React fails to hydrate, so every space becomes a
  plain one.
*/
export const plainSpaces = (text: string): string => text.replace(/[\u00a0\u202f]/g, " ");

/** "14:30" -> "2:30 PM" (en) / "2:30 p. m." (es). The input is a neutral 24-hour "HH:MM". */
export function formatTime(lang: Lang, hhmm: string): string {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return plainSpaces(
    new Intl.DateTimeFormat(intlLocale(lang), { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(
      new Date(Date.UTC(2000, 0, 1, hours, minutes)),
    ),
  );
}

export const formatNumber = (lang: Lang, value: number, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat(intlLocale(lang), options).format(value);

export const formatCurrency = (lang: Lang, value: number, currency: "USD"): string =>
  new Intl.NumberFormat(intlLocale(lang), {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/** A fraction as a percentage: 0.82 -> "82%". */
export const formatPercent = (
  lang: Lang,
  fraction: number,
  options: { decimals?: number; signed?: boolean } = {},
): string =>
  new Intl.NumberFormat(intlLocale(lang), {
    style: "percent",
    minimumFractionDigits: options.decimals ?? 0,
    maximumFractionDigits: options.decimals ?? 0,
    signDisplay: options.signed ? "exceptZero" : "auto",
  }).format(fraction);
