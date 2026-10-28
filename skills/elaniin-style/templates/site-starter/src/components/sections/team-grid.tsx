import { Reveal } from "../ui/reveal";
import { ImagePlaceholder, PlaceholderChip } from "../ui/placeholder";

/* Lists of 6: col-span-6 md:col-span-4 xl:col-span-2 on grid-page (grid-auto would leave 4 + 2). */
export function TeamGrid({ title, people }: { title: string; people: { name: string; role: string }[] }) {
  return (
    <section id="equipo" className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display font-medium text-h2 text-text-primary">{title}</h2>
          <PlaceholderChip />
        </div>
        <div className="grid-page mt-10">
          {people.map((p, i) => (
            <div key={p.name} className="col-span-6 min-w-0 md:col-span-4 xl:col-span-2">
              <Reveal i={i}>
                <ImagePlaceholder src="/images/placeholder-1x1.svg" ratio="1 / 1" alt={`Foto de relleno de ${p.name}`} />
                <h3 className="mt-3 font-display font-medium text-h4 text-text-primary">{p.name}</h3>
                <p className="text-body-sm text-text-secondary">{p.role}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
