import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, PlusIcon } from "../ui/arrow";
import { IconBox } from "../ui/icon-box";
import { Reveal } from "../ui/reveal";

/*
  Engagement models (DESIGN.md components.engagement-models): "Three ways to work with us." An Elaniin Black band at every width
  (data-nav-theme="black"), placed right after the solutions and BEFORE the cases. From 1024px a row of three equal 460px cards (`engage-row` /
  `engage-card`): NONE is open at rest; hover or focus grows one from 1 to 2.4 in 300ms emphasized (only the width changes). A closed card shows its icon-box
  (dark), the name (display h3), a small plus and the link; an open card adds the paragraph (fixed width so it never reflows: 220px at 1024, 280px from 1280)
  and the isometric `scene` at the bottom right (230px wide at 1024, 340px from 1280), which fades in. Below 1024px the cards are stacked, ALL show their
  content (icon, name on one line, paragraph, the scene at 320px max, the link), no plus icon. The card carries the QUIET glow (`card-glow-quiet`).
  The link is the only call to action; the whole card is one click target; there is no section button and no benefits list.
  The scene's clock must run only while its card is open and on screen: pass `scene` (the three scenes live in templates/iso/scenes).
*/
export type Model = { id: string; name: string; description: string; fit: string; linkLabel: string; href: string; icon: ReactNode; scene: ReactNode };

export function EngagementModels({ title, lead, items }: { title: string; lead: string; items: Model[] }) {
  return (
    <section id="engagement" data-nav-theme="black" className="dark-band-black section-y">
      <div className="container-site">
        <h2 className="max-w-heading font-display font-medium text-h1 text-balance text-white">{title}</h2>
        <p className="mt-4 max-w-lead text-lead text-text-on-dark-secondary">{lead}</p>
        <ul className="engage-row mt-12">
          {items.map((m, i) => (
            <li key={m.id} className="engage-card group">
              <Reveal i={i}>
                <article className="card-glow-quiet relative flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-border-on-dark pad-card group-hover:border-border-on-dark-strong">
                  <div className="flex items-start justify-between">
                    <IconBox dark>{m.icon}</IconBox>
                    <span aria-hidden="true" className="hidden text-text-on-dark-muted transition-transform duration-slow lg:block lg:group-hover:rotate-45 lg:group-focus-within:rotate-45">
                      <PlusIcon />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-h3 font-medium text-text-on-dark">{m.name}</h3>
                  <div className="mt-4 flex min-w-0 flex-col gap-6 lg:opacity-0 lg:transition-opacity lg:duration-slow lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                    <p className="max-w-narrow text-body text-text-on-dark-secondary lg:w-56 xl:w-72">
                      {m.description} {m.fit}
                    </p>
                    <div aria-hidden="true" className="ml-auto w-full max-w-xs lg:absolute lg:bottom-4 lg:right-4 lg:w-56 xl:w-80">
                      {m.scene}
                    </div>
                  </div>
                  <Link href={m.href} className="btn-arrow relative mt-auto inline-flex items-center gap-2 pt-6 font-display text-body-sm font-medium text-text-on-dark-accent focus-ring-on-dark after:absolute after:inset-0">
                    {m.linkLabel}
                    <ArrowIcon />
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
