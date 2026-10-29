"use client";

import { useEffect, useRef, useState } from "react";

/*
  Timeline clock for product scenes. `t` is the elapsed time (ms) inside a loop of `periodMs`; the scene derives
  every state from it (what is typed, which step is done, which screen shows). It only runs while the scene is on screen
  (IntersectionObserver) and `enabled` (a scene in a card that is closed pauses). Under prefers-reduced-motion `t` stays at
  `restMs` (the end of the loop unless a scene says otherwise): the finished, meaningful state.
  Dependency-free version of the site's hook (the site uses motion/react's useInView/useReducedMotion).
*/
export function useClock(periodMs: number, tickMs = 50, restMs = periodMs - 1, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [t, setT] = useState(0);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView || !enabled) return;
    const id = setInterval(() => setT((v) => (v + tickMs) % periodMs), tickMs);
    return () => clearInterval(id);
  }, [inView, reduce, enabled, periodMs, tickMs]);

  return { ref, t: reduce ? restMs : t };
}
