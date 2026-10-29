import type { Metadata } from "next";
import { otherLang, type Lang } from "./i18n";
import { alternates, routes, type RouteKey } from "./routes";
import { siteUrl } from "./site";

/* Brand name: never translated. */
export const siteName = "Your Site"; // brand name used in titles and og:site_name (replace it)

/* Open Graph locale per language: en_US, and es_LA (Spanish for Latin America, closest to the Salvadoran convention of src/lib/format.ts). */
const ogLocales: Record<Lang, string> = { en: "en_US", es: "es_LA" };

/* The review ("dev") site stays out of search engines. Set ALLOW_INDEXING=true on the real production project. */
export const robotsMeta = (): Metadata["robots"] =>
  process.env.ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false };

/** Metadata of one page in one language: translated title and description, self canonical, hreflang, Open Graph. */
export function buildMetadata(lang: Lang, route: RouteKey, page: { title: string; description: string }): Metadata {
  const path = routes[route][lang];
  return {
    metadataBase: new URL(siteUrl()),
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path, languages: alternates(route) },
    openGraph: {
      type: "website",
      siteName,
      title: page.title,
      description: page.description,
      url: path,
      locale: ogLocales[lang],
      alternateLocale: ogLocales[otherLang(lang)],
    },
    robots: robotsMeta(),
  };
}
