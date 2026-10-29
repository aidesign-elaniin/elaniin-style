import { langs, type Lang } from "./i18n";
import { siteUrl } from "./site";

/*
  The only place that knows slugs. One entry per page, with its path in each language.
  Pages are added here when they exist (for example solutions: { en: "/solutions", es: "/es/soluciones" }).
*/
export const routes = {
  home: { en: "/", es: "/es" },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Path of a page in a language, with an optional anchor id (see src/lib/anchors.ts). */
export function href(key: RouteKey, lang: Lang, hash?: string): string {
  const path: string = routes[key][lang];
  return hash ? `${path}#${hash}` : path;
}

/** Paths of the same page in both languages, plus x-default (English), for hreflang and the sitemap. */
export function alternates(key: RouteKey): { en: string; es: string; "x-default": string } {
  return { en: routes[key].en, es: routes[key].es, "x-default": routes[key].en };
}

export const absoluteUrl = (path: string): string => `${siteUrl()}${path}`;

/** Appends the current #hash to a path: anchors are the same in both languages, so the visitor keeps their place. */
export const withHash = (path: string, hash: string): string => (hash ? `${path}${hash}` : path);

export type SwitchLink = { lang: Lang; label: "EN" | "ES"; name: string; href: string; current: boolean };

/** The language switch of a page: the SAME page in each language, with the current one marked. Names come from the dictionary. */
export function switchLinks(route: RouteKey, current: Lang, names: Record<Lang, string>): SwitchLink[] {
  return langs.map((lang) => ({
    lang,
    label: lang === "en" ? "EN" : "ES",
    name: names[lang],
    href: href(route, lang),
    current: lang === current,
  }));
}
