import type { MetadataRoute } from "next";
import { site } from "../content/site";
import { allRoutes } from "../lib/site-map";

export const dynamic = "force-static";

// Every route of site-map.ts except the ones that only redirect.
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes()
    .filter((r) => !r.redirect)
    .map((r) => ({ url: `${site.url}${r.path}` }));
}
