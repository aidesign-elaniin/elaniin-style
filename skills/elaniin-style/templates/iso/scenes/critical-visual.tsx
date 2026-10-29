"use client";

import { ShieldCheck } from "lucide-react";
import { Floor } from "../floor";
import {
  COS30,
  clamp01,
  easeOutCubic,
  pointsAttr,
} from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Route "Build critical software" (DESIGN.md components.audience-routes.visuals-interim): a core protected by a perimeter. The core
  grows from the plate; four low walls rise around it, one by one and clockwise, each lighting its top edge; when the ring is
  closed a pill with a shield receives a check. The loop resets with a fade, so it has no jump; under prefers-reduced-motion the
  scene rests closed, with the check.
*/
const LIFT = 28;
const PLATE_H = 10;
const CORE_H = 56;
const WALL_H = 16;
const WALL_T = 12;
const CORE_AT = 800;
const CORE_MS = 1200;
const WALL_AT = [2300, 2800, 3300, 3800]; // west, north, east, south
const WALL_MS = 500;
const CHECK_AT = 4600;
const T = { reset: 11400, loop: 12000, rest: 8000 };
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

export function CriticalVisual({ labels }: { labels: { label: string } }) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  // The core is as deep as the pill is long (the language changes it); the perimeter and the plate follow it.
  const length = pillLength(labels.label, true);
  const coreW = 90;
  const coreD = length + 20;
  const W = coreW + 2 * (WALL_T + 28);
  const D = coreD + 2 * (WALL_T + 12);
  const top = PLATE_H + CORE_H;
  const plate: SlabBox = {
    x: -14,
    y: -14,
    z: 0,
    w: W + 28,
    d: D + 28,
    h: PLATE_H,
  };
  const O = {
    x: 200 - ((W - D) / 2) * COS30,
    y: 124 - ((W + D + 28) / 4 - top / 2),
  };

  const grow = easeOutCubic((t - CORE_AT) / CORE_MS) * fade;
  const core: SlabBox = {
    x: (W - coreW) / 2,
    y: WALL_T + 12,
    z: PLATE_H,
    w: coreW,
    d: coreD,
    h: Math.max(0.01, CORE_H * grow),
  };

  const walls: SlabBox[] = [
    { x: 0, y: 0, z: PLATE_H, w: WALL_T, d: D, h: WALL_H }, // west
    { x: 0, y: 0, z: PLATE_H, w: W, d: WALL_T, h: WALL_H }, // north
    { x: W - WALL_T, y: 0, z: PLATE_H, w: WALL_T, d: D, h: WALL_H }, // east
    { x: 0, y: D - WALL_T, z: PLATE_H, w: W, d: WALL_T, h: WALL_H }, // south
  ];
  const wall = (i: number) => {
    const k = easeOutCubic((t - WALL_AT[i]) / WALL_MS) * fade;
    return {
      box: { ...walls[i], h: Math.max(0.01, WALL_H * k) },
      show: k > 0.01,
      glow: lit(t, WALL_AT[i] + WALL_MS) * fade,
    };
  };
  const edge = (box: SlabBox, glow: number) =>
    glow > 0 && (
      <polygon
        points={pointsAttr(topFace(box), O)}
        style={{
          fill: "none",
          stroke: "var(--color-elevate-blue)",
          strokeWidth: 2,
          strokeLinejoin: "round",
          opacity: glow,
        }}
      />
    );
  const back = [0, 1].map(wall);
  const front = [2, 3].map((i) => wall(i));

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg
        viewBox="-24 -18 448 336"
        className="block h-auto w-full overflow-visible"
        focusable="false"
      >
        <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
          <Floor
            o={O}
            x={plate.x + 8}
            y={plate.y + 8}
            w={plate.w - 16}
            d={plate.d - 16}
            z={-LIFT}
          />
        </g>

        <g className="iso-levitate">
          <g className="rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Slab look="plate" box={plate} o={O} />
          </g>

          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            {back.map(
              (w, i) =>
                w.show && (
                  <g key={`b${i}`}>
                    <Slab look="brand" box={w.box} o={O} />
                    {edge(w.box, w.glow)}
                  </g>
                ),
            )}

            {grow > 0.01 && (
              <g>
                <Slab look="software" box={core} o={O} />
                {edge(core, lit(t, CHECK_AT) * fade)}
              </g>
            )}

            {front.map(
              (w, i) =>
                w.show && (
                  <g key={`f${i}`}>
                    <Slab look="brand" box={w.box} o={O} />
                    {edge(w.box, w.glow)}
                  </g>
                ),
            )}

            <g style={{ opacity: clamp01((t - CHECK_AT + 200) / 300) * fade }}>
              <IsoPill
                o={O}
                z={top}
                cx={core.x + coreW / 2}
                cy={core.y + coreD / 2}
                name={labels.label}
                icon={ShieldCheck}
                index={0}
                length={length}
                check={clamp01((t - CHECK_AT) / 250) * fade}
                lit={lit(t, CHECK_AT) * fade}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
