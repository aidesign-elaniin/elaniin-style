import Link from "next/link";
import { site } from "../../content/site";
import { collections, footerRoutes } from "../../lib/site-map";
import { Logo } from "./logo";

/* Credentials: 8 badge files that are black on transparent; on the dark surface they are inverted to white at 80% (invert, not brightness-0: ribbons and inner text keep contrast). Square badges 64px high, a wide one 24px, last. Each needs an alt text from the dictionary. */
export type Credential = { name: string; node: React.ReactNode };

/*
  Footer of the reference site (DESIGN.md components.footer): Excellence Blue (never Elaniin Black), the white logotipo
  as the only logo, tagline (lead in white + the rest in secondary), a caption, link columns with display-font headings
  and plain links (`footer-link`), and a legal row on a hairline. Social links, when the site has them, are 40px icon buttons
  (`footer-social`) with the official glyph of each network. All links come from site-map.ts.
*/
export function Footer({ switcher, aiSummary, credentials }: { switcher?: React.ReactNode; aiSummary?: React.ReactNode; credentials?: { label: string; items: Credential[] } }) {
  const columns = [
    { heading: "Sitio", links: footerRoutes().filter((r) => r.type !== "legal" && r.type !== "listing").map((r) => ({ label: r.title, href: r.path })) },
    { heading: collections.services.label, links: collections.services.items.map((i) => ({ label: i.title, href: `${collections.services.base}${i.slug}/` })) },
    { heading: collections.legal.label, links: collections.legal.items.map((i) => ({ label: i.title, href: `${collections.legal.base}${i.slug}/` })) },
  ];
  return (
    <footer data-nav-theme="blue" className="relative overflow-hidden border-t border-border-on-dark bg-surface-dark text-text-on-dark-secondary">
      <div className="container-site pb-8 pt-16 max-md:pt-12">
        <div className="grid-page">
          <div className="col-span-12 flex min-w-0 flex-col gap-8 lg:col-span-4">
            <Logo variant="white" className="h-7 w-auto self-start" />
            <p className="font-display text-lead text-text-on-dark">
              {site.tagline.lead}
              <span className="block text-text-on-dark-secondary">{site.tagline.rest}</span>
            </p>
            <p className="text-caption text-text-on-dark-muted">{site.entity}</p>
          </div>
          <nav aria-label="Pie" className="col-span-12 grid min-w-0 grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.heading} className="min-w-0">
                <h2 className="font-display text-body font-medium text-text-on-dark">{col.heading}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="footer-link focus-ring-on-dark">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        {credentials && (
          <div className="mt-10 border-t border-border-on-dark pt-8">
            <p className="font-mono text-caption uppercase tracking-wider text-text-on-dark-muted">{credentials.label}</p>
            <ul className="mt-5 flex flex-wrap items-center gap-6 invert opacity-80" aria-label={credentials.label}>
              {credentials.items.map((c) => (
                <li key={c.name} className="flex items-center">
                  {c.node}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border-on-dark pt-6 text-body-sm text-text-on-dark-muted">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          {collections.legal.items.map((i) => (
            <Link key={i.slug} href={`${collections.legal.base}${i.slug}/`} className="footer-link focus-ring-on-dark">
              {i.title}
            </Link>
          ))}
          {switcher}
          {aiSummary && <div className="md:ml-auto">{aiSummary}</div>}
        </div>
      </div>
    </footer>
  );
}
