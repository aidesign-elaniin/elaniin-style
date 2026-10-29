import type { ReactNode } from "react";
import { IconBox } from "../ui/icon-box";
import { Reveal } from "../ui/reveal";
import { SolutionDialog, type SolutionDetail } from "./solution-dialog";

/*
  Solutions grid (DESIGN.md components.solutions-grid / solution-card). Section on Inspire Grey; three cards with the SAME looks as the nav
  solution cards (utilities solution-software / solution-ai / solution-cloud: software light blue + module grid, AI Excellence Blue + square
  grid, cloud Inspire Grey + layer lines). Order: AI delivery, software, cloud. Budget: lead ~25 characters (28 max), rest ~100 (110 max),
  section lead 130 max. The call to action lives only in the dialog; the cards carry no link. The visual is an isometric scene (same viewBox width
  in the three cards, SCENE_W, capped at 320px below 1024px).
*/
export type Look = "software" | "ai" | "cloud";
export type Solution = {
  id: string;
  look: Look;
  name: string;
  lead: string;
  rest: string;
  icon: ReactNode; // 24px stroke icon (the official Elaniin icons for software, AI and cloud)
  visual: ReactNode; // isometric scene, aria-hidden
  detail: SolutionDetail;
  openLabel: string; // accessible name of the expand button
};

const look: Record<Look, { surface: string; text: string; lead: string; rest: string; border: string; button: string; dark: boolean }> = {
  software: { surface: "solution-software", text: "text-text-primary", lead: "text-text-primary", rest: "text-text-secondary", border: "border-border-strong", button: "border-border-default bg-white text-text-primary", dark: false },
  cloud: { surface: "solution-cloud", text: "text-text-primary", lead: "text-text-primary", rest: "text-text-secondary", border: "border-border-strong", button: "border-border-default bg-white text-text-primary", dark: false },
  ai: { surface: "solution-ai", text: "text-text-on-dark", lead: "text-text-on-dark", rest: "text-text-on-dark-secondary", border: "border-border-on-dark", button: "border-border-on-dark bg-white/10 text-white", dark: true },
};

function SolutionCard({ s }: { s: Solution }) {
  const l = look[s.look];
  return (
    <article className={`${l.surface} ${l.border} ${l.text} flex h-full min-w-0 flex-col rounded-card border pad-card`}>
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconBox dark={l.dark}>{s.icon}</IconBox>
          <p className="min-w-0 truncate font-display text-body font-medium">{s.name}</p>
        </div>
        <SolutionDialog detail={s.detail} look={s.look} openLabel={s.openLabel} buttonClass={l.button} />
      </div>
      <h3 className={`relative mt-6 break-words font-display text-h4 font-medium ${l.lead}`}>{s.lead}</h3>
      <p className={`relative mt-2 text-body ${l.rest}`}>{s.rest}</p>
      <div aria-hidden="true" className="relative mx-auto mt-auto w-full max-w-xs pt-8 lg:max-w-none">
        {s.visual}
      </div>
    </article>
  );
}

export function SolutionsGrid({ title, lead, leadRest, items }: { title: string; lead: string; leadRest: string; items: Solution[] }) {
  return (
    <section id="soluciones" className="bg-surface-subtle section-y">
      <div className="container-site">
        <div className="max-w-heading">
          <h2 className="font-display font-medium text-h1 text-balance text-text-primary">{title}</h2>
        </div>
        <p className="mt-4 max-w-lead text-lead text-text-secondary">
          <span className="font-medium text-text-primary">{lead}</span> {leadRest}
        </p>
        <ul className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {items.map((s, i) => (
            <li key={s.id} className="min-w-0">
              <Reveal i={i}>
                <SolutionCard s={s} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
