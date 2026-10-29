"use client";

import { useId } from "react";
import { Layers, Server } from "lucide-react";
import { Floor } from "../floor";
import {
  clamp01,
  easeInOut,
  pointsAttr,
  project,
} from "../iso";
import { IsoPill } from "../pill";
import { HaloFilter, IsoPulse } from "../pulse";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Route 2, "Modernize a critical system" (DESIGN.md motifs.isometric, three route resources): a grey legacy slab and a
  light-blue modern slab. Four cubes move one by one from the legacy to the modern slab and turn blue as they land, while a
  pulse crosses both along the lane of the plate every 2.6s without ever stopping: the operation never stops. At the end the
  legacy slab steps back to half and the modern one is the system. The loop resets with a crossfade, so it has no jump.
*/
const O = { x: 158, y: 55 };
const LIFT = 28;
const PLATE: SlabBox = { x: -12, y: -12, z: 0, w: 280, d: 184, h: 10 };
const Z0 = PLATE.h;
const LEGACY: SlabBox = { x: 0, y: 0, z: Z0, w: 108, d: 140, h: 34 };
const MODERN: SlabBox = { x: 148, y: 0, z: Z0, w: 108, d: 140, h: 34 };
const CUBE = 18;
const CUBE_H = 14;
// Where the four cubes sit on a slab, relative to its corner: two flanking columns, clear of the pill in the middle.
const SLOTS = [
  { x: 17, y: 30 },
  { x: 17, y: 100 },
  { x: 91, y: 30 },
  { x: 91, y: 100 },
];
const LANE_Y = 156;
const LANE = { from: -6, to: 262 };
const SPEED = 0.1; // lane units per ms

const T = {
  first: 1800,
  gap: 1900,
  flight: 1300,
  pulses: [1000, 3600, 6200, 8800],
  retire: 8500,
  reset: 11400,
  loop: 12000,
  rest: 10500,
};

const cubeBox = (
  slab: SlabBox,
  slot: { x: number; y: number },
  lift = 0,
): SlabBox => ({
  x: slab.x + slot.x - CUBE / 2,
  y: slot.y - CUBE / 2,
  z: slab.z + slab.h + lift,
  w: CUBE,
  d: CUBE,
  h: CUBE_H,
});

