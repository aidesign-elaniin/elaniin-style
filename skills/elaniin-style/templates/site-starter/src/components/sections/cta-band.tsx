import { LinkButton } from "../ui/button";
import { GlowStripes } from "../ui/glow";
import { ModuleField } from "../ui/module-field";

/*
  Closing CTA (DESIGN.md components.cta): CENTERED on Excellence Blue, separated from the footer by a hairline. Background: the animated blue glow (`glow-cta`,
  bottom center, masked toward the top and sides so contrast never suffers) under the module grid in the dark tone, which fades toward the CENTER (squares around
  the edges, clear middle) and keeps reacting to the pointer. Content in a column of 56rem: the title in display-lg, white, max 22ch, balanced; ONE line below in
  lead size (on-dark-secondary, max 40ch, 24px under the title); 40px under it the primary lg + on-dark secondary lg side by side, centered (stacked and full
  width below 768px). No second sentence, no caption.
*/
export function CtaBand({ title, lead, action, secondary }: { title: string; lead: string; action: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <section id="contacto" data-nav-theme="blue" className="relative isolate overflow-hidden border-t border-border-on-dark bg-surface-dark text-text-on-dark section-y-statement">
      <GlowStripes variant="cta" />
      <ModuleField tone="dark" fade="center" />
      <div className="container-site relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mx-auto max-w-statement break-words font-display font-medium text-display-lg text-balance text-white">{title}</h2>
        <p className="mx-auto mt-6 max-w-narrow text-lead text-text-on-dark-secondary">{lead}</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 md:flex-row md:items-center">
          <LinkButton href={action.href} arrow>
            {action.label}
          </LinkButton>
          {secondary && (
            <LinkButton href={secondary.href} v="on-dark-secondary">
              {secondary.label}
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}
