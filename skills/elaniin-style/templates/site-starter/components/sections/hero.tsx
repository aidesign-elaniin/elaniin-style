import { ModuleField } from "@/components/ui/module-field";
import { LinkButton } from "@/components/ui/button";

type Hero = {
  before: string;
  accent: string;
  after: string;
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/* Hero (centered variant): module-field background, display-xl, accent-flow, two CTAs. */
export function Hero({ before, accent, after, lead, primary, secondary }: Hero) {
  return (
    <section className="relative isolate overflow-hidden section-y" style={{ "--section-y": "112px" } as React.CSSProperties}>
      <ModuleField />
      <div className="container-site relative flex flex-col items-center text-center">
        <h1 className="rise max-w-[18ch] break-words font-display font-medium text-display-xl text-balance text-text-primary" style={{ "--i": 1 } as React.CSSProperties}>
          {before}
          <span className="accent-flow">{accent}</span>
          {after}
        </h1>
        <p className="rise mt-6 max-w-[56ch] text-lead text-text-secondary" style={{ "--i": 2 } as React.CSSProperties}>
          {lead}
        </p>
        <div className="rise mt-10 flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-row" style={{ "--i": 3 } as React.CSSProperties}>
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
