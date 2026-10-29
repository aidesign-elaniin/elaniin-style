"use client";

import { useId } from "react";
import { Database, Gauge, GitPullRequest, Rocket, ShieldCheck, Smartphone, Users, type LucideIcon } from "lucide-react";
import { clamp01, easeInOut, planeTransform, pointAt, project, type Pt2 } from "../iso";
import { HaloFilter } from "../pulse";
import { useClock } from "../use-clock";
import { HeroStack, LIFT, O, PLATE, VB } from "../hero-stack";

/*
  Proposal 1 (DESIGN.md components.hero.visual-proposals): the improved isometric. The three-slab stack of the hero is kept and
  gets the ground it stands on, after the Laravel reference: a fine isometric grid that fades out, routed lines with rounded corners
  that leave the base and carry travelling pulses to nodes, and a row of technology tiles on the floor, each fed by a short line and
  lit in turn when the pulse arrives. Everything lies on the ground plane (under the levitating piece), and one 12s clock
  drives it. Under prefers-reduced-motion the scene rests with every tile and node lit and no pulse.
*/
const GZ = -LIFT; // the ground plane, where the shadow of the piece lies
const PERIOD = 12000;
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;

/* The ground grid: lines every 40 units, fading toward the edges. */
const GRID = (() => {
  const lines: [Pt2, Pt2][] = [];
  for (let x = -280; x <= 440; x += 40)
    lines.push([project({ x, y: -240, z: GZ }, O), project({ x, y: 420, z: GZ }, O)]);
  for (let y = -240; y <= 420; y += 40)
    lines.push([project({ x: -280, y, z: GZ }, O), project({ x: 440, y, z: GZ }, O)]);
  return lines;
})();

