import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { home } from "@/content/home";
import { getCollection } from "@/lib/content";
import { collections } from "@/lib/site-map";

export const dynamicParams = false; // static export: only the slugs below exist

export function generateStaticParams() {
  return getCollection("services").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCollection("services").find((s) => s.slug === slug);
  return { title: item?.title };
}

// Page type: DETAIL. One template for every item of the collection.
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCollection("services").find((s) => s.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageHeader title={item.title} lead={item.summary} trail={[{ label: collections.services.label, href: collections.services.base }]} />
      <section className="section-y">
        <div className="container-site grid-page">
          <div className="col-span-12 min-w-0 space-y-5 md:col-span-7">
            {item.body.map((p, i) => (
              <p key={i} className="max-w-[68ch] break-words text-body text-text-secondary">
                {p}
              </p>
            ))}
          </div>
          <div className="col-span-12 min-w-0 md:col-span-5">
            <Image src={item.image.src} alt={item.image.alt} width={1200} height={750} className="w-full rounded-card border border-border-default" />
          </div>
        </div>
      </section>
      <CtaBand {...home.cta} />
    </>
  );
}
