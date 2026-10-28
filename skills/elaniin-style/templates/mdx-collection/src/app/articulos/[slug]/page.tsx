import { notFound } from "next/navigation";
import { PageShell } from "../../../components/layout/page-shell";
import { CtaBand } from "../../../components/sections/cta-band";
import { PageHeader } from "../../../components/sections/page-header";
import { home } from "../../../content/home";
import { collections, trail } from "../../../lib/site-map";

const { base, items } = collections.articles;

export const dynamicParams = false; // static export: only the slugs below exist

export function generateStaticParams() {
  return items.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next 16: params is a Promise
  return { title: items.find((a) => a.slug === slug)?.title };
}

// Page type: DETAIL of an MDX collection. The body is src/content/articles/<slug>.mdx, styled by src/mdx-components.tsx.
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = items.find((a) => a.slug === slug);
  if (!item) notFound();
  const { default: Body } = await import(`../../../content/articles/${item.slug}.mdx`);
  const path = `${base}${item.slug}/`;
  return (
    <PageShell path={path}>
      <PageHeader title={item.title} lead={item.summary} trail={trail(path)} placeholder={item.placeholder} />
      <article className="section-y">
        <div className="container-site min-w-0">
          <Body />
        </div>
      </article>
      <CtaBand {...home.cta} />
    </PageShell>
  );
}
