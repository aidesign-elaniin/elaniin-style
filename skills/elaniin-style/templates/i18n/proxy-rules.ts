import { defaultLang, type Lang } from "./i18n";
import { routes } from "./routes";

export type LocaleAction =
  | { action: "next" }
  | { action: "redirect"; pathname: string }
  | { action: "rewrite"; pathname: string };

type RouteTable = Record<string, Record<Lang, string>>;

/* Internal path of a Spanish page: the folder under src/app/[lang] is named after the English slug. */
const internalEs = (en: string) => (en === "/" ? "/es" : `/es${en}`);

const notFound = (lang: Lang): LocaleAction => ({ action: "rewrite", pathname: `/${lang}/404` });

/*
  The route table is the list of every page, so this function decides what exists:
  - English has no prefix. An English slug of the table is rewritten to /en/..., the folder tree under src/app/[lang].
  - Spanish lives under /es. A Spanish slug of the table is rewritten to its internal folder (named after the English slug).
  - /en/... is redirected to the unprefixed URL so every page has one URL, and an uppercase language segment (/ES, /EN)
    to its lowercase form.
  - ANYTHING else (unknown path, a slug of the other language, /english) is rewritten to /<lang>/404, which no page owns:
    the catch-all route calls notFound() and Next answers with status 404 and the localized not-found page.
  Only exact slugs are translated; a nested path is added to the table as its own page.
*/
export function resolveLocale(pathname: string, table: RouteTable = routes): LocaleAction {
  const [, segment = "", ...rest] = pathname.split("/");
  const tail = rest.length ? `/${rest.join("/")}` : "";
  const lower = segment.toLowerCase();
  const first = lower === "es" || lower === defaultLang ? lower : segment;

  if (first !== segment) return { action: "redirect", pathname: first === "es" ? `/es${tail}` : tail || "/" };
  if (first === defaultLang) return { action: "redirect", pathname: tail || "/" };

  const pages = Object.values(table);
  if (first === "es") {
    for (const route of pages) {
      if (pathname === route.es) {
        const internal = internalEs(route.en);
        return internal === pathname ? { action: "next" } : { action: "rewrite", pathname: internal };
      }
    }
    return notFound("es");
  }
  if (pages.some((route) => route.en === pathname)) {
    return { action: "rewrite", pathname: pathname === "/" ? `/${defaultLang}` : `/${defaultLang}${pathname}` };
  }
  return notFound(defaultLang);
}
