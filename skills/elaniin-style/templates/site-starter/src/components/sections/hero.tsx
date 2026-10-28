import type { CSSProperties } from "react";
import { LinkButton } from "../ui/button";
import { ModuleField } from "../ui/module-field";

type Cta = { label: string; href: string };

/* Hero (centered variant): module-field background, display-xl (at most 4 lines), accent-flow word, two CTAs. */
export function Hero({ before, accent, after, lead, primary, secondary }: { before: string; accent: string; after: string; lead: string; primary: Cta; secondary: Cta }) {
  const delay = (i: number) => ({ "--i": i }) as CSSProperties;
  return (
    <section id="inicio" className="relative isolate overflow-hidden section-y" style={{ "--section-y": "112px" } as CSSProperties}>
      <ModuleField />
      <div className="container-site relative flex flex-col items-center text-center">
        <h1 className="rise max-w-[18ch] break-words font-display font-medium text-display-xl text-balance text-text-primary" style={delay(1)}>
          {before}
          <span className="accent-flow">{accent}</span>
          {after}
        </h1>
        <p className="rise mt-6 max-w-[56ch] text-lead text-text-secondary" style={delay(2)}>
          {lead}
        </p>
        <div className="rise mt-10 flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-row" style={delay(3)}>
          <LinkButton href={primary.href} arrow className="max-md:w-full">
            {primary.label}
          </LinkButton>
          <LinkButton href={secondary.href} v="secondary" className="max-md:w-full">
            {secondary.label}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
