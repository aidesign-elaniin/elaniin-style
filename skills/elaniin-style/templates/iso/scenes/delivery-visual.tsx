"use client";

import { useId } from "react";
import { FlaskConical, GitPullRequest, Layers, Rocket } from "lucide-react";
import { clamp01, pointsAttr, project, SCENE_W } from "../iso";
import { IsoPill, pillLength } from "../pill";
import { HaloFilter, IsoPulse } from "../pulse";
import { Slab, type SlabBox, topFace } from "../slab";
import type { DeliveryVisualCopy } from "./types";
import { cn } from "../cn";
import { useClock } from "../use-clock";
import { VisualPanel, type VisualSize } from "./visual-panel";

/*
  AI delivery card (DESIGN.md components.solutions-grid, mocks): the pipeline as four glass strips side by side, one per
  stage, each with a pill. One pulse crosses the front edge of the base from the first strip to the last; every strip lights
  its top edge in Elevate Blue and its pill shows the check as the pulse passes. The last one holds, then the loop fades out
  and restarts. Under prefers-reduced-motion the scene rests on the finished pipeline.
*/
const ICONS = [FlaskConical, GitPullRequest, Layers, Rocket];
const STRIP = 46;
const GAP = 12;
const H = 12;
const O = { x: 206, y: 40 };
const T = { start: 700, travel: 4600, reset: 8200, loop: 9000, rest: 6200 };

export function DeliveryVisual({
  copy,
  size = "card",
  bare = false,
}: {
  copy: DeliveryVisualCopy;
  size?: VisualSize;
  bare?: boolean;
}) {
  const haloId = useId();
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  const length = Math.max(...copy.steps.map((s) => pillLength(s, true)));
  const depth = length + 20;
  const plateW = copy.steps.length * STRIP + (copy.steps.length - 1) * GAP + 24;
  const plate: SlabBox = { x: -12, y: -12, z: 0, w: plateW, d: depth + 44, h: 10 };
  const laneY = depth + 16;
  const laneFrom = -8;
  const laneTo = plateW - 16;

  const strips = copy.steps.map((name, i) => {
    const x = i * (STRIP + GAP);
    const box: SlabBox = { x, y: 0, z: plate.h, w: STRIP, d: depth, h: H };
    const center = x + STRIP / 2;
    const at = T.start + ((center - laneFrom) / (laneTo - laneFrom)) * T.travel;
    const done = clamp01((t - at) / 350) * fade;
    return { name, box, center, done, flash: t < at ? 0 : clamp01(1 - (t - at) / 500) * fade };
  });

  const pulseX = laneFrom + clamp01((t - T.start) / T.travel) * (laneTo - laneFrom);
  const pulse = project({ x: pulseX, y: laneY, z: plate.h }, O);
  const pulseOpacity = clamp01((t - T.start + 200) / 300) * clamp01((T.start + T.travel + 600 - t) / 500) * fade;

  return (
    <VisualPanel size={size} bare={bare} className="p-2 max-md:p-2">
      <div ref={ref} className={cn("w-full", size === "fill" ? "max-w-[460px]" : "max-w-[320px] lg:max-w-none")}>
        <svg viewBox={`0 8 ${SCENE_W} 268`} className="block h-auto w-full" focusable="false">
          <defs>
            <HaloFilter id={haloId} />
          </defs>
          <g className="iso-levitate">
            <Slab look="dark" box={plate} o={O} />

            {strips.map((s) => (
              <g key={s.name}>
                <Slab look="dark" box={s.box} o={O} />
                {s.done > 0 && (
                  <polygon
                    points={pointsAttr(topFace(s.box), O)}
                    style={{
                      fill: "none",
                      stroke: "var(--color-elevate-blue)",
                      strokeWidth: 1.5 + s.flash,
                      strokeLinejoin: "round",
                      opacity: s.done,
                    }}
                  />
                )}
              </g>
            ))}

            {/* The strip nearest the viewer is drawn last, so its pill is never covered. */}
            {strips.map((s, i) => (
              <IsoPill
                key={s.name}
                o={O}
                z={plate.h + H}
                cx={s.center}
                cy={depth / 2}
                name={s.name}
                icon={ICONS[i]}
                index={i}
                length={length}
                check={s.done}
                lit={s.flash}
              />
            ))}

            <IsoPulse x={pulse.x} y={pulse.y} opacity={pulseOpacity} haloId={haloId} />
          </g>
        </svg>
      </div>
    </VisualPanel>
  );
}
