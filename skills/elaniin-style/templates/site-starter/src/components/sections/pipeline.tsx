"use client";

import { useEffect, useRef, useState } from "react";

/*
  Living loop: the steps light up one after another and start over. It runs only while on screen (IntersectionObserver)
  and rests on its finished state with prefers-reduced-motion. Labels of 8 letters at most: longer ones break at 375px.
*/
const STEP_MS = 1400;

export function Pipeline({ title, steps }: { title: string; steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState(steps.length); // finished state until the loop starts

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && timer === null) {
          setPhase(0);
          timer = setInterval(() => setPhase((p) => (p + 1) % (steps.length + 2)), STEP_MS);
        } else if (!visible && timer !== null) {
          clearInterval(timer);
          timer = null;
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer !== null) clearInterval(timer);
    };
  }, [steps.length]);

  return (
    <section id="proceso" className="section-y">
      <div className="container-site">
        <h2 className="font-display font-medium text-h2 text-text-primary">{title}</h2>
        <ol ref={ref} className="mt-10 grid-auto" style={{ "--card-min": "9rem" } as React.CSSProperties}>
          {steps.map((label, i) => {
            const state = i < phase ? "done" : i === phase ? "active" : "idle";
            return (
              <li
                key={label}
                data-state={state}
                className="flex h-14 min-w-0 items-center gap-3 rounded-card border border-border-default bg-white px-4 font-display text-body font-medium text-text-secondary transition-colors duration-base data-[state=active]:border-elevate-blue data-[state=active]:text-text-primary data-[state=done]:text-text-primary"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-border-strong transition-colors duration-base data-[on=true]:bg-elevate-blue"
                  data-on={state !== "idle"}
                />
                <span className="truncate">{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
