import Link from "next/link";
import { PageShell } from "../../components/layout/page-shell";
import { PageHeader } from "../../components/sections/page-header";
import { ImagePlaceholder, PlaceholderChip } from "../../components/ui/placeholder";
import { Reveal } from "../../components/ui/reveal";
import { collections, findRoute } from "../../lib/site-map";

const { base, label, items } = collections.articles;
export const metadata = { title: label };

// Page type: LISTING of an MDX collection (src/content/articles/*.mdx, newest first).
export default function ArticlesPage() {
  const route = findRoute(base)!;
  return (
    <PageShell path={base}>
      <PageHeader title={label} placeholder={route.content !== "real"} />
      <section className="section-y">
        <div className="container-site">
          <div className="grid-auto" style={{ "--card-min": "18rem" } as React.CSSProperties}>
            {items.map((a, i) => (
              <Reveal key={a.slug} i={i}>
                <article className="card-glow lift relative flex h-full min-w-0 flex-col rounded-card border border-border-default bg-surface-card pad-card">
                  <ImagePlaceholder src={a.image.src} alt={a.image.alt} className="mb-5" />
                  <p className="mono-label text-tag-sm text-text-muted">
                    <time dateTime={a.date}>{a.date}</time>
                    {a.author && ` · ${a.author}`}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <h2 className="font-display font-medium text-h4 text-text-primary">
                      <Link href={`${base}${a.slug}/`} className="after:absolute after:inset-0 focus-ring">
                        {a.title}
                      </Link>
                    </h2>
                    {a.placeholder && <PlaceholderChip />}
                  </div>
                  {a.summary && <p className="mt-2 text-body-sm text-text-secondary">{a.summary}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
