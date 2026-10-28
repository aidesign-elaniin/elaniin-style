import Link from "next/link";
import { PageShell } from "../../components/layout/page-shell";
import { PageHeader } from "../../components/sections/page-header";
import { ImagePlaceholder, PlaceholderChip } from "../../components/ui/placeholder";
import { Reveal } from "../../components/ui/reveal";
import { collections, findRoute } from "../../lib/site-map";

const { base, label, items } = collections.services;
export const metadata = { title: label };

// Page type: LISTING. One card per item of the collection (src/content/services.ts).
// Clickable card: the link lives in the h3 and stretches with after:absolute after:inset-0 (no absolute <a> wrapping the text).
export default function ServicesPage() {
  const route = findRoute(base)!;
  return (
    <PageShell path={base}>
      <PageHeader title={label} placeholder={route.content !== "real"} />
      <section className="section-y">
        <div className="container-site">
          <div className="grid-auto" style={{ "--card-min": "18rem" } as React.CSSProperties}>
            {items.map((s, i) => (
              <Reveal key={s.slug} i={i}>
                <article className="card-glow lift relative flex h-full min-w-0 flex-col rounded-card border border-border-default bg-surface-card pad-card">
                  <ImagePlaceholder src={s.image.src} alt={s.image.alt} className="mb-5" />
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display font-medium text-h4 text-text-primary">
                      <Link href={`${base}${s.slug}/`} className="after:absolute after:inset-0 focus-ring">
                        {s.title}
                      </Link>
                    </h2>
                    {s.placeholder && <PlaceholderChip />}
                  </div>
                  {s.summary && <p className="mt-2 text-body-sm text-text-secondary">{s.summary}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
