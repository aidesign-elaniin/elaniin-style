/* Client logos as boxes "Logo cliente 01": never a real brand until the client authorizes it. */
export function LogoStrip({ label, items }: { label: string; items: string[] }) {
  return (
    <section id="clientes" className="border-y border-border-default bg-surface-subtle">
      <div className="container-site section-y-compact">
        <h2 className="font-display font-medium text-h4 text-text-primary">{label}</h2>
        <ul className="mt-6 grid-auto" style={{ "--card-min": "9rem" } as React.CSSProperties}>
          {items.map((name) => (
            <li key={name} className="flex h-16 min-w-0 items-center justify-center rounded-card border border-border-default bg-white px-3 text-center text-body-sm text-text-muted">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
