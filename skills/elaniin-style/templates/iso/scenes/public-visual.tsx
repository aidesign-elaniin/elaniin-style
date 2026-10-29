"use client";

import { FileText, Route, ShieldCheck } from "lucide-react";
import { Floor } from "../floor";
import { COS30, clamp01 } from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox } from "../slab";
import { useClock } from "../use-clock";

/*
  Route 3, "Deliver a project for a public institution" (DESIGN.md motifs.isometric, three route resources): one wide slab with
  three pills of the same width (documented, secure, traceable). One after the other, each lights its outline and receives a
  check, and the checks stay: the audit trail. The loop resets with a fade, so it has no jump; under prefers-reduced-motion
  the scene rests with the three checks.
*/
const LIFT = 28;
const PILL_X = [30, 80, 130]; // the pills run along y, side by side along x
const SLAB_W = 160;
const ARRIVALS = [1500, 2500, 3500];
const T = { reset: 11400, loop: 12000, rest: 8000 };
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

export function PublicVisual({
  labels,
}: {
  labels: { documented: string; secure: string; traceable: string };
}) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  const pills = [
    { name: labels.documented, icon: FileText },
    { name: labels.secure, icon: ShieldCheck },
    { name: labels.traceable, icon: Route },
  ];
  // All three share the width of the longest, with room for the check.
  const length = Math.max(...pills.map((p) => pillLength(p.name, true)));

  // The slab and its plate follow the pill length; the scene is centered from its own extents (the language changes it).
  const plateH = 10;
  const slab: SlabBox = {
    x: 0,
    y: 0,
    z: plateH,
    w: SLAB_W,
    d: length + 24,
    h: 30,
  };
  const plate: SlabBox = {
    x: -14,
    y: -14,
    z: 0,
    w: slab.w + 28,
    d: slab.d + 28,
    h: plateH,
  };
  const O = {
    x: 200 - ((slab.w - slab.d) / 2) * COS30,
    y: 157 - ((slab.w + slab.d + 28) / 4 - 6),
  };
  const topZ = slab.z + slab.h;

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
            <Slab look="software" box={slab} o={O} />
            {pills.map((pill, i) => (
              <IsoPill
                key={pill.name}
                o={O}
                z={topZ}
                cx={PILL_X[i]}
                cy={slab.d / 2}
                name={pill.name}
                icon={pill.icon}
                index={i}
                length={length}
                check={clamp01((t - ARRIVALS[i]) / 250) * fade}
                lit={lit(t, ARRIVALS[i]) * fade}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