export function ModernizationVisual({
  labels,
}: {
  labels: { legacy: string; modern: string };
}) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const haloId = useId();

  const resetP = clamp01((t - T.reset) / (T.loop - T.reset)); // 0 to 1 while the loop resets
  const retired = easeInOut(clamp01((t - T.retire) / 800)) * (1 - resetP);
  const legacyOpacity = 1 - 0.5 * retired;

  // Each cube: grey on the legacy slab until it leaves, in flight, then blue on the modern slab.
  const cubes = SLOTS.map((slot, k) => {
    const start = T.first + k * T.gap;
    const p = clamp01((t - start) / T.flight);
    const flying = t >= start && p < 1;
    const landed = p >= 1;
    const e = easeInOut(p);
    const a = cubeBox(LEGACY, slot);
    const b = cubeBox(MODERN, slot);
    const arc = 30 * Math.sin(Math.PI * e);
    const flight: SlabBox = {
      ...a,
      x: a.x + (b.x - a.x) * e,
      y: a.y + (b.y - a.y) * e,
      z: a.z + arc,
    };
    return { slot, a, b, flight, flying, landed, e };
  });

  const lane = [
    { x: LANE.from, y: LANE_Y, z: Z0 },
    { x: LANE.to, y: LANE_Y, z: Z0 },
  ].map((p) => project(p, O));

  // One pulse at a time, linear along the lane. A slab lights as it is crossed.
  const crossing = (center: number, start: number) =>
    start + (center - LANE.from) / SPEED;
  const litFor = (center: number) => {
    let v = 0;
    for (const s of T.pulses)
      v = Math.max(
        v,
        clamp01(1 - Math.abs(t - crossing(center, s) - 150) / 450),
      );
    return v;
  };
  const active = T.pulses.find(
    (s) => t >= s && t < s + (LANE.to - LANE.from) / SPEED,
  );
  const pulse =
    active === undefined
      ? null
      : project({ x: LANE.from + (t - active) * SPEED, y: LANE_Y, z: Z0 }, O);

  const legacyLit = litFor(LEGACY.x + LEGACY.w / 2) * (1 - retired);
  const modernLit = litFor(MODERN.x + MODERN.w / 2);
  const edge = (box: SlabBox, amount: number) =>
    amount > 0 && (
      <polygon
        points={pointsAttr(topFace(box), O)}
        style={{
          fill: "none",
          stroke: "var(--color-elevate-blue)",
          strokeWidth: 2,
          strokeLinejoin: "round",
          opacity: amount,
        }}
      />
    );

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg
        viewBox="-24 -18 448 336"
        className="block h-auto w-full"
        focusable="false"
      >
        <defs>
          <HaloFilter id={haloId} />
        </defs>

        <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
          <Floor
            o={O}
            x={PLATE.x + 8}
            y={PLATE.y + 8}
            w={PLATE.w - 16}
            d={PLATE.d - 16}
            z={-LIFT}
          />
        </g>

        <g className="iso-levitate">
          <g className="rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Slab look="plate" box={PLATE} o={O} />
            <polyline
              points={lane
                .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
                .join(" ")}
              style={{
                fill: "none",
                stroke: "var(--color-excellence-blue)",
                strokeOpacity: 0.4,
                strokeWidth: 1,
                strokeLinecap: "round",
              }}
            />
          </g>

          {/* Legacy: grey, with its cubes until each one leaves. It steps back once the move is done. */}
          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            <g style={{ opacity: legacyOpacity }}>
              <Slab look="cloud" box={LEGACY} o={O} />
              <IsoPill
                o={O}
                z={LEGACY.z + LEGACY.h}
                cx={LEGACY.x + LEGACY.w / 2}
                cy={LEGACY.d / 2}
                name={labels.legacy}
                icon={Server}
                index={0}
              />
              {edge(LEGACY, legacyLit)}
              {cubes.map((c, k) => {
                const opacity = t < T.first + k * T.gap ? 1 : resetP;
                return opacity > 0 ? (
                  <g key={k} style={{ opacity }}>
                    <Slab look="cloud" box={c.a} o={O} texture={false} />
                  </g>
                ) : null;
              })}
            </g>
          </g>

          {/* Modern: light blue, receiving the cubes. */}
          <g className="rise" style={{ "--i": 3 } as React.CSSProperties}>
            <Slab look="software" box={MODERN} o={O} />
            <IsoPill
              o={O}
              z={MODERN.z + MODERN.h}
              cx={MODERN.x + MODERN.w / 2}
              cy={MODERN.d / 2}
              name={labels.modern}
              icon={Layers}
              index={1}
            />
            {edge(MODERN, modernLit)}
            {cubes.map((c, k) =>
              c.landed ? (
                <g key={k} style={{ opacity: 1 - resetP }}>
                  <Slab look="brand" box={c.b} o={O} texture={false} />
                </g>
              ) : null,
            )}
          </g>

          {/* In flight: the cube turns from grey to blue as it crosses. */}
          {cubes.map((c, k) =>
            c.flying ? (
              <g key={k}>
                <g style={{ opacity: 1 - clamp01((c.e - 0.4) / 0.4) }}>
                  <Slab look="cloud" box={c.flight} o={O} texture={false} />
                </g>
                <g style={{ opacity: clamp01((c.e - 0.4) / 0.4) }}>
                  <Slab look="brand" box={c.flight} o={O} texture={false} />
                </g>
              </g>
            ) : null,
          )}

          {pulse && active !== undefined && (
            <IsoPulse
              x={pulse.x}
              y={pulse.y}
              haloId={haloId}
              opacity={
                clamp01((t - active) / 150) *
                clamp01((active + (LANE.to - LANE.from) / SPEED - t) / 150)
              }
            />
          )}
        </g>
      </svg>
    </div>
  );
}
