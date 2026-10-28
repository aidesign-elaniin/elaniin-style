import { notFound } from "next/navigation";
import { PageShell } from "../../../components/layout/page-shell";
import { PageHeader } from "../../../components/sections/page-header";
import { collections, trail } from "../../../lib/site-map";

const { base, items } = collections.legal;

export const dynamicParams = false;

export function generateStaticParams() {
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: items.find((s) => s.slug === slug)?.title };
}

// Page type: LEGAL (long text).
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items.find((s) => s.slug === slug);
  if (!item) notFound();
  const path = `${base}${item.slug}/`;
  return (
    <PageShell path={path}>
      <PageHeader title={item.title} trail={trail(path)} placeholder={item.placeholder} />
      <section className="section-y">
        <div className="container-site space-y-5">
          {item.body.map((p, i) => (
            <p key={i} className="max-w-body break-words text-body text-text-secondary">
              {p}
            </p>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
