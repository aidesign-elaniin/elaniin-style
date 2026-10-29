"use client";

import { Server, Users } from "lucide-react";
import { Floor } from "../floor";
import {
  COS30,
  clamp01,
  easeInOut,
  planeTransform,
  pointAt,
  pointsAttr,
  project,
  type Pt2,
} from "../iso";
import { IsoPill, pillLength } from "../pill";
import { Slab, type SlabBox, topFace } from "../slab";
import { useClock } from "../use-clock";

/*
  Route "Stay available when it matters" (DESIGN.md components.audience-routes.visuals-interim): two twins and a traffic that never
  stops. Pulses travel from a node at the front to the primary block; at FAIL_AT the primary fails (it dims, its check goes, the
  pulses on their way vanish) and the traffic goes on to the backup, faster, which lights up and receives its check. The failure is
  a dimming, never the status colors. The loop resets with a fade, so it has no jump; under prefers-reduced-motion the scene rests
  with the primary dimmed and the backup lit.
*/
const LIFT = 28;
const PLATE_H = 10;
const BLOCK_H = 44;
const BLOCK_W = 64;
const GAP_X = 20; // from the plate edge to the first block
const FAIL_AT = 4800;
const SWITCH_AT = 5200;
const FIRST = 1500; // first pulse
const EVERY_1 = 700; // before the failure
const EVERY_2 = 450; // after it: peak demand
const TRAVEL = 1100;
const T = { reset: 11400, loop: 12000, rest: 8000 };
const LIT_MS = 500;
const lit = (t: number, at: number) =>
  t < at ? 0 : clamp01(1 - (t - at) / LIT_MS);

export function AvailabilityVisual({
  labels,
}: {
  labels: { primary: string; backup: string };
}) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const fade = 1 - clamp01((t - T.reset) / (T.loop - T.reset));
  const rest = t >= T.rest && t < T.reset; // reduced motion rests here

  // The blocks are as deep as the longest pill (the language changes it); the plate follows them.
  const length = Math.max(
    pillLength(labels.primary, true),
    pillLength(labels.backup, true),
  );
  const blockD = length + 12;
  const BLOCK_Y = 12;
  const W = 2 * GAP_X + 2 * BLOCK_W + 24;
  const D = BLOCK_Y + blockD + 46;
  const top = PLATE_H + BLOCK_H;
  const plate: SlabBox = {
    x: -14,
    y: -14,
    z: 0,
    w: W + 28,
    d: D + 28,
    h: PLATE_H,
  };
  const O = {
    x: 200 - ((W - D) / 2) * COS30,
    y: 136 - ((W + D + 28) / 4 - top / 2),
  };

  const primary: SlabBox = {
    x: GAP_X,
    y: BLOCK_Y,
    z: PLATE_H,
    w: BLOCK_W,
    d: blockD,
    h: BLOCK_H,
  };
  const backup: SlabBox = { ...primary, x: W - GAP_X - BLOCK_W };

  // The traffic: from the node at the front, along a routed ground line, to the front face of each block.
  const source = { x: W / 2, y: D - 14 };
  const front = BLOCK_Y + blockD;
  const route = (block: SlabBox): Pt2[] => {
    const cx = block.x + BLOCK_W / 2;
    return [
      source,
      { x: source.x, y: D - 38 },
      { x: cx, y: D - 38 },
      { x: cx, y: front },
    ].map((p) => project({ ...p, z: PLATE_H }, O));
  };
  const routes = [route(primary), route(backup)];
  const pathD = (pts: Pt2[]) =>
    pts
      .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

  // Every pulse is born at a time and goes to the primary before the failure and to the backup after the switch.
  const pulses: { to: 0 | 1; at: number }[] = [];
  for (let at = FIRST; at < T.reset; at += at < FAIL_AT ? EVERY_1 : EVERY_2) {
    if (at < FAIL_AT) pulses.push({ to: 0, at });
    else if (at >= SWITCH_AT) pulses.push({ to: 1, at });
  }

  const failed = rest || t >= FAIL_AT;
  const dim = rest ? 1 : clamp01((t - FAIL_AT) / 300);
  const taken = rest || t >= SWITCH_AT;
  const edge = (box: SlabBox, glow: number) =>
    glow > 0 && (
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
    );

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
            {/* The ground: the lines of the traffic, their source and the pulses, in perspective. */}
            {routes.map((pts, i) => (
              <path
                key={i}
                d={pathD(pts)}
                style={{
                  fill: "none",
                  stroke: "var(--color-excellence-blue)",
                  strokeOpacity:
                    i === 0 ? (failed ? 0.18 : 0.5) : taken ? 0.5 : 0.18,
                  strokeWidth: 1,
                  strokeDasharray: i === 0 && failed ? "3 3" : undefined,
                }}
              />
            ))}
            <g transform={planeTransform(O, PLATE_H)}>
              <circle
                cx={source.x}
                cy={source.y}
                r={15}
                style={{
                  fill: "var(--color-blue-tint-50)",
                  stroke: "var(--color-elevate-blue)",
                  strokeWidth: 2,
                }}
              />
              <Users
                x={source.x - 8}
                y={source.y - 8}
                width={16}
                height={16}
                strokeWidth={1.5}
                style={{ color: "var(--color-elevate-blue)" }}
              />
            </g>
            {!rest &&
              pulses.map(({ to, at }) => {
                const k = clamp01((t - at) / TRAVEL);
                if (k <= 0 || k >= 1) return null;
                if (to === 0 && t >= FAIL_AT) return null; // lost with the failure
                const p = pointAt(routes[to], easeInOut(k));
                return (
                  <g key={at} style={{ opacity: fade }}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={4}
                      style={{ fill: "var(--color-elevate-blue)" }}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={1.5}
                      style={{ fill: "var(--color-white)" }}
                    />
                  </g>
                );
              })}

            {/* The twins. The primary dims when it fails; the backup lights when it takes over. */}
            <g style={{ opacity: 1 - 0.5 * dim }}>
              <Slab look="software" box={primary} o={O} />
              <IsoPill
                o={O}
                z={top}
                cx={primary.x + BLOCK_W / 2}
                cy={BLOCK_Y + blockD / 2}
                name={labels.primary}
                icon={Server}
                index={0}
                length={length}
                check={failed ? 0 : clamp01((t - FIRST) / 250) * fade}
              />
            </g>
            <g>
              <Slab look="software" box={backup} o={O} />
              {edge(backup, rest ? 1 : lit(t, SWITCH_AT) * fade)}
              <IsoPill
                o={O}
                z={top}
                cx={backup.x + BLOCK_W / 2}
                cy={BLOCK_Y + blockD / 2}
                name={labels.backup}
                icon={Server}
                index={1}
                length={length}
                check={
                  taken
                    ? rest
                      ? 1
                      : clamp01((t - SWITCH_AT - 300) / 250) * fade
                    : 0
                }
                lit={rest ? 0 : lit(t, SWITCH_AT + 300) * fade}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
