"use client";

import { useId } from "react";
import { type Pt2, pointAt, pointsAttr, project } from "../iso";
import { clamp01 } from "../iso";
import { HaloFilter, IsoPulse } from "../pulse";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Engagement model 2, "Dedicated development teams" (DESIGN.md motifs.engagement-scenes): a taller core slab, the product,
  in the middle of a glass base, with four small slabs at the corners (engineering, design, QA, delivery lead). One pulse
  goes round the four corners, lighting each as it passes, lap after lap. There is no text: the card names the roles.
*/
const O = { x: 200, y: 104 };
const PLATE: SlabBox = { x: -10, y: -10, z: 0, w: 184, d: 184, h: 8 };
const SMALL = 44;
const H = 22;
const corner = (x: number, y: number): SlabBox => ({ x, y, z: PLATE.h, w: SMALL, d: SMALL, h: H });
const CORNERS = [corner(0, 0), corner(120, 0), corner(120, 120), corner(0, 120)];
const CORE: SlabBox = { x: 48, y: 48, z: PLATE.h, w: 68, d: 68, h: 44 };
const LAP_MS = 4800;
const LIT_HALF = 500;

const centers = CORNERS.map((c) => ({ x: c.x + SMALL / 2, y: c.y + SMALL / 2, z: c.z + c.h }));
const lane: Pt2[] = [...centers, centers[0]].map((p) => project(p, O));

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

export function TeamScene({ active }: { active: boolean }) {
  const { ref, t } = useClock(LAP_MS, 40, 0, active);
  const haloId = useId();
  const head = pointAt(lane, t / LAP_MS);
  const litFor = (i: number) => {
    const at = (i * LAP_MS) / CORNERS.length;
    const d = Math.min(Math.abs(t - at), LAP_MS - Math.abs(t - at));
    return clamp01(1 - d / LIT_HALF);
  };

  return (
    <div ref={ref} aria-hidden="true" className="w-full">
      <svg viewBox="-24 -18 448 336" className="block h-auto w-full" focusable="false">
        <defs>
          <HaloFilter id={haloId} />
        </defs>
        <g className="iso-levitate">
          <Slab look="dark" box={PLATE} o={O} />
          {/* Back to front by the center of each footprint: corner 0, the core, corners 1 and 3, corner 2. */}
          {([0, "core", 1, 3, 2] as const).map((k) =>
            k === "core" ? (
              <g key={k}>
                <Slab look="dark" box={CORE} o={O} />
                {edge(CORE, 0.9)}
              </g>
            ) : (
              <g key={k}>
                <Slab look="dark" box={CORNERS[k]} o={O} />
                {edge(CORNERS[k], litFor(k))}
              </g>
            ),
          )}
          <IsoPulse x={head.x} y={head.y} haloId={haloId} />
        </g>
      </svg>
    </div>
  );
}
