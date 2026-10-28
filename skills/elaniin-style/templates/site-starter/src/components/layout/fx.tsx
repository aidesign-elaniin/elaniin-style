"use client";

import { useEffect } from "react";

/*
  Global liveliness, mounted once in the layout:
  - the page spotlight follows the pointer (--mx / --my),
  - every .card-glow follows the pointer inside the card (--cx / --cy),
  - <html class="js"> (set by an inline script) enables the reveal entrances.
  All of it is off with prefers-reduced-motion.
*/
export function Fx() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const onMove = (e: PointerEvent) => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".card-glow");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--cx", e.clientX - r.left + "px");
        card.style.setProperty("--cy", e.clientY - r.top + "px");
      }
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);
  return <div className="spotlight" aria-hidden="true" />;
}
