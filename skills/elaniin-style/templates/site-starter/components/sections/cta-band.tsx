import { ModuleField } from "@/components/ui/module-field";
import { LinkButton } from "@/components/ui/button";

export function CtaBand({ title, lead, action }: { title: string; lead: string; action: { label: string; href: string } }) {
  return (
    <section className="relative isolate overflow-hidden section-y bg-excellence-blue text-white">
      <ModuleField tone="dark" fade="left" />
      <div className="container-site relative text-center">
        <h2 className="mx-auto max-w-[20ch] break-words font-display font-medium text-h2 text-white">{title}</h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-lead text-text-on-dark-secondary">{lead}</p>
        <LinkButton href={action.href} arrow className="mt-10">
          {action.label}
        </LinkButton>
      </div>
    </section>
  );
}
