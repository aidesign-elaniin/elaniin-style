"use client";

import { Globe, Server, Smartphone } from "lucide-react";
import { Floor } from "../floor";
import { clamp01, easeOutCubic, pointsAttr, SCENE_W } from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import type { ProductVisualCopy } from "./types";
import { cn } from "../cn";
import { useClock } from "../use-clock";
import { VisualPanel, type VisualSize } from "./visual-panel";

/*
  Software card (DESIGN.md components.solutions-grid, mocks): a product built tier by tier. The widest tier (the platform)
  rises first, then the web app and the mobile app drop onto it from above and dock, each lighting the exposed strip of its
  top and showing its pill. The three hold and the loop fades out. Under prefers-reduced-motion the scene rests on the built
  product.
*/
const ICONS = [Server, Globe, Smartphone];
const STRIP = 50;
const TIER_H = 14;
const LIFT = 28;
const O = { x: 206, y: 66 };
const T = { drops: [800, 2700, 4600], dropDur: 1100, reset: 8300, loop: 9100, rest: 7000 };

export function ProductVisual({
  copy,
  size = "card",
  bare = false,
}: {
  copy: ProductVisualCopy;
  size?: VisualSize;
  bare?: boolean;
}) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));

  const names = [copy.platform, copy.web, copy.mobile];
  const length = Math.max(...names.map((n) => pillLength(n)));
  const depth = length + 20;
  const plate: SlabBox = { x: -12, y: -12, z: 0, w: 3 * STRIP + 24, d: depth + 24, h: 10 };

  // Tier k is (3 - k) strips wide and sits on the one below; its exposed strip is the one nearest the viewer.
  const tiers = names.map((name, k) => {
    const box: SlabBox = { x: 0, y: 0, z: plate.h + k * TIER_H, w: (3 - k) * STRIP, d: depth, h: TIER_H };
    const strip: SlabBox = { ...box, x: box.w - STRIP, w: STRIP };
    const start = T.drops[k];
    const p = easeOutCubic((t - start) / T.dropDur);
    return {
      name,
      box,
      strip,
      dz: k === 0 ? 0 : 70 * (1 - p),
      rise: k === 0 ? 14 * (1 - p) : 0,
      present: clamp01((t - start) / 450) * fade,
      lit: t < start + T.dropDur ? 0 : clamp01(1 - (t - start - T.dropDur) / 500) * fade,
      edge: clamp01((t - start - T.dropDur + 200) / 300) * fade,
    };
  });

  return (
    <VisualPanel size={size} bare={bare} className="p-2 max-md:p-2">
      <div ref={ref} className={cn("w-full", size === "fill" ? "max-w-[460px]" : "max-w-[320px] lg:max-w-none")}>
        <svg viewBox={`-3 4 ${SCENE_W} 232`} className="block h-auto w-full overflow-visible" focusable="false">
          <Floor o={O} x={plate.x + 8} y={plate.y + 8} w={plate.w - 16} d={plate.d - 16} z={-LIFT} />
          <g className="iso-levitate">
            <Slab look="plate" box={plate} o={O} />

            {tiers.map((tier) => (
              <g
                key={tier.name}
                transform={`translate(0 ${(-tier.dz + tier.rise).toFixed(2)})`}
                style={{ opacity: tier.present }}
              >
                <Slab look="software" box={tier.box} o={O} />
                {tier.edge > 0 && (
                  <polygon
                    points={pointsAttr(topFace(tier.strip), O)}
                    style={{
                      fill: "none",
                      stroke: "var(--color-elevate-blue)",
                      strokeWidth: 1.5 + tier.lit,
                      strokeLinejoin: "round",
                      opacity: tier.edge,
                    }}
                  />
                )}
              </g>
            ))}

            {/* The tier nearest the viewer holds the last pill drawn, so a pill is never covered by the tier behind it. */}
            {[...tiers].reverse().map((tier) => {
              const k = tiers.indexOf(tier);
              return (
                <g
                  key={tier.name}
                  transform={`translate(0 ${(-tier.dz + tier.rise).toFixed(2)})`}
                  style={{ opacity: tier.present }}
                >
                  <IsoPill
                    o={O}
                    z={tier.box.z + TIER_H}
                    cx={tier.strip.x + STRIP / 2}
                    cy={depth / 2}
                    name={tier.name}
                    icon={ICONS[k]}
                    index={k}
                    length={length}
                    lit={tier.lit}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </VisualPanel>
  );
}
