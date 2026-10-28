import { CountUp } from "../ui/count-up";
import { PlaceholderChip } from "../ui/placeholder";

type Stat = { value: number; suffix: string; label: string };

/* Figures count up on entering the viewport. Client figures are ALWAYS said to be illustrative on screen. */
export function Stats({ title, note, items }: { title: string; note: string; items: Stat[] }) {
  return (
    <section id="resultados" className="section-y bg-surface-subtle">
      <div className="container-site">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display font-medium text-h2 text-text-primary">{title}</h2>
          <PlaceholderChip label={note} />
        </div>
        <dl className="grid-auto mt-10" style={{ "--card-min": "14rem" } as React.CSSProperties}>
          {items.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col border-t border-border-strong pt-4">
              <dt className="order-2 mt-1 text-body-sm text-text-secondary">{s.label}</dt>
              <dd className="font-display font-medium text-h1 text-text-primary">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
