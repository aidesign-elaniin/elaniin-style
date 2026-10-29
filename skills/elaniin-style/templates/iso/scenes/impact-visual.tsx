"use client";

import { Landmark, User } from "lucide-react";
import { Floor } from "../floor";
import {
  clamp01,
  easeOutCubic,
  planeTransform,
  pointsAttr,
} from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Route "Reach the people you serve" (DESIGN.md components.audience-routes.visuals-interim): a service that reaches people. A block
  with a pill stands in the middle of a plate; waves leave it along the ground and every citizen node lights when the first wave
  reaches it, and stays lit. The nodes lie on the plate in perspective. The loop resets with a fade, so it has no jump; under
  prefers-reduced-motion the scene rests with every node lit and no wave.
*/
const LIFT = 28;
const PLATE_H = 10;
const CORE_H = 36;
const SIZE = 198; // the plate is square
const WAVES = [1000, 2000, 3000];
const WAVE_MS = 2400;
const WAVE_R = 150; // radius a wave reaches before it is gone
const NODE_R = 15;
const T = { reset: 11400, loop: 12000, rest: 8000 };
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

/*
  Where the citizens stand: an L along the two front edges, plus the two side corners of the plate. None stands behind the block
  (it is tall and would hide them): the sides are filled with the nodes that clear its silhouette.
*/
const NODES = [
  { x: SIZE - 20, y: 89 },
  { x: SIZE - 20, y: 132 },
  { x: SIZE - 20, y: SIZE - 20 },
  { x: 132, y: SIZE - 20 },
  { x: 89, y: SIZE - 20 },
  { x: 55, y: SIZE - 20 },
  { x: 19, y: SIZE - 20 }, // left corner
  { x: SIZE - 20, y: 47 },
  { x: SIZE - 20, y: 11 }, // right corner
];
const CORE_Y = 8; // the block stands toward the back, so the citizens have the front of the plate

export function ImpactVisual({ labels }: { labels: { label: string } }) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));
  const rest = t >= T.rest && t < T.reset; // reduced motion rests here: every node lit, no wave

  const length = pillLength(labels.label);
  const coreW = 90;
  const coreD = Math.min(SIZE - 50, length + 12);
  const top = PLATE_H + CORE_H;
  const plate: SlabBox = {
    x: -14,
    y: -14,
    z: 0,
    w: SIZE + 28,
    d: SIZE + 28,
    h: PLATE_H,
  };
  const core: SlabBox = {
    x: (SIZE - coreW) / 2,
    y: CORE_Y,
    z: PLATE_H,
    w: coreW,
    d: coreD,
    h: CORE_H,
  };
  const CENTER = { x: SIZE / 2, y: CORE_Y + coreD / 2 };
  const O = { x: 200, y: 134 - ((SIZE + SIZE + 28) / 4 - top / 2) };

  // The first wave reaches a node at this time; the node stays lit from then on.
  const reachedAt = (n: { x: number; y: number }) =>
    WAVES[0] + (Math.hypot(n.x - CENTER.x, n.y - CENTER.y) / WAVE_R) * WAVE_MS;
  const coreGlow = Math.max(...WAVES.map((w) => lit(t, w))) * fade;

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
            {/* The ground layer lies on the plate: the waves and the citizen nodes, in perspective. */}
            <g transform={planeTransform(O, PLATE_H)}>
              {!rest &&
                WAVES.map((start, i) => {
                  const k = clamp01((t - start) / WAVE_MS);
                  if (k <= 0 || k >= 1) return null;
                  return (
                    <circle
                      key={i}
                      cx={CENTER.x}
                      cy={CENTER.y}
                      r={easeOutCubic(k) * WAVE_R}
                      style={{
                        fill: "none",
                        stroke: "var(--color-elevate-blue)",
                        strokeWidth: 1.5,
                        opacity: (1 - k) * 0.7 * fade,
                      }}
                    />
                  );
                })}
              {NODES.map((node, i) => {
                const on = rest ? 1 : t >= reachedAt(node) ? fade : 0;
                return (
                  <g key={i}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_R}
                      style={{
                        fill:
                          on > 0
                            ? "var(--color-blue-tint-50)"
                            : "var(--color-white)",
                        stroke:
                          on > 0
                            ? "var(--color-elevate-blue)"
                            : "var(--color-excellence-blue)",
                        strokeOpacity: on > 0 ? 1 : 0.5,
                        strokeWidth: on > 0 ? 2 : 1,
                      }}
                    />
                    <User
                      x={node.x - 8}
                      y={node.y - 8}
                      width={16}
                      height={16}
                      strokeWidth={1.5}
                      style={{
                        color:
                          on > 0
                            ? "var(--color-elevate-blue)"
                            : "var(--color-text-secondary)",
                      }}
                    />
                  </g>
                );
              })}
            </g>

            <Slab look="software" box={core} o={O} />
            {coreGlow > 0 && (
              <polygon
                points={pointsAttr(topFace(core), O)}
                style={{
                  fill: "none",
                  stroke: "var(--color-elevate-blue)",
                  strokeWidth: 2,
                  strokeLinejoin: "round",
                  opacity: coreGlow,
                }}
              />
            )}
            <IsoPill
              o={O}
              z={top}
              cx={core.x + coreW / 2}
              cy={core.y + coreD / 2}
              name={labels.label}
              icon={Landmark}
              index={0}
              length={length}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
