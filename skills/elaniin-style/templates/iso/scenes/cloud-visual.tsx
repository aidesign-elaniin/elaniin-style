"use client";

import { Activity } from "lucide-react";
import { Floor } from "../floor";
import { clamp01, easeOutCubic, pointsAttr, SCENE_W } from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import type { CloudVisualCopy } from "./types";
import { cn } from "../cn";
import { useClock } from "../use-clock";
import { VisualPanel, type VisualSize } from "./visual-panel";

/*
  Cloud card (DESIGN.md components.solutions-grid, mocks): one long glass bar in the cloud look carrying the pill
  "Availability", and beside it twelve small cubes (the instances) that drop in one by one as demand grows, three columns by
  four rows. Each lights its top edge in Elevate Blue as it lands and settles. The loop fades out and restarts. Under
  prefers-reduced-motion the scene rests on the full set of instances.
*/
const COLS = 3;
const ROWS = 4;
const CUBE = 28;
const PITCH = 44;
const CUBE_H = 16;
const BAR_W = 76;
const LIFT = 28;
const O = { x: 190, y: 42 };
const T = { first: 1100, every: 380, dropDur: 700, reset: 8300, loop: 9100, rest: 7000 };

export function CloudVisual({
  copy,
  size = "card",
  bare = false,
}: {
  copy: CloudVisualCopy;
  size?: VisualSize;
  bare?: boolean;
}) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  const depth = pillLength(copy.availability) + 16;
  const gridX = BAR_W + 28;
  const plate: SlabBox = {
    x: -12,
    y: -12,
    z: 0,
    w: gridX + COLS * PITCH - (PITCH - CUBE) + 24,
    d: depth + 24,
    h: 10,
  };
  const bar: SlabBox = { x: 0, y: 0, z: plate.h, w: BAR_W, d: depth, h: 26 };
  const gridY = (depth - (ROWS * PITCH - (PITCH - CUBE))) / 2;

  const cubes = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const box: SlabBox = {
      x: gridX + col * PITCH,
      y: gridY + row * PITCH,
      z: plate.h,
      w: CUBE,
      d: CUBE,
      h: CUBE_H,
    };
    const start = T.first + i * T.every;
    return {
      key: i,
      box,
      dz: 60 * (1 - easeOutCubic((t - start) / T.dropDur)),
      present: clamp01((t - start) / 300) * fade,
      lit: t < start + T.dropDur ? 0 : clamp01(1 - (t - start - T.dropDur) / 450) * fade,
    };
  });
  // Nearest to the viewer last.
  const ordered = [...cubes].sort((a, b) => a.box.x + a.box.y - (b.box.x + b.box.y));

  return (
    <VisualPanel size={size} bare={bare} className="p-2 max-md:p-2">
      <div ref={ref} className={cn("w-full", size === "fill" ? "max-w-[460px]" : "max-w-[320px] lg:max-w-none")}>
        <svg viewBox={`0 0 ${SCENE_W} 300`} className="block h-auto w-full overflow-visible" focusable="false">
          <Floor o={O} x={plate.x + 8} y={plate.y + 8} w={plate.w - 16} d={plate.d - 16} z={-LIFT} />
          <g className="iso-levitate">
            <Slab look="plate" box={plate} o={O} />
            <Slab look="cloud" box={bar} o={O} />
            <IsoPill
              o={O}
              z={bar.z + bar.h}
              cx={bar.w / 2}
              cy={depth / 2}
              name={copy.availability}
              icon={Activity}
              index={0}
            />

            {ordered.map((c) => (
              <g key={c.key} transform={`translate(0 ${(-c.dz).toFixed(2)})`} style={{ opacity: c.present }}>
                <Slab look="cloud" box={c.box} o={O} texture={false} />
                {c.lit > 0 && (
                  <polygon
                    points={pointsAttr(topFace(c.box), O)}
                    style={{
                      fill: "none",
                      stroke: "var(--color-elevate-blue)",
                      strokeWidth: 2,
                      strokeLinejoin: "round",
                      opacity: c.lit,
                    }}
                  />
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>
    </VisualPanel>
  );
}
