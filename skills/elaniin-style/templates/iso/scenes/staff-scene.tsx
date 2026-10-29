"use client";

import { User } from "lucide-react";
import { clamp01, easeOutCubic, pointsAttr } from "../iso";
import { IsoPill } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Engagement model 1, "Staff augmentation" (DESIGN.md motifs.engagement-scenes): three slabs drop one after another into
  one lane, each lights its edge as it lands and takes a named engineer: you know each one by name. They hold and fade
  out at the end of the loop, so there is no jump. Under prefers-reduced-motion it rests on the docked row.
*/
const O = { x: 170, y: 90 };
const PLATE: SlabBox = { x: -8, y: -8, z: 0, w: 224, d: 146, h: 8 };
const BAR = { w: 64, d: 130, h: 26 };
const SLOTS = [0, 72, 144];
const bar = (x: number): SlabBox => ({ x, y: 0, z: PLATE.h, ...BAR });

const T = { first: 1000, gap: 1000, drop: 900, reset: 6400, loop: 7000, rest: 4800 };
const LIT_MS = 500;

export function StaffScene({ names, active }: { names: [string, string, string]; active: boolean }) {
  const { ref, t } = useClock(T.loop, 50, T.rest, active);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg viewBox="-24 -18 448 336" className="block h-auto w-full" focusable="false">
        <g className="iso-levitate">
          <Slab look="dark" box={PLATE} o={O} />
          {SLOTS.map((x, i) => {
            const box = bar(x);
            const start = T.first + i * T.gap;
            const dz = 70 * (1 - easeOutCubic((t - start) / T.drop));
            const lit = t < start + T.drop ? 0 : clamp01(1 - (t - start - T.drop) / LIT_MS) * fade;
            return (
              <g
                key={i}
                transform={`translate(0 ${(-dz).toFixed(2)})`}
                style={{ opacity: clamp01((t - start) / 300) * fade }}
              >
                <Slab look="dark" box={box} o={O} />
                <IsoPill
                  o={O}
                  z={box.z + box.h}
                  cx={box.x + box.w / 2}
                  cy={box.d / 2}
                  name={names[i]}
                  icon={User}
                  index={i}
                />
                {lit > 0 && (
                  <polygon
                    points={pointsAttr(topFace(box), O)}
                    style={{
                      fill: "none",
                      stroke: "var(--color-elevate-blue)",
                      strokeWidth: 2,
                      strokeLinejoin: "round",
                      opacity: lit,
                    }}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
