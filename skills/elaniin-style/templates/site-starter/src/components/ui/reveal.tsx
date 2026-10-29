"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Entrance on scroll (utility `reveal`, active when <html class="js">): once, when 20% is in the viewport. `step` is the stagger between siblings: 60ms in lists (the research rows), 80ms between the solutions cards and between the cards of a cases row. A whole grid that reveals as one block passes no `i`. Wrapper keeps h-full min-w-0 so grid cells stay equal. */
export function Reveal({ children, i = 0, step = 60, className = "" }: { children: ReactNode; i?: number; step?: 60 | 80; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal h-full min-w-0 ${className}`} style={{ "--i": i, "--reveal-stagger": `${step}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}
