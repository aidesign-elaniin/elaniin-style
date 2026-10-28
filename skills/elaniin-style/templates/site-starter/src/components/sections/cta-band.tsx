import { LinkButton } from "../ui/button";
import { ModuleField } from "../ui/module-field";

/* Closing CTA: module-field in the dark tone. The title keeps max-w 34ch or more so it does not fall to three lines. */
export function CtaBand({ title, lead, action }: { title: string; lead: string; action: { label: string; href: string } }) {
  return (
    <section id="contacto" data-nav-theme="blue" className="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
      <ModuleField tone="dark" fade="left" />
      <div className="container-site relative text-center">
        <h2 className="mx-auto max-w-[34ch] break-words font-display font-medium text-h2 text-balance text-white">{title}</h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-lead text-text-on-dark-secondary">{lead}</p>
        <LinkButton href={action.href} arrow className="mt-10">
          {action.label}
        </LinkButton>
      </div>
    </section>
  );
}
