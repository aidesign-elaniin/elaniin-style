type Item = { title: string; text: string };

/* Three cells in a hairline grid. No hover surface here, so the cells need no card chrome. */
export function FeatureGrid({ items }: { items: Item[] }) {
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="grid-hairline md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="pad-card">
              <h3 className="font-display font-medium text-h3 text-text-primary">{it.title}</h3>
              <p className="mt-3 max-w-[40ch] break-words text-body text-text-secondary">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
