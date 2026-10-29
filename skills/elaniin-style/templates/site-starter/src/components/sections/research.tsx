import Link from "next/link";
import { ArrowIcon } from "../ui/arrow";
import { Tag } from "../ui/tag";

/*
  Research (DESIGN.md components.research-grid / research-row / research-card): a clean list on an Elaniin Black band, hairlines in border-on-dark,
  links in text-on-dark-accent (Elevate Blue is only 3.1:1 on black). No gradients, no art. Header: title h1 white, no eyebrow, ONE lead paragraph,
  a text link with arrow at the end. A row reads: title, then kind tag (small tag), then date and reading time in mono at tag-sm size.
  The whole row is one link (after:absolute). ResearchCard is for the blog index (three columns from 768px), not for the home.
*/
export type Article = { id: string; kind: string; title: string; date: string; readTime: string; href: string };

export function ResearchRow({ a }: { a: Article }) {
  return (
    <li className="relative grid grid-cols-1 gap-3 border-b border-border-on-dark py-6 transition-colors duration-fast hover:bg-white/5 lg:grid-cols-12 lg:items-start lg:gap-6">
      <h3 className="min-w-0 max-w-narrow font-display text-h3 font-medium text-text-on-dark lg:col-span-7">
        <Link href={a.href} className="after:absolute after:inset-0 focus-ring-on-dark">
          {a.title}
        </Link>
      </h3>
      <div className="flex min-w-0 flex-col gap-2 lg:col-span-4">
        <span className="tag tag-sm w-fit border-border-on-dark-strong bg-transparent text-text-on-dark-secondary">{a.kind}</span>
        <span className="font-mono text-tag-sm uppercase tracking-wider text-text-on-dark-muted">
          {a.date} · {a.readTime}
        </span>
      </div>
      <span aria-hidden="true" className="hidden justify-end text-text-on-dark-accent lg:col-span-1 lg:flex">
        <ArrowIcon />
      </span>
    </li>
  );
}

export function ResearchList({ title, lead, action, items }: { title: string; lead: string; action: { label: string; href: string }; items: Article[] }) {
  return (
    <section id="investigacion" data-nav-theme="black" className="dark-band-black section-y">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="max-w-heading font-display font-medium text-h1 text-balance text-white">{title}</h2>
            <p className="mt-4 max-w-body text-lead text-text-on-dark-secondary">{lead}</p>
          </div>
          <Link href={action.href} className="btn-arrow inline-flex items-center gap-2 font-display text-body-sm font-medium text-text-on-dark-accent focus-ring-on-dark">
            {action.label}
            <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-12 border-t border-border-on-dark">
          {items.map((a) => (
            <ResearchRow key={a.id} a={a} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Card of the blog index: a 16:9 banner slot (an isometric piece or an image), the kind tag with an arrow, the title, date and reading time. */
export function ResearchCard({ a, banner }: { a: Article; banner?: React.ReactNode }) {
  return (
    <article className="relative flex min-w-0 flex-col rounded-card border border-border-on-dark bg-surface-dark-alt p-4 transition-colors duration-fast hover:border-border-on-dark-strong">
      <div aria-hidden="true" className="aspect-video overflow-hidden rounded-menu border border-border-on-dark bg-white/5">
        {banner}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-4">
        <div className="flex items-center justify-between">
          <Tag dark small>
            {a.kind}
          </Tag>
          <span className="text-text-on-dark-accent">
            <ArrowIcon />
          </span>
        </div>
        <h3 className="font-display text-h4 font-medium text-text-on-dark">
          <Link href={a.href} className="after:absolute after:inset-0 focus-ring-on-dark">
            {a.title}
          </Link>
        </h3>
        <p className="mt-auto font-mono text-tag-sm uppercase tracking-wider text-text-on-dark-muted">
          {a.date} · {a.readTime}
        </p>
      </div>
    </article>
  );
}
