import Link from "next/link";

/* Title block of inner pages: breadcrumb, one h1, lead. */
export function PageHeader({ title, lead, trail = [] }: { title: string; lead?: string; trail?: { label: string; href: string }[] }) {
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
        <h1 className="max-w-[20ch] break-words font-display font-medium text-h1 text-balance text-text-primary">{title}</h1>
        {lead && <p className="mt-5 max-w-[56ch] text-lead text-text-secondary">{lead}</p>}
      </div>
    </section>
  );
}