/* A polyline with rounded corners: the SVG path and a dense copy of it to place the pulses along. */
function rounded(points: Pt2[], radius: number) {
  const dense: Pt2[] = [points[0]];
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [p0, p1, p2] = [points[i - 1], points[i], points[i + 1]];
    const l1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const l2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const a = { x: p1.x - ((p1.x - p0.x) / l1) * r, y: p1.y - ((p1.y - p0.y) / l1) * r };
    const b = { x: p1.x + ((p2.x - p1.x) / l2) * r, y: p1.y + ((p2.y - p1.y) / l2) * r };
    d += ` L ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    dense.push(a);
    for (let k = 1; k <= 8; k++) {
      const u = k / 8;
      dense.push({
        x: (1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * p1.x + u * u * b.x,
        y: (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * p1.y + u * u * b.y,
      });
    }
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  dense.push(last);
  return { d, dense, end: last };
}

type Route = { icon: LucideIcon; world: { x: number; y: number }[]; start: number; duration: number };
/* Two routes that leave the front face of the base and end at a node: the way the stack reaches the world. */
const ROUTES: Route[] = [
  {
    icon: Smartphone,
    world: [
      { x: 40, y: 230 },
      { x: 40, y: 290 },
      { x: -30, y: 290 },
      { x: -30, y: 345 },
    ],
    start: 5200,
    duration: 2200,
  },
  {
    icon: Gauge,
    world: [
      { x: 150, y: 230 },
      { x: 150, y: 285 },
      { x: 225, y: 285 },
      { x: 225, y: 335 },
    ],
    start: 7600,
    duration: 2200,
  },
].map((r) => r);
const ROUTE_PATHS = ROUTES.map((r) =>
  rounded(
    r.world.map((p) => project({ ...p, z: GZ }, O)),
    16,
  ),
);

/* Technology tiles on the floor beside the base, each fed by a short line from the right face of the plate. */
const TILES: { icon: LucideIcon; y: number }[] = [
  { icon: Users, y: -4 },
  { icon: GitPullRequest, y: 48 },
  { icon: ShieldCheck, y: 100 },
  { icon: Database, y: 152 },
  { icon: Rocket, y: 204 },
];
const TILE = { x: 304, size: 40 };
const STUB_FROM = PLATE.x + PLATE.w;
const FIRST = 1200; // the first tile; the next ones follow every EVERY ms, in the order of the process
const EVERY = 800;
const STUB = 600; // time a pulse takes along the short line of a tile
const FADE_AT = 10800; // everything fades out and the loop restarts

export function HeroStackPlus({ labels }: { labels: { software: string; ai: string; cloud: string } }) {
  const haloId = useId();
  const { ref, t } = useClock(PERIOD, 50, 10000);
  const rest = t >= 10000 && t < FADE_AT; // reduced motion rests here: every tile and node lit, nothing travelling
  const fade = 1 - clamp01((t - FADE_AT) / (PERIOD - FADE_AT));

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full">
      <svg
        viewBox={VIEWBOX}
        className="pointer-events-none absolute inset-0 h-full w-full"
        focusable="false"
        style={{
          maskImage: "radial-gradient(closest-side at 50% 52%, #000 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side at 50% 52%, #000 45%, transparent 100%)",
        }}
      >
        <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
          {GRID.map(([a, b], i) => (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              style={{ stroke: "var(--color-excellence-blue)", strokeOpacity: 0.1, strokeWidth: 1 }}
            />
          ))}
        </g>
      </svg>

      <HeroStack labels={labels} staged />

      <svg
        viewBox={VIEWBOX}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        focusable="false"
      >
        <defs>
          <HaloFilter id={haloId} />
        </defs>

        <g className="rise" style={{ "--i": 3 } as React.CSSProperties}>
          {ROUTES.map((route, i) => {
            const path = ROUTE_PATHS[i];
            const k = clamp01((t - route.start) / route.duration);
            const travelling = !rest && k > 0 && k < 1;
            const p = pointAt(path.dense, easeInOut(k));
            const arrived = rest ? 1 : k >= 1 ? fade : 0;
            const Icon = route.icon;
            const end = route.world[route.world.length - 1];
            return (
              <g key={i}>
                <path
                  d={path.d}
                  style={{ fill: "none", stroke: "var(--color-excellence-blue)", strokeOpacity: 0.5, strokeWidth: 1 }}
                />
                {travelling && (
                  <g>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={11}
                      filter={`url(#${haloId})`}
                      style={{ fill: "var(--color-blue-400)", opacity: 0.5 }}
                    />
                    <circle cx={p.x} cy={p.y} r={4} style={{ fill: "var(--color-elevate-blue)" }} />
                    <circle cx={p.x} cy={p.y} r={1.5} style={{ fill: "var(--color-white)" }} />
                  </g>
                )}
                {/* The node lies on the ground plane, so the disc is an ellipse and the icon follows the plane. */}
                <g transform={planeTransform(O, GZ)}>
                  <circle
                    cx={end.x}
                    cy={end.y}
                    r={17}
                    style={{
                      fill: arrived > 0 ? "var(--color-blue-tint-50)" : "var(--color-white)",
                      stroke: arrived > 0 ? "var(--color-elevate-blue)" : "var(--color-excellence-blue)",
                      strokeOpacity: arrived > 0 ? 1 : 0.5,
                      strokeWidth: arrived > 0 ? 2 : 1,
                    }}
                  />
                  <Icon
                    x={end.x - 9}
                    y={end.y - 9}
                    width={18}
                    height={18}
                    strokeWidth={1.5}
                    style={{ color: "var(--color-elevate-blue)" }}
                  />
                </g>
              </g>
            );
          })}

          {/* The floor tiles, each fed by a short line from the plate; they light in turn. */}
          <g transform={planeTransform(O, GZ)}>
            {TILES.map((tile, i) => {
              const at = FIRST + i * EVERY;
              const travel = clamp01((t - at) / STUB);
              const lit = rest ? 1 : t < at + STUB ? 0 : fade;
              const cy = tile.y + TILE.size / 2;
              const Icon = tile.icon;
              const x1 = STUB_FROM;
              const x2 = TILE.x;
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={cy}
                    x2={x2}
                    y2={cy}
                    style={{ stroke: "var(--color-excellence-blue)", strokeOpacity: 0.5, strokeWidth: 1 }}
                  />
                  {!rest && travel > 0 && travel < 1 && (
                    <circle
                      cx={x1 + (x2 - x1) * easeInOut(travel)}
                      cy={cy}
                      r={3}
                      style={{ fill: "var(--color-elevate-blue)" }}
                    />
                  )}
                  <rect
                    x={TILE.x}
                    y={tile.y}
                    width={TILE.size}
                    height={TILE.size}
                    rx={5}
                    style={{
                      fill: lit > 0 ? "var(--color-blue-tint-50)" : "var(--color-white)",
                      stroke: lit > 0 ? "var(--color-elevate-blue)" : "var(--color-excellence-blue)",
                      strokeOpacity: lit > 0 ? 1 : 0.5,
                      strokeWidth: lit > 0 ? 2 : 1,
                    }}
                  />
                  <Icon
                    x={TILE.x + 10}
                    y={tile.y + 10}
                    width={20}
                    height={20}
                    strokeWidth={1.5}
                    style={{ color: lit > 0 ? "var(--color-elevate-blue)" : "var(--color-text-secondary)" }}
                  />
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
