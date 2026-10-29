import { PlaceholderChip } from "../ui/placeholder";
import { Reveal } from "../ui/reveal";

type Item = { title: string; text: string };

/* Cards with a hover surface: rounded-card + border + pad-card, always. Not a grid-hairline (that is for cells without hover). */
export function FeatureGrid({ title, items, placeholder = false }: { title: string; items: Item[]; placeholder?: boolean }) {
  return (
    <section id="beneficios" className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display font-medium text-h2 text-text-primary">{title}</h2>
          {placeholder && <PlaceholderChip />}
        </div>
        <div className="grid-page mt-10">
          {items.map((it, i) => (
            <div key={it.title} className="col-span-12 min-w-0 md:col-span-4">
              <Reveal i={i}>
                <div className="card-hover h-full rounded-card border border-border-default bg-surface-card pad-card">
                  <h3 className="font-display font-medium text-h3 text-text-primary">{it.title}</h3>
                  <p className="mt-3 max-w-narrow break-words text-body text-text-secondary">{it.text}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
