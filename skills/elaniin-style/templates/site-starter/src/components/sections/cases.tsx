import type { ReactNode } from "react";
import Link from "next/link";
import { GlowStripes } from "../ui/glow";
import { ArrowIcon } from "../ui/arrow";
import { Reveal } from "../ui/reveal";
import { Tag } from "../ui/tag";

/*
  Cases (DESIGN.md components.cases-grid / case-card / case-media): proof first. Header + hairline grid of case cards.
  Section 07 of the home: right after the engagement models and BEFORE the research band. White, border-y full-bleed and border-x on the container edges, 1px border-default lines via gap-px (the cases keep the hairline grid; the solutions cards no longer do).
  Four cases in two rows that mirror each other: wide (7 cols) + narrow (5), then narrow + wide. Reveal staggered 80ms within a row. Every card is the same size class:
  stage 400px, title h3, result body-lg. The stage is a dark `case-media` with the animated blue glow (glow-media) and a product scene inside
  a SAFE AREA whose inset is the same on the four sides (24px below 768, 48 from 768, 32 from 1024, 44 from 1280); only phones may leave it through
  the bottom. Scenes are decorative mocks of the client product (aria-hidden); the result is also written in the card text.
  Logos: a real client logo needs the client's authorization; until then the chip shows the placeholder name.
*/
export type CaseItem = {
  id: string;
  layout: "wide" | "narrow";
  client: string;
  logo?: ReactNode; // the FULL-COLOR logo, 32px high (h-8) on a white chip; a text placeholder if absent
  tags: string[]; // one or two, small size
  title: string;
  result: string;
  href: string;
  linkLabel: string;
  scene: ReactNode; // lives inside the safe area
};

export function CaseMedia({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="relative isolate h-100 overflow-hidden bg-surface-dark">
      <GlowStripes variant="media" />
      <div className="absolute inset-6 z-10 md:inset-12 lg:inset-8 xl:inset-11">{children}</div>
    </div>
  );
}

export function CaseCard({ c }: { c: CaseItem }) {
  return (
    <article className="relative flex h-full min-w-0 flex-col bg-white">
      <CaseMedia>{c.scene}</CaseMedia>
      <div className="flex min-w-0 flex-1 flex-col pad-card">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-10 min-w-0 items-center rounded-tag border border-border-default bg-white px-3 text-body-sm font-medium text-text-primary">{c.logo ?? c.client}</span>
          <span className="flex gap-2">
            {c.tags.slice(0, 2).map((t) => (
              <Tag key={t} small>
                {t}
              </Tag>
            ))}
          </span>
        </div>
        <h3 className="mt-6 font-display text-h3 font-medium text-balance text-text-primary">{c.title}</h3>
        <p className="mt-3 text-body-lg text-text-secondary">{c.result}</p>
        <Link href={c.href} className="btn-arrow mt-6 inline-flex items-center gap-2 font-display text-body-sm font-medium text-text-link hover:text-text-link-hover focus-ring after:absolute after:inset-0">
          {c.linkLabel}
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

export function CasesGrid({ title, lead, leadRest, action, items }: { title: string; lead: string; leadRest: string; action: { label: string; href: string }; items: CaseItem[] }) {
  // wide + narrow, then narrow + wide: the span comes from the layout flag
  const span = (c: CaseItem) => (c.layout === "wide" ? "lg:col-span-7" : "lg:col-span-5");
  return (
    <section id="cases" className="border-y border-border-default section-y-statement">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="max-w-hero font-display font-medium text-display-lg text-balance text-text-primary">{title}</h2>
            <p className="mt-4 max-w-lead text-lead text-text-secondary">
              <span className="font-medium text-text-primary">{lead}</span> {leadRest}
            </p>
          </div>
          <Link href={action.href} className="btn-arrow inline-flex items-center gap-2 font-display text-body-sm font-medium text-text-link hover:text-text-link-hover focus-ring">
            {action.label}
            <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-16 grid grid-cols-1 gap-px border-x border-border-default bg-border-default lg:grid-cols-12">
          {items.map((c, i) => (
            <li key={c.id} className={`min-w-0 col-span-1 ${span(c)}`}>
              <Reveal i={i % 2} step={80}>
                <CaseCard c={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
