import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/sections/page-header";
import { getCollection } from "@/lib/content";
import { collections } from "@/lib/site-map";

export const metadata = { title: collections.services.label };

// Page type: LISTING. One card per item of the collection (content/services/*.json).
export default function ServicesPage() {
  const items = getCollection("services");
  return (
    <>
      <PageHeader title={collections.services.label} lead="Texto de relleno: introducción del listado." />
      <section className="section-y">
        <div className="container-site">
          <div className="grid-auto" style={{ "--card-min": "18rem" } as React.CSSProperties}>
            {items.map((s) => (
              <Link
                key={s.slug}
                href={`${collections.services.base}${s.slug}/`}
                className="card-glow lift flex min-w-0 flex-col overflow-hidden rounded-card border border-border-default bg-surface-card pad-card focus-ring"
              >
                <Image src={s.image.src} alt={s.image.alt} width={1200} height={750} className="mb-5 aspect-video w-full rounded-tag object-cover" />
                <h2 className="font-display font-medium text-h4 text-text-primary">{s.title}</h2>
                <p className="mt-2 text-body-sm text-text-secondary">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
