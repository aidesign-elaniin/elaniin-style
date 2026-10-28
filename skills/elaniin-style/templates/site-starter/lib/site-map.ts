/*
  The ONLY place where routes are declared. The nav, the footer, breadcrumbs, sitemap.xml and the
  check script all read from here, so nobody keeps lists by hand.
  A page has a TYPE (a template). Pages that repeat belong to a COLLECTION (content/<collection>/*.json)
  and share one dynamic route.
*/
export type PageType = "home" | "listing" | "detail" | "contact" | "legal";

export type Route = {
  path: string; // always starts and ends with "/"
  title: string;
  type: PageType;
  nav?: boolean; // shows in the header and the drawer
  collection?: keyof typeof collections; // a listing page owns a collection
};

export const collections = {
  services: { base: "/servicios/", label: "Servicios" },
} as const;

export const routes: Route[] = [
  { path: "/", title: "Inicio", type: "home" },
  { path: "/servicios/", title: "Servicios", type: "listing", nav: true, collection: "services" },
  { path: "/contacto/", title: "Contacto", type: "contact" },
];

// The call to action of the bar (button.primary md). Keep ONE.
export const cta = { label: "Inicia un proyecto", href: "/contacto/" };

export const navRoutes = routes.filter((r) => r.nav);
