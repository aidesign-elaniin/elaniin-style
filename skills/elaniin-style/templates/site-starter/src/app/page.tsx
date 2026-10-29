import { PageShell } from "../components/layout/page-shell";
import { CtaBand } from "../components/sections/cta-band";
import { FeatureGrid } from "../components/sections/feature-grid";
import { Hero } from "../components/sections/hero";
import { LogoStrip } from "../components/sections/logo-strip";
import { Pipeline } from "../components/sections/pipeline";
import { Stats } from "../components/sections/stats";
import { home } from "../content/home";

// Page type: HOME (content: mixed). Text lives in src/content/home.ts.
export default function HomePage() {
  return (
    <PageShell path="/">
      <Hero {...home.hero} />
      <LogoStrip label={home.clientsLabel} logos={home.clients.map((name) => ({ name, node: <span className="text-body-sm">{name}</span> }))} />
      <FeatureGrid title={home.featuresTitle} items={home.features} placeholder />
      <Stats title={home.statsTitle} note={home.statsNote} items={home.stats} />
      <Pipeline title={home.loopTitle} steps={home.loopSteps} />
      <CtaBand {...home.cta} />
    </PageShell>
  );
}
