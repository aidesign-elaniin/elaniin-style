"use client";

import { Users } from "lucide-react";
import { Floor } from "../floor";
import { clamp01, easeOutCubic, pointsAttr } from "../iso";
import { IsoLogotipo } from "../logotipo";
import { IsoPill } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Route 1, "Scale your engineering team" (DESIGN.md motifs.isometric, three route resources): one slab is your team; a wider
  one, in the blue ramp and carrying the logotipo once, drops into the empty space and docks, lighting its edge as it lands.
  The team grows. The loop resets with a fade, so it has no jump; under prefers-reduced-motion the scene rests
  on the docked team.
*/
const O = { x: 175, y: 71 };
const LIFT = 28;
const BAR = { w: 64, d: 170, h: 30 };
const SLOTS = [0, 76];
const PLATE: SlabBox = { x: -12, y: -12, z: 0, w: 252, d: BAR.d + 24, h: 10 };
const bar = (x: number): SlabBox => ({ x, y: 0, z: PLATE.h, ...BAR });

const T = {
  drops: [1500],
  dropDur: 1200,
  reset: 11400,
  loop: 12000,
  rest: 8000,
};
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

export function StaffVisual({ labels }: { labels: { team: string } }) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  const team = bar(SLOTS[0]);
  const joiners = T.drops.map((start) => {
    // One wide slab covers the space of the two empty slots, so the logotipo is not repeated.
    const box: SlabBox = {
      ...bar(SLOTS[1]),
      w: PLATE.x + PLATE.w - 12 - SLOTS[1],
    };
    return {
      box,
      dz: 70 * (1 - easeOutCubic((t - start) / T.dropDur)),
      present: clamp01((t - start) / 400) * fade,
      lit: lit(t, start + T.dropDur) * fade,
    };
  });

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg
        viewBox="-24 -18 448 336"
        className="block h-auto w-full"
        focusable="false"
      >
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
          </g>

          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            <Slab look="software" box={team} o={O} />
            <IsoPill
              o={O}
              z={team.z + team.h}
              cx={team.x + team.w / 2}
              cy={team.d / 2}
              name={labels.team}
              icon={Users}
              index={0}
            />
          </g>

          {/* The joiners drop in from above and dock. */}
          {joiners.map((j, i) => (
            <g
              key={i}
              transform={`translate(0 ${(-j.dz).toFixed(2)})`}
              style={{ opacity: j.present }}
            >
              <Slab look="brand" box={j.box} o={O} />
              <IsoLogotipo
                o={O}
                box={j.box}
                width={72}
                tone="black"
                face="top"
              />
              {j.lit > 0 && (
                <polygon
                  points={pointsAttr(topFace(j.box), O)}
                  style={{
                    fill: "none",
                    stroke: "var(--color-elevate-blue)",
                    strokeWidth: 2,
                    strokeLinejoin: "round",
                    opacity: j.lit,
                  }}
                />
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
