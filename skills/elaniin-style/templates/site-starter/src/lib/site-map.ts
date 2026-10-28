/*
  The ONLY list of routes. The menu, the footer, the breadcrumbs, sitemap.xml and the check script all read it,
  so nobody keeps lists by hand. Relative imports only (no "@/" alias).
  Every route carries `content`: "real" (all text is real), "mixed" (part real, part filler) or "placeholder"
  (all filler). The check script compares it with the data-placeholder marks drawn on screen.
*/
import { legal } from "../content/legal";
import { services } from "../content/services";
import type { Item } from "../content/types";

export type Content = "real" | "mixed" | "placeholder";
export type PageType = "home" | "listing" | "detail" | "about" | "contact" | "legal";

export type Route = {
  path: string; // starts and ends with "/" (trailingSlash is on)
  title: string;
  type: PageType;
  content: Content;
  nav?: boolean; // header and drawer
  footer?: boolean;
  parent?: string; // path of the parent (breadcrumbs)
  redirect?: boolean; // a page that only forwards to its first child
};

/** One collection per group of repeated pages: items live in src/content/<collection>.ts. */
export const collections = {
  services: { base: "/servicios/", label: "Servicios", items: services, nav: true },
  legal: { base: "/legal/", label: "Legal", items: legal, redirect: true },
} as const satisfies Record<string, { base: string; label: string; items: Item[]; nav?: boolean; redirect?: boolean }>;

const derive = (items: Item[]): Content => {
  const filler = items.filter((i) => i.placeholder).length;
  return filler === 0 ? "real" : filler === items.length ? "placeholder" : "mixed";
};

const fixed: Route[] = [
  { path: "/", title: "Inicio", type: "home", content: "mixed" },
  { path: "/nosotros/", title: "Nosotros", type: "about", content: "placeholder", nav: true, footer: true },
  { path: "/contacto/", title: "Contacto", type: "contact", content: "real", footer: true },
];

export function allRoutes(): Route[] {
  const out: Route[] = [...fixed];
  for (const c of Object.values(collections)) {
    out.push({
      path: c.base,
      title: c.label,
      type: "redirect" in c && c.redirect ? "legal" : "listing",
      content: derive([...c.items]),
      nav: "nav" in c && c.nav,
      footer: true,
      redirect: "redirect" in c && c.redirect,
    });
    for (const item of c.items) {
      out.push({
        path: `${c.base}${item.slug}/`,
        title: item.title,
        type: "detail",
        content: item.placeholder ? "placeholder" : "real",
        parent: c.base,
      });
    }
  }
  return out;
}

export const findRoute = (path: string) => allRoutes().find((r) => r.path === path);
export const navRoutes = () => allRoutes().filter((r) => r.nav);
export const footerRoutes = () => allRoutes().filter((r) => r.footer);

/** Breadcrumb trail of a route (without the route itself). */
export function trail(path: string): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  let r = findRoute(path);
  while (r?.parent) {
    const p = findRoute(r.parent);
    if (!p) break;
    out.unshift({ label: p.title, href: p.path });
    r = p;
  }
  return out;
}

// The call to action of the bar (button.primary md). Keep ONE.
export const cta = { label: "Inicia un proyecto", href: "/contacto/" };
