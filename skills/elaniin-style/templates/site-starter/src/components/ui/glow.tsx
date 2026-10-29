/*
  The glows of DESIGN.md motifs. Decorative: aria-hidden, pointer-events none. Parents are `relative isolate overflow-hidden`.
  - GlowStripes: the animated blue glow. variant "media" (stage of a case card, Blue Engine canvas) or "cta" (closing CTA, masked toward the top and sides).
  - SectionGlow: blue blobs rising from the bottom of a section; only behind a `glass` panel (audience routes).
  card-glow / card-glow-quiet are plain utilities on the dark card itself.
*/
export function GlowStripes({ variant = "media" }: { variant?: "media" | "cta" }) {
  return <div aria-hidden="true" className={`glow-stripes ${variant === "cta" ? "glow-cta" : "glow-media"}`} />;
}

export function SectionGlow() {
  return <div aria-hidden="true" className="section-glow" />;
}
