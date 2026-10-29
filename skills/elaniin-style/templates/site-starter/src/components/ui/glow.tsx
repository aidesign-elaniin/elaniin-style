/*
  The glows of DESIGN.md motifs. Decorative: aria-hidden, pointer-events none. Parents are `relative isolate overflow-hidden`.
  - GlowStripes: the animated blue glow. variant "media" (stage of a case card, Blue Engine canvas) or "cta" (closing CTA, masked toward the top and sides).
  - SectionGlow: three blue blobs rising from the bottom of a section, each drifting slowly (transform only); only behind a `glass` panel (audience routes).
  card-glow / card-glow-quiet are plain utilities on the dark card itself.
*/
import type { CSSProperties } from "react";

export function GlowStripes({ variant = "media" }: { variant?: "media" | "cta" }) {
  return <div aria-hidden="true" className={`glow-stripes ${variant === "cta" ? "glow-cta" : "glow-media"}`} />;
}

// blue-300 45% (left -8%, bottom -18%, 58% x 98%, 17s) · blue-200 75% (right -8%, bottom -10%, 54% x 90%, 21s) · blue-300 32% (left 22%, bottom -24%, 56% x 78%, 25s)
const blobs = [
  { x: "-8%", y: "-18%", w: "58%", h: "98%", c: "var(--color-blue-300)", o: "45%", d: "17s" },
  { x: "54%", y: "-10%", w: "54%", h: "90%", c: "var(--color-blue-200)", o: "75%", d: "21s" },
  { x: "22%", y: "-24%", w: "56%", h: "78%", c: "var(--color-blue-300)", o: "32%", d: "25s" },
];

export function SectionGlow() {
  return (
    <div aria-hidden="true" className="section-glow">
      {blobs.map((b) => (
        <span key={b.d} className="section-glow-blob" style={{ "--x": b.x, "--y": b.y, "--w": b.w, "--h": b.h, "--c": b.c, "--o": b.o, "--d": b.d } as CSSProperties} />
      ))}
    </div>
  );
}
