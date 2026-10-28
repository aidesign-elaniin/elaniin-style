import { CtaBand } from "@/components/sections/cta-band";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Hero } from "@/components/sections/hero";
import { home } from "@/content/home";

// Page type: HOME. Text lives in content/home.ts.
export default function HomePage() {
  return (
    <>
      <Hero {...home.hero} />
      <FeatureGrid items={home.features} />
      <CtaBand {...home.cta} />
    </>
  );
}
