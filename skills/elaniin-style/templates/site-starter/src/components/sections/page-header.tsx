import Link from "next/link";
import { PlaceholderChip } from "../ui/placeholder";

/* Title block of inner pages: breadcrumb, one h1 (with the filler chip when its text is filler), lead. */
export function PageHeader({ title, lead, trail = [], placeholder = false }: { title: string; lead?: string; trail?: { label: string; href: string }[]; placeholder?: boolean }) {
  return (
    <section className="section-y-compact border-b border-border-default">
      <div className="container-site">
        {trail.length > 0 && (
          <nav aria-label="Ruta" className="mb-4 text-body-sm text-text-muted">
            {trail.map((t) => (
              <span key={t.href}>
                <Link href={t.href} className="hover:text-text-primary">
                  {t.label}
                </Link>{" "}
                /{" "}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="max-w-heading break-words font-display font-medium text-h1 text-balance text-text-primary">{title}</h1>
          {placeholder && <PlaceholderChip />}
        </div>
        {lead && <p className="mt-5 max-w-lead text-lead text-text-secondary">{lead}</p>}
      </div>
    </section>
  );
}
