"use client";

import { useEffect, useRef } from "react";

/*
  Elaniin module field for React / Next.js (same behavior as templates/module-field.js).
  Needs templates/tokens.css in the project: the resting grid is the `module-field` utility.
  Put it as the first child of a `relative isolate overflow-hidden` section; it listens on
  its parent. Props: fade = "bottom" (default) | "left" | "none"; tone = "light" | "dark".
*/
const RADIUS = 6;
const DECAY_MS = 260;
const STEPS = [
  { min: 0.66, size: 3 },
  { min: 0.33, size: 3 },
  { min: 0.04, size: 2 },
] as const;
const FALLBACK = ["#1054ff", "#4d75fd", "#6a9aff"];

type Fade = "bottom" | "left" | "none";
type Tone = "light" | "dark";

const fadeClass: Record<Fade, string> = {
  bottom: "",
  left: "module-field-mask-left",
  none: "module-field-mask-none",
};

export function ModuleField({ fade = "bottom", tone = "light" }: { fade?: Fade; tone?: Tone }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    const host = field?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!field || !canvas || !host || !ctx) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const cs = getComputedStyle(field);
    const pitch = parseFloat(cs.getPropertyValue("--module-pitch")) || 16;
    const colors = [1, 2, 3].map(
      (n, i) => cs.getPropertyValue(`--module-lit-${n}`).trim() || FALLBACK[i],
    );

    let cols = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = host.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / pitch);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const lit = new Map<number, number>();
    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      const dt = last ? now - last : 16;
      last = now;
      const k = Math.exp(-dt / DECAY_MS);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (const [key, v] of lit) {
        const next = v * k;
        if (next < 0.04) {
          lit.delete(key);
          continue;
        }
        lit.set(key, next);
        const step = STEPS.findIndex((s) => next >= s.min);
        const { size } = STEPS[step];
        ctx.fillStyle = colors[step];
        ctx.fillRect(
          (key % cols) * pitch + pitch / 2 - size / 2,
          Math.floor(key / cols) * pitch + pitch / 2 - size / 2,
          size,
          size,
        );
      }
      if (lit.size > 0) raf = requestAnimationFrame(draw);
      else {
        raf = 0;
        last = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / pitch;
      const cy = (e.clientY - rect.top) / pitch;
      const c0 = Math.floor(cx);
      const r0 = Math.floor(cy);
      for (let dy = -RADIUS; dy <= RADIUS; dy++) {
        for (let dx = -RADIUS; dx <= RADIUS; dx++) {
          const col = c0 + dx;
          const row = r0 + dy;
          if (col < 0 || col >= cols || row < 0) continue;
          const d = Math.hypot(col + 0.5 - cx, row + 0.5 - cy);
          if (d > RADIUS) continue;
          const v = Math.pow(1 - d / RADIUS, 1.4);
          const key = row * cols + col;
          if (v > (lit.get(key) ?? 0)) lit.set(key, v);
        }
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className={`module-field ${tone === "dark" ? "module-field-dark" : ""} ${fadeClass[fade]}`}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
