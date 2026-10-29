"use client";

import { useEffect, useState } from "react";

/*
  Client strip (DESIGN.md components.logo-strip): a hairline grid, the label cell plus FOUR logo cells that change their logo in turn. 5 columns from 1024px; from 768px
  the label full width and the four cells in one row; 2x2 below 768px. Cells are split by 1px lines. Each cell crossfades through the logos of the visitor's region, 3s per
  logo with 0.3s fades; cell j is one logo behind cell j-1 and the cells change 400ms apart left to right, so two cells never show the same logo (a small client timer, so
  the number of logos can change; with four logos or fewer nothing rotates). Only opacity animates; under prefers-reduced-motion each cell rests on its first logo. The cells are
  aria-hidden; the real names are announced once in a visually hidden list. Logos 48px high in cells 144px high, width limit 80%, grayscale at 80% opacity (full color on hover).
  Region: 'world' or 'sv' decided by the proxy (templates/i18n/region.ts, cookie `region`); pass the logos already filtered. A real client logo needs the client's authorization;
  until then pass placeholder names. Brand names are not translated.
*/
export type ClientLogo = { name: string; node: React.ReactNode };
const CELLS = 4;
const HOLD = 3000;
const STAGGER = 400;

export function LogoStrip({ label, logos }: { label: string; logos: ClientLogo[] }) {
  const [tick, setTick] = useState(0);
  const rotate = logos.length > CELLS;
  useEffect(() => {
    if (!rotate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), HOLD);
    return () => clearInterval(id);
  }, [rotate]);
  return (
    <section id="clients" className="border-b border-border-default">
      <div className="container-site grid grid-cols-2 gap-px border-x border-border-default bg-border-default md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 flex items-center bg-white p-6 md:col-span-4 lg:col-span-1">
          <h2 className="max-w-heading font-display text-h4 font-medium text-text-primary">{label}</h2>
        </div>
        {Array.from({ length: CELLS }, (_, j) => {
          const idx = rotate ? (tick + j) % logos.length : j % Math.max(logos.length, 1);
          const logo = logos[idx];
          return (
            <div key={j} aria-hidden="true" className="group flex min-h-36 items-center justify-center bg-white p-6 transition-colors duration-fast hover:bg-surface-subtle" style={{ transitionDelay: `${j * STAGGER}ms` }}>
              <div key={idx} className="flex h-12 max-w-4/5 items-center text-text-secondary opacity-80 grayscale transition-opacity duration-300 group-hover:text-text-primary group-hover:opacity-100 group-hover:grayscale-0">
                {logo?.node}
              </div>
            </div>
          );
        })}
      </div>
      <ul className="sr-only">
        {logos.map((l) => (
          <li key={l.name}>{l.name}</li>
        ))}
      </ul>
    </section>
  );
}
