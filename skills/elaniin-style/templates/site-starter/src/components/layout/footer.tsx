import Link from "next/link";
import { credentialCatalog } from "../../content/credentials";
import { site } from "../../content/site";
import { asset } from "../../lib/asset";
import { collections, footerRoutes } from "../../lib/site-map";
import { AiSummary } from "../sections/ai-summary";
import { Glyph } from "../ui/brand-glyphs";
import { Logo } from "./logo";

/*
  Footer of the reference site (DESIGN.md components.footer): Excellence Blue (Elaniin Black was tried and rejected), `data-nav-theme="blue"`, border-top on-dark. Contains EXACTLY:
  the small white logotipo (28px tall, the only logo, not a link), the tagline (lead in white + the rest in secondary), the entity line (caption, no brand name), the socials
  (40px buttons, 18px single-color glyph; Clutch is a tile drawn as a one-color mask), FOUR link columns, the credentials row (white badges) and the legal row (copyright, Legal,
  Privacy, the language switch and, pushed to the end, the AI summary). NO form of any kind (the newsletter was removed in v1.51.0). Layout: from 1024px `footer-grid`
  (26rem | 1fr, gap 96px); padding top 64px (48 below 768) bottom 32px. Optional rows (credentials, social, aiSummary) are driven by content/site.ts and are OFF by default.
*/
export function Footer({ switcher }: { switcher?: React.ReactNode }) {
  const badges = site.credentials.map((id) => ({ id, ...credentialCatalog[id] }));
  const columns = [
    { heading: "Sitio", links: footerRoutes().filter((r) => r.type !== "legal" && r.type !== "listing").map((r) => ({ label: r.title, href: r.path })) },
    { heading: collections.services.label, links: collections.services.items.map((i) => ({ label: i.title, href: `${collections.services.base}${i.slug}/` })) },
  ];
  const legal = collections.legal.items.map((i) => ({ label: i.title, href: `${collections.legal.base}${i.slug}/` }));
  return (
    <footer data-nav-theme="blue" className="relative overflow-hidden border-t border-border-on-dark bg-surface-dark text-text-on-dark-secondary">
      <div className="container-site pb-8 pt-16 max-md:pt-12">
        <div className="footer-grid">
          <div className="flex min-w-0 flex-col gap-8">
            <Logo variant="white" className="h-7 w-auto self-start" />
            <p className="font-display text-lead text-text-on-dark">
              {site.tagline.lead}
              <span className="block text-text-on-dark-secondary">{site.tagline.rest}</span>
            </p>
            <p className="text-caption text-text-on-dark-muted">{site.entity}</p>
            {site.social.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {site.social.map((s) => (
                  <li key={s.network}>
                    <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="footer-social focus-ring-on-dark">
                      <Glyph name={s.network} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <nav aria-label="Pie" className="grid min-w-0 grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
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
        {badges.length > 0 && (
          <div className="mt-16">
            <p className="font-mono text-caption uppercase tracking-wider text-text-on-dark-muted">{site.credentialsLabel}</p>
            <ul className="mt-5 flex flex-wrap items-center gap-6" aria-label={site.credentialsLabel}>
              {badges.map((b) => (
                <li key={b.id} className="flex items-center">
                  {/* files are black on transparent: inverted to white at 80% on the dark surface (invert, not brightness-0: ribbons and inner text keep contrast) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(b.src)} alt={b.name} width={b.width} height={b.height} className={`${b.tall} w-auto invert opacity-80`} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border-on-dark pt-6 text-body-sm text-text-on-dark-muted">
          <span>
            © {site.copyrightYear} {site.name}
          </span>
          {legal.map((l) => (
            <Link key={l.href} href={l.href} className="footer-link focus-ring-on-dark">
              {l.label}
            </Link>
          ))}
          {switcher && <div className="switch-bleed">{switcher}</div>}
          {site.aiSummary && (
            <div className="md:ml-auto">
              <AiSummary label={site.aiSummaryLabel} prompt={site.aiSummaryPrompt} siteUrl={site.url} />
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
