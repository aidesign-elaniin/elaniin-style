"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Entrance on scroll (utility `reveal`, active when <html class="js">). Wrapper keeps h-full min-w-0 so grid cells stay equal. */
export function Reveal({ children, i = 0, className = "" }: { children: ReactNode; i?: number; className?: string }) {
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
    <div ref={ref} className={`reveal h-full min-w-0 ${className}`} style={{ "--i": i } as React.CSSProperties}>
      {children}
    </div>
  );
}
