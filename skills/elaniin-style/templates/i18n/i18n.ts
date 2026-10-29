/* Languages of the site. English is primary (no URL prefix), Spanish lives under /es. DESIGN.md section 13. */
export const langs = ["en", "es"] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = "en";

export const hasLang = (value: string): value is Lang => (langs as readonly string[]).includes(value);

export const otherLang = (lang: Lang): Lang => (lang === "en" ? "es" : "en");
