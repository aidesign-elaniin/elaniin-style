"use client";

import { AppWindow } from "lucide-react";
import { Floor } from "../floor";
import {
  COS30,
  clamp01,
  easeOutCubic,
  pointsAttr,
  project,
} from "../iso";
import { IsoPill, pillLength } from "../pill";
import {
  Slab,
  type SlabBox,
  type SlabLook,
  topFace,
} from "../slab";
import { useClock } from "../use-clock";

/*
  Route "Build the software your business runs on" (DESIGN.md components.audience-routes.visuals-interim): the product is built in
  layers. A dashed outline on the plate shows the finished product; three layers (data, logic, interface) drop in order and
  dock, each lighting its top edge; then a pill with the product receives a check. The loop resets with a fade, so it has no
  jump; under prefers-reduced-motion the scene rests built, with the check.
*/
const LIFT = 28;
const PLATE_H = 10;
const LAYER_H = 22;
const LAYERS: { look: SlabLook; at: number }[] = [
  { look: "cloud", at: 1200 }, // data
  { look: "software", at: 2400 }, // logic
  { look: "brand", at: 3600 }, // interface
];
const DROP = 44;
const DROP_MS = 900;
const CHECK_AT = 4700;
const T = { reset: 11400, loop: 12000, rest: 8000 };
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

export function SoftwareVisual({ labels }: { labels: { product: string } }) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  // The footprint follows the pill length (the language changes it), so the scene is centered from its own extents.
  const length = pillLength(labels.product, true);
  const w = 180;
  const d = length + 24;
  const top = PLATE_H + LAYER_H * LAYERS.length;
  const plate: SlabBox = {
    x: -14,
    y: -14,
    z: 0,
    w: w + 28,
    d: d + 28,
    h: PLATE_H,
  };
  const O = {
    x: 200 - ((w - d) / 2) * COS30,
    y: 158 - ((w + d + 28) / 4 - top / 2),
  };
  const layers = LAYERS.map((layer, i): SlabBox => ({
    x: 0,
    y: 0,
    z: PLATE_H + i * LAYER_H,
    w,
    d,
    h: LAYER_H,
  }));

  // The idea: the outline of the finished product, fading as the layers fill it.
  const outline = clamp01(1 - (t - LAYERS[2].at) / 600) * fade;
  const corners = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: d },
    { x: 0, y: d },
  ];

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
            {outline > 0 && (
              <g
                style={{
                  fill: "none",
                  stroke: "var(--color-border-input)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                  strokeLinejoin: "round",
                  opacity: outline,
                }}
              >
                <polygon
                  points={pointsAttr(
                    corners.map((c) => ({ ...c, z: top })),
                    O,
                  )}
                />
                {corners.map((c, i) => {
                  const a = project({ ...c, z: PLATE_H }, O);
                  const b = project({ ...c, z: top }, O);
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
                })}
              </g>
            )}

            {layers.map((box, i) => {
              const start = LAYERS[i].at;
              const dz = DROP * (1 - easeOutCubic((t - start) / DROP_MS));
              const present = clamp01((t - start) / 350) * fade;
              const glow = lit(t, start + DROP_MS) * fade;
              return (
                <g
                  key={i}
                  transform={`translate(0 ${(-dz).toFixed(2)})`}
                  style={{ opacity: present }}
                >
                  <Slab look={LAYERS[i].look} box={box} o={O} />
                  {glow > 0 && (
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
                  )}
                </g>
              );
            })}

            <g style={{ opacity: clamp01((t - CHECK_AT + 200) / 300) * fade }}>
              <IsoPill
                o={O}
                z={top}
                cx={w / 2}
                cy={d / 2}
                name={labels.product}
                icon={AppWindow}
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
