import type { CSSProperties, ReactNode } from "react";
import { LinkButton } from "../ui/button";
import { ModuleField } from "../ui/module-field";

type Cta = { label: string; href: string };

/*
  Hero (DESIGN.md components.hero), ONE component with two official variants:
  - "centered": everything centered (the only centered section besides the closing CTA). Use it when the hero has nothing to explain visually.
  - "split": left aligned from 1024px, text in 6 of 12 columns and the isometric `visual` in the other 6, vertically centered on each other; below 1024px everything is
    CENTERED (heading, lead, button, then the visual under it at full width up to 560px). The lead is capped at 40ch and balanced below 1024px.
  Same heading (display-xl, balanced, at most FOUR lines at every width in both languages), lead (at most TWO lines, 56ch) and actions. ACTIONS: two lg buttons in one row
  with a 12px gap (stacked and full width below 768px): the primary is the SALES CTA, SHORT, with the arrow; the second is the muted `secondary` that leads to how projects are
  delivered. The accent words get `accent-flow` (a gradient of the blue ramp that flows through them; the second word is offset by 35% and 0.5s). From 1280px the hero is
  at least the height of the screen under the bar (`hero-fill`) with its content centered. Background: module-field (2px squares, 16px pitch). Pass `accents` for the 1-2 words.
*/
export function Hero({
  variant = "centered",
  before,
  accent,
  after,
  lead,
  primary,
  secondary,
  visual,
}: {
  variant?: "centered" | "split";
  before: string;
  accent: string;
  after: string;
  lead: string;
  primary: Cta;
  secondary?: Cta;
  visual?: ReactNode;
}) {
  const delay = (i: number) => ({ "--i": i }) as CSSProperties;
  const split = variant === "split" && visual;
  return (
    <section id="home" className="hero-fill relative isolate overflow-hidden border-b border-border-default section-y-statement">
      <ModuleField />
      <div className={`container-site relative ${split ? "grid-page items-center gap-y-12" : "flex flex-col items-center text-center"}`}>
        <div className={split ? "col-span-12 flex min-w-0 flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left" : "flex min-w-0 flex-col items-center"}>
          <h1 className={`rise break-words font-display font-medium text-display-xl text-balance text-text-primary ${split ? "max-w-hero lg:max-w-heading" : "max-w-hero"}`} style={delay(1)}>
            {before}
            <span className="accent-flow">{accent}</span>
            {after}
          </h1>
          <p className={`rise mt-6 text-lead text-text-secondary text-balance ${split ? "max-w-narrow lg:max-w-lead" : "max-w-lead"}`} style={delay(2)}>
            {lead}
          </p>
          <div className={`rise mt-10 flex w-full flex-col gap-3 md:w-auto md:flex-row ${split ? "items-center lg:items-start" : "items-center justify-center"}`} style={delay(3)}>
            <LinkButton href={primary.href} arrow className="max-md:w-full">
              {primary.label}
            </LinkButton>
            {secondary && (
              <LinkButton href={secondary.href} v="secondary" className="max-md:w-full">
                {secondary.label}
              </LinkButton>
            )}
          </div>
        </div>
        {split && (
          <div aria-hidden="true" className="rise col-span-12 mx-auto w-full max-w-xl min-w-0 lg:col-span-6 lg:max-w-none" style={delay(4)}>
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
