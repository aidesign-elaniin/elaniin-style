import Link from "next/link";
import { LinkButton } from "../components/ui/button";
import { ModuleField } from "../components/ui/module-field";
import { Tag } from "../components/ui/tag";
import { ArrowIcon } from "../components/ui/arrow";

/*
  404 (DESIGN.md components.not-found): inside the site shell (nav and footer from the layout). A white section with a hairline bottom border and the
  hero's module field behind it, LEFT aligned (not centered): a tag "404", the title (h1, display-lg, balanced, max 16ch), ONE lead sentence in text-secondary,
  and two buttons (primary lg to the home, tertiary to the contact). Under it a 3-cell hairline grid of useful links with border-x on its container, each cell one link
  (name in display h4, one line in body-sm, an arrow that slides 4px on hover; white, surface-subtle on hover; stacked below 768px). Status 404 and noindex (Next adds it).
*/
const links = [
  { name: "Servicios", text: "Texto de relleno: lo que hacemos.", href: "/servicios/" },
  { name: "Nosotros", text: "Texto de relleno: quiénes somos.", href: "/nosotros/" },
  { name: "Contacto", text: "Texto de relleno: hablemos.", href: "/contacto/" },
];

export default function NotFound() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border-default section-y">
        <ModuleField />
        <div className="container-site relative">
          <Tag>404</Tag>
          <h1 className="mt-6 max-w-hero font-display font-medium text-display-lg text-balance text-text-primary">Página no encontrada</h1>
          <p className="mt-4 max-w-lead text-lead text-text-secondary">La dirección no existe o cambió de lugar.</p>
          <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
            <LinkButton href="/" className="max-md:w-full">
              Volver al inicio
            </LinkButton>
            <LinkButton href="/contacto/" v="tertiary">
              Ir a contacto
            </LinkButton>
          </div>
        </div>
      </section>
      <div className="container-site border-x border-border-default p-0">
        <ul className="grid grid-cols-1 divide-y divide-border-default md:grid-cols-3 md:divide-x md:divide-y-0">
          {links.map((l) => (
            <li key={l.href} className="min-w-0">
              <Link href={l.href} className="btn-arrow flex h-full flex-col bg-white pad-card transition-colors duration-fast hover:bg-surface-subtle focus-ring">
                <span className="flex items-center justify-between font-display text-h4 font-medium text-text-primary">
                  {l.name}
                  <ArrowIcon />
                </span>
                <span className="mt-2 text-body-sm text-text-secondary">{l.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
