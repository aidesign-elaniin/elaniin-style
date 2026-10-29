"use client";

import { useId } from "react";
import { type Pt2, pointAt, pointsAttr, project } from "../iso";
import { clamp01 } from "../iso";
import { HaloFilter, IsoPulse } from "../pulse";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Engagement model 3, "Project delivery" (DESIGN.md motifs.engagement-scenes): three steps of rising height on a glass base,
  from discovery to launch. One pulse climbs the tops from the lowest to the highest, lighting each step as it passes; the
  highest then holds its lit edge before the loop restarts. There is no text. Under prefers-reduced-motion it rests on the
  lit top step.
*/
const O = { x: 231, y: 104 };
const PLATE: SlabBox = { x: -10, y: -10, z: 0, w: 140, d: 212, h: 8 };
const HEIGHTS = [66, 44, 22]; // the tallest at the back (y = 0), so the light climbs to the right
const STEPS: SlabBox[] = HEIGHTS.map((h, i) => ({ x: 0, y: i * 64, z: PLATE.h, w: 120, d: 64, h }));
const tops = HEIGHTS.map((h) => PLATE.h + h);

// The way of the light: along each top, then up the face of the next step.
const PATH = [
  { x: 60, y: 186, z: tops[2] },
  { x: 60, y: 128, z: tops[2] },
  { x: 60, y: 128, z: tops[1] },
  { x: 60, y: 64, z: tops[1] },
  { x: 60, y: 64, z: tops[0] },
  { x: 60, y: 6, z: tops[0] },
];
const SPEED = 0.1; // units per ms
const length = PATH.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.y - PATH[i].y, p.z - PATH[i].z), 0);
const RUN_MS = length / SPEED;
const T = { start: 600, loop: 5600, hold: 1400, rest: 3000 };
const arrive = T.start + RUN_MS;
const lane: Pt2[] = PATH.map((p) => project(p, O));
// When the light crosses the middle of the top of each step (tallest first).
const crossAt = [T.start + (58 + 22 + 64 + 22 + 29) / SPEED, T.start + (58 + 22 + 32) / SPEED, T.start + 29 / SPEED];

export function ProjectScene({ active }: { active: boolean }) {
  const { ref, t } = useClock(T.loop, 40, T.rest, active);
  const haloId = useId();
  const running = t >= T.start && t < arrive;
  const head = pointAt(lane, (t - T.start) / RUN_MS);
  const lit = (i: number) => {
    if (i === 0) return t < arrive ? clamp01(1 - Math.abs(t - crossAt[0]) / 400) : clamp01(1 - (t - arrive) / T.hold);
    return clamp01(1 - Math.abs(t - crossAt[i]) / 400);
  };
  const edge = (i: number) => {
    const amount = lit(i);
    return (
      amount > 0 && (
        <polygon
          points={pointsAttr(topFace(STEPS[i]), O)}
          style={{
            fill: "none",
            stroke: "var(--color-elevate-blue)",
            strokeWidth: 2,
            strokeLinejoin: "round",
            opacity: amount,
          }}
        />
      )
    );
  };

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg viewBox="-24 -18 448 336" className="block h-auto w-full" focusable="false">
        <defs>
          <HaloFilter id={haloId} />
        </defs>
        <g className="iso-levitate">
          <Slab look="dark" box={PLATE} o={O} />
          {STEPS.map((box, i) => (
            <g key={i}>
              <Slab look="dark" box={box} o={O} />
              {edge(i)}
            </g>
          ))}
          {running && (
            <IsoPulse
              x={head.x}
              y={head.y}
              haloId={haloId}
              opacity={clamp01((t - T.start) / 150) * clamp01((arrive - t) / 150)}
            />
          )}
        </g>
      </svg>
    </div>
  );
}
