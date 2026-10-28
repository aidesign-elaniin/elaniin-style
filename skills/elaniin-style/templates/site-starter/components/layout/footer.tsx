import Link from "next/link";
import { site } from "@/content/site";
import { routes } from "@/lib/site-map";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-elaniin-black text-white">
      <div className="container-site section-y-compact">
        <div className="grid-page">
          <div className="col-span-12 min-w-0 md:col-span-6">
            <Logo variant="white" className="h-7 w-auto" />
            <p className="mt-4 max-w-[40ch] text-body-sm text-text-on-dark-secondary">{site.footer.blurb}</p>
          </div>
          <nav className="col-span-12 min-w-0 md:col-span-6" aria-label="Pie">
            <ul className="space-y-2 text-body-sm text-text-on-dark-secondary">
              {routes.map((r) => (
                <li key={r.path}>
                  <Link href={r.path} className="nav-link transition-colors duration-base hover:text-white">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-on-dark pt-6 text-caption text-text-on-dark-muted">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <ul className="flex gap-6">
            {site.footer.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="transition-colors duration-base hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
