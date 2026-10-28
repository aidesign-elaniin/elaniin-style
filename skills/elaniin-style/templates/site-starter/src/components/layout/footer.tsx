import Link from "next/link";
import { site } from "../../content/site";
import { footerRoutes } from "../../lib/site-map";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-elaniin-black text-white">
      <div className="container-site section-y-compact">
        <div className="grid-page">
          <div className="col-span-12 mb-6 min-w-0 lg:col-span-6 lg:mb-0">
            <Logo variant="white" className="h-7 w-auto" />
            <p className="mt-4 max-w-[40ch] text-body-sm text-text-on-dark-secondary">{site.footerBlurb}</p>
          </div>
          <nav className="col-span-12 min-w-0 lg:col-span-6" aria-label="Pie">
            <ul className="space-y-2 text-body-sm text-text-on-dark-secondary">
              {footerRoutes().map((r) => (
                <li key={r.path}>
                  <Link href={r.path} className="nav-link transition-colors duration-base hover:text-white">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-10 border-t border-border-on-dark pt-6 text-caption text-text-on-dark-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
