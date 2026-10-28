import { notFound } from "next/navigation";
import { PageShell } from "../../../components/layout/page-shell";
import { CtaBand } from "../../../components/sections/cta-band";
import { PageHeader } from "../../../components/sections/page-header";
import { ImagePlaceholder } from "../../../components/ui/placeholder";
import { home } from "../../../content/home";
import { collections, trail } from "../../../lib/site-map";

const { base, items } = collections.services;

export const dynamicParams = false; // static export: only the slugs below exist

export function generateStaticParams() {
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next 16: params is a Promise
  return { title: items.find((s) => s.slug === slug)?.title };
}

// Page type: DETAIL. One template for every item of the collection.
// To customize ONE page: create src/app/servicios/<slug>/page.tsx (a fixed route wins over [slug]) and leave the item
// in src/content/services.ts so site-map.ts keeps listing it. Update its `placeholder` when its text becomes real.
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items.find((s) => s.slug === slug);
  if (!item) notFound();
  const path = `${base}${item.slug}/`;
  return (
    <PageShell path={path}>
      <PageHeader title={item.title} lead={item.summary} trail={trail(path)} placeholder={item.placeholder} />
      <section className="section-y">
        <div className="container-site grid-page">
          <div className="col-span-12 min-w-0 space-y-5 md:col-span-7">
            {item.body.map((p, i) => (
              <p key={i} className="max-w-body break-words text-body text-text-secondary">
                {p}
              </p>
            ))}
          </div>
          <div className="col-span-12 min-w-0 md:col-span-5">
            <ImagePlaceholder src={item.image.src} alt={item.image.alt} />
          </div>
        </div>
      </section>
      <CtaBand {...home.cta} />
    </PageShell>
  );
}
