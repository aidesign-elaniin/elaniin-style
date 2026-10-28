import { LinkButton } from "../components/ui/button";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-site">
        <h1 className="font-display font-medium text-h1 text-text-primary">Página no encontrada</h1>
        <p className="mt-4 text-lead text-text-secondary">La dirección no existe o cambió de lugar.</p>
        <LinkButton href="/" className="mt-8">
          Volver al inicio
        </LinkButton>
      </div>
    </section>
  );
}
