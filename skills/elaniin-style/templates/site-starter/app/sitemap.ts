import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getCollection } from "@/lib/content";
import { collections, routes } from "@/lib/site-map";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = routes.map((r) => r.path);
  const items = getCollection("services").map((s) => `${collections.services.base}${s.slug}/`);
  return [...pages, ...items].map((p) => ({ url: `${site.url}${p}` }));
}
