"use client";

import { useState, type ReactNode } from "react";
import { SectionGlow } from "../ui/glow";
import { ArrowIcon } from "../ui/arrow";

/*
  Audience routes (DESIGN.md components.audience-routes): "Where do you need to move faster?" Section 04, right after the client strip and BEFORE the cases.
  White with the section glow behind a GLASS panel (white 55% + blur) so the glow shows through and drifts slowly. A pill toggle (radius full, allowed for toggle
  switches) of two buttons, 40px, picks the sector; the selected one is Excellence Blue (NOT Elevate Blue) and slides; unselected is text-secondary.
  Semantics: a group with a label and two buttons with aria-pressed. The three cells change with the sector (fade out, new ones rise 8px, 200ms).
  Each cell (one click target): the isometric `visual` (decorative), the lead sentence (h4), the description (body, secondary) and a tertiary link with an arrow.
  Each cell also carries 2 SUCCESS STORIES in a panel that covers the visual (visual and panel share ONE grid cell, so the stage is as tall as the taller of the two and the isometric stays centered in it): soft glow of the blue ramp under white 70% + blur, glass cards (radius card, white 70%,
  white hairline, card-rest). Hover or a focused LINK opens it (150ms). Touch (no hover): the button 'Success stories' opens it, an X (top right of the panel) closes it.
  The cases are NOT shown just by changing the toggle. Six visuals exist, one per item (templates/iso/scenes). The links go to # until the pages exist (the check gate rejects #).
*/
export type RouteCase = { title: string; result: string; href: string };
export type RouteItem = { id: string; lead: string; rest: string; href: string; linkLabel: string; visual: ReactNode; cases: [RouteCase, RouteCase] };
export type Sector = { id: string; label: string; items: [RouteItem, RouteItem, RouteItem] };

function Cell({ item, casesLabel, closeLabel }: { item: RouteItem; casesLabel: string; closeLabel: string }) {
  const [touchOpen, setTouchOpen] = useState(false);
  return (
    <li className="group relative flex min-w-0 flex-col pad-card transition-colors duration-fast hover:bg-white/50">
      <div className="relative grid">
        <div aria-hidden="true" className="col-start-1 row-start-1 mx-auto w-full max-w-sm self-center">
          {item.visual}
        </div>
        <div
          className={`relative z-10 col-start-1 row-start-1 overflow-hidden rounded-card border border-white/70 bg-white/70 p-3 backdrop-blur-sm transition-opacity duration-fast focus-within:opacity-100 group-hover:opacity-100 ${touchOpen ? "opacity-100" : "pointer-events-none opacity-0 focus-within:pointer-events-auto group-hover:pointer-events-auto"}`}
        >
          <p className="mono-label text-caption text-text-secondary">{casesLabel}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {item.cases.map((c) => (
              <li key={c.title}>
                <a href={c.href} className="btn-arrow flex items-start justify-between gap-3 rounded-card border border-white/70 bg-white/70 p-3 shadow-card-rest backdrop-blur-sm hover:bg-white/90 focus-ring">
                  <span className="min-w-0">
                    <span className="block font-display text-body-sm font-medium text-text-primary">{c.title}</span>
                    <span className="block text-caption text-text-secondary">{c.result}</span>
                  </span>
                  <span className="text-text-link">
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <button type="button" aria-label={closeLabel} onClick={() => setTouchOpen(false)} className="absolute right-1 top-1 hidden size-10 place-items-center text-text-link hover:text-text-link-hover focus-ring touch:grid">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {!touchOpen && (
          <button type="button" aria-expanded={false} onClick={() => setTouchOpen(true)} className="absolute bottom-0 right-0 hidden h-10 items-center rounded-button border border-border-default bg-white px-3 text-body-sm font-medium focus-ring touch:inline-flex">
            {casesLabel}
          </button>
        )}
      </div>
      <h3 className="mt-6 font-display text-h4 font-medium text-text-primary">{item.lead}</h3>
      <p className="mt-2 text-body text-text-secondary">{item.rest}</p>
      <a href={item.href} className="btn-arrow mt-auto inline-flex items-center gap-2 pt-6 font-display text-body-sm font-medium text-text-link hover:text-text-link-hover focus-ring after:absolute after:inset-0">
        {item.linkLabel}
        <ArrowIcon />
      </a>
    </li>
  );
}

export function AudienceRoutes({ title, lead, toggleLabel, casesLabel, closeLabel, sectors }: { title: string; lead: string; toggleLabel: string; casesLabel: string; closeLabel: string; sectors: [Sector, Sector] }) {
  const [sector, setSector] = useState(0);
  const current = sectors[sector];
  return (
    <section id="routes" className="relative isolate overflow-hidden bg-white section-y">
      <SectionGlow />
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="max-w-heading font-display font-medium text-h1 text-balance text-text-primary">{title}</h2>
            <p className="mt-4 max-w-lead text-lead text-text-secondary">{lead}</p>
          </div>
          <div role="group" aria-label={toggleLabel} className="inline-flex w-fit rounded-full border border-border-default bg-white/80 p-1 backdrop-blur-sm">
            {sectors.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sector === i}
                onClick={() => setSector(i)}
                className={`h-10 rounded-full px-4 font-display text-body-sm font-medium transition-colors duration-base focus-ring ${sector === i ? "bg-excellence-blue text-text-on-dark" : "text-text-secondary hover:text-text-primary"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ul key={current.id} className="glass rise mt-12 grid grid-cols-1 divide-y divide-border-default overflow-hidden rounded-bento-outer border border-border-default lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {current.items.map((item) => (
            <Cell key={item.id} item={item} casesLabel={casesLabel} closeLabel={closeLabel} />
          ))}
        </ul>
      </div>
    </section>
  );
}
