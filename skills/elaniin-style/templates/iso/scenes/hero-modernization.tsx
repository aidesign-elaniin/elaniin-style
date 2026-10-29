"use client";

import { useId } from "react";
import { Cloud, Database, Gauge, Layers, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import { Floor } from "../floor";
import { clamp01, easeInOut, planeTransform, pointAt, pointsAttr, project, type Pt2 } from "../iso";
import { IsoPill } from "../pill";
import { HaloFilter, IsoPulse } from "../pulse";
import { Slab, type SlabBox, topFace } from "../slab";
import type { AudienceVisualsCopy } from "./types";
import { useClock } from "../use-clock";

/*
  Hero proposal 2 (DESIGN.md components.hero.visual-proposals): the modernization resource of the audience routes at hero scale.
  A grey legacy slab and a light-blue modern slab on one glass base. Six cubes migrate one by one over three lanes while pulses
  keep crossing, so the operation never stops: each cube turns blue as it lands, the modern slab grows with every one, and the
  legacy slab steps back. When the last one lands the modern system feeds four outputs through a routed trunk with rounded corners
  and each tile on the base lights as the light reaches it. The base sits on a ground grid that fades out, as in the Laravel
  reference. Everything is attached to the structure; nothing floats. One clock (14s loop); the pieces enter with the CSS `rise`.
  Under prefers-reduced-motion the clock rests on the finished state. The only text is the two labels of the slabs.
*/
const VB = { x: 67, y: 30, w: 640, h: 500 };
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const O = { x: 300, y: 174 };
const LIFT = 36;

const PLATE: SlabBox = { x: -14, y: -20, z: 0, w: 420, d: 230, h: 30 };
// The plinth: a wider, lower step under the plate, so the base has height of its own.
const STEP: SlabBox = { x: PLATE.x - 16, y: PLATE.y - 16, z: -14, w: PLATE.w + 32, d: PLATE.d + 32, h: 14 };
const Z0 = PLATE.h;
const LEGACY: SlabBox = { x: 0, y: 0, z: Z0, w: 112, d: 190, h: 112 };
const LEGACY_MIN = 40; // the legacy slab goes down to this height as the cubes leave
const MODERN_X = 196;
const MODERN_H = { from: 56, to: 140 }; // 2 floors to 5 floors of BAND, so the last floor is as high as the others // the modern slab grows into a tower with every cube that lands

const BAND = 28; // spacing of the floor bands on the modern tower
// The notification waves: three rings that leave the top face of the tower once it is complete.
const WAVES = { at: 9100, gap: 280, dur: 1700, from: 18, to: 150, count: 3 };

const CUBE = 22;
const CUBE_H = 16;
// Where the six cubes sit on a slab, relative to its corner: two flanking columns on three rows, clear of the pill in the middle.
const COLS = [94, 18];
const ROWS = [22, 95, 168];
const SLOTS = [0, 1, 2].flatMap((r) => COLS.map((x) => ({ x, y: ROWS[r], row: r })));

// The four outputs: tiles on the base, fed by a trunk that leaves the right face of the modern slab.
const TILE = 38;
const TILE_X = 347;
const TILE_Y = [25, 75, 125, 175];
const TILE_ICONS: LucideIcon[] = [Cloud, Database, ShieldCheck, Gauge];
const TRUNK_X = 330;
const MODERN_FACE = MODERN_X + LEGACY.w;

const T = {
  first: 1700,
  gap: 1100,
  flight: 1300,
  lanes: [900, 2300, 3700, 5100, 6500, 7900],
  laneDur: 800,
  out: 8800,
  outDur: 1100,
  outGap: 180,
  retire: 8800,
  reset: 12600,
  loop: 14000,
  rest: 11200,
};
const LANE_FROM = LEGACY.x + LEGACY.w;

const proj = (x: number, y: number, z: number) => project({ x, y, z }, O);

/** Polyline through the points with rounded corners (screen space), dense enough to follow it with a pulse. */
function rounded(points: Pt2[], radius: number, steps = 8): Pt2[] {
  const out: Pt2[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1];
    const b = points[i];
    const c = points[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y);
    const l2 = Math.hypot(c.x - b.x, c.y - b.y);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const p1 = { x: b.x + ((a.x - b.x) / l1) * r, y: b.y + ((a.y - b.y) / l1) * r };
    const p2 = { x: b.x + ((c.x - b.x) / l2) * r, y: b.y + ((c.y - b.y) / l2) * r };
    for (let s = 0; s <= steps; s++) {
      const k = s / steps;
      const q = 1 - k;
      out.push({ x: q * q * p1.x + 2 * q * k * b.x + k * k * p2.x, y: q * q * p1.y + 2 * q * k * b.y + k * k * p2.y });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}
const pts = (list: Pt2[]) => list.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/** The three lanes between the slabs and the four branches of the trunk, in screen space. */
const LANES = ROWS.map((y) => [proj(LANE_FROM, y, Z0), proj(MODERN_X, y, Z0)]);
const BRANCHES = TILE_Y.map((y) =>
  rounded([proj(MODERN_FACE, 95, Z0), proj(TRUNK_X, 95, Z0), proj(TRUNK_X, y, Z0), proj(TILE_X, y, Z0)], 9),
);

/* The ground grid: short segments whose strength falls with the distance to the base, so it fades out without a gradient. */
const GRID = (() => {
  const step = 40;
  const centre = { x: 196, y: 95 };
  const reach = 330;
  const segments: { a: Pt2; b: Pt2; opacity: number }[] = [];
  const add = (x1: number, y1: number, x2: number, y2: number) => {
    const d = Math.hypot((x1 + x2) / 2 - centre.x, (y1 + y2) / 2 - centre.y);
    const opacity = 0.7 * (1 - d / reach);
    if (opacity < 0.06) return;
    segments.push({ a: proj(x1, y1, -LIFT), b: proj(x2, y2, -LIFT), opacity });
  };
  for (let x = -100; x <= 420; x += step) {
    for (let y = -80; y <= 270; y += step) {
      if (x + step <= 420) add(x, y, x + step, y);
      if (y + step <= 270) add(x, y, x, y + step);
    }
  }
  return segments;
})();

const cube = (slab: { x: number; z: number }, slot: { x: number; y: number }): SlabBox => ({
  x: slab.x + slot.x - CUBE / 2,
  y: slot.y - CUBE / 2,
  z: slab.z,
  w: CUBE,
  d: CUBE,
  h: CUBE_H,
});

const edge = (box: SlabBox, amount: number, key?: string) =>
  amount > 0 && (
    <polygon
      key={key}
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

const node = (p: Pt2, key: string) => (
  <circle
    key={key}
    cx={p.x}
    cy={p.y}
    r={3}
    style={{ fill: "var(--color-white)", stroke: "var(--color-elevate-blue)", strokeWidth: 1.5 }}
  />
);

export function HeroModernization({ labels }: { labels: AudienceVisualsCopy["modernization"] }) {
  const { ref, t } = useClock(T.loop, 50, T.rest);
  const haloId = useId();

  const resetP = clamp01((t - T.reset) / (T.loop - T.reset)); // 0 to 1 while the loop resets
  const retired = easeInOut(clamp01((t - T.retire) / 900)) * (1 - resetP);
  const legacyOpacity = 1 - 0.5 * retired;
  const stepBack = -16 * retired; // world units along x; the slab steps away from the modern one

  // Per cube: the take-off and landing times, and how far along its flight it is.
  const cubes = SLOTS.map((slot, k) => {
    const start = T.first + k * T.gap;
    const land = start + T.flight;
    const p = clamp01((t - start) / T.flight);
    return { slot, start, land, p, e: easeInOut(p), flying: t >= start && p < 1, landed: p >= 1 };
  });
  const grown = cubes.reduce((n, c) => n + clamp01((t - c.land) / 450), 0) / cubes.length;
  const modernH = MODERN_H.from + (MODERN_H.to - MODERN_H.from) * easeInOut(grown) * (1 - resetP);
  // The legacy slab goes down as each cube takes off (the mirror of the modern tower), and grows back while the loop resets.
  const shrunk = cubes.reduce((n, c) => n + easeInOut(clamp01((t - c.start) / 700)), 0) / cubes.length;
  const legacyH = LEGACY.h - (LEGACY.h - LEGACY_MIN) * shrunk * (1 - resetP);
  const legacyNow: SlabBox = { ...LEGACY, h: legacyH };
  const MODERN: SlabBox = { x: MODERN_X, y: 0, z: Z0, w: LEGACY.w, d: LEGACY.d, h: modernH };

  const bands = Array.from({ length: Math.max(0, Math.floor((modernH - 1) / BAND)) }, (_, k) => {
    const z = Z0 + (k + 1) * BAND;
    return {
      z,
      top: false,
      left: [proj(MODERN_X, LEGACY.d, z), proj(MODERN_X + LEGACY.w, LEGACY.d, z)],
      right: [proj(MODERN_X + LEGACY.w, 0, z), proj(MODERN_X + LEGACY.w, LEGACY.d, z)],
    };
  }).map((b, k, all) => ({ ...b, top: k === all.length - 1 }));
  const waves = Array.from({ length: WAVES.count }, (_, i) => {
    const k = clamp01((t - WAVES.at - i * WAVES.gap) / WAVES.dur);
    return {
      i,
      k,
      r: WAVES.from + (WAVES.to - WAVES.from) * easeInOut(k),
      opacity: k > 0 && k < 1 ? 0.8 * (1 - k) : 0,
    };
  }).filter((w) => w.opacity > 0);

  // Lit edges: the legacy slab flashes as a cube leaves, the modern one as it lands and stays lit once it feeds the outputs.
  const flash = (times: number[]) =>
    times.reduce((v, at) => (t >= at ? Math.max(v, clamp01(1 - (t - at) / 500)) : v), 0);
  const legacyLit = flash(cubes.map((c) => c.start)) * (1 - retired);
  const modernLit = Math.max(flash(cubes.map((c) => c.land)), clamp01((t - T.out) / 600) * 0.9) * (1 - resetP);

  // Pulses crossing the lanes, one at a time, linear.
  const crossing = T.lanes.map((start, j) => {
    const p = (t - start) / T.laneDur;
    return p >= 0 && p < 1 ? { j, p } : null;
  });

  const legacyCubes = cubes
    .filter((c) => t < c.start || resetP > 0)
    .map((c) => ({ c, box: cube(LEGACY, c.slot), opacity: t < c.start ? 1 : resetP }))
    .sort((a, b) => a.box.x + a.box.y - (b.box.x + b.box.y));
  const modernCubes = cubes
    .filter((c) => c.landed)
    .map((c) => ({ c, box: cube({ x: MODERN_X, z: Z0 + modernH }, c.slot) }))
    .sort((a, b) => a.box.x + a.box.y - (b.box.x + b.box.y));

  // The output pulses: one per branch, starting together at the modern slab and reaching their tile at staggered times.
  const outputs = BRANCHES.map((path, i) => {
    const start = T.out + i * T.outGap;
    const p = (t - start) / T.outDur;
    const arrived = clamp01((t - start - T.outDur) / 300) * (1 - resetP);
    return { path, p, arrived, active: p >= 0 && p < 1 };
  });

  return (
    <div ref={ref} aria-hidden="true" className="h-full w-full">
      <svg viewBox={VIEWBOX} className="block h-full w-full overflow-visible" focusable="false">
        <defs>
          <HaloFilter id={haloId} />
        </defs>

        {/* Ground: the fading grid and the shadow, which stays down while the piece above it levitates. */}
        <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
          <g style={{ stroke: "var(--color-border-strong)", strokeWidth: 1 }}>
            {GRID.map((s, i) => (
              <line key={i} x1={s.a.x} y1={s.a.y} x2={s.b.x} y2={s.b.y} style={{ strokeOpacity: s.opacity }} />
            ))}
          </g>
          <Floor o={O} x={STEP.x + 10} y={STEP.y + 10} w={STEP.w - 20} d={STEP.d - 20} z={-LIFT} />
        </g>

        <g className="iso-levitate">
          <g className="rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Slab look="plate" box={STEP} o={O} />
            <Slab look="plate" box={PLATE} o={O} />

            {/* Lanes between the slabs, and the trunk with its branches to the outputs. */}
            <g style={{ fill: "none", stroke: "var(--color-excellence-blue)", strokeOpacity: 0.4, strokeWidth: 1 }}>
              {LANES.map((lane, i) => (
                <polyline key={i} points={pts(lane)} strokeLinecap="round" />
              ))}
              {BRANCHES.map((path, i) => (
                <polyline key={i} points={pts(path)} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </g>
            {LANES.flatMap((lane, i) => [node(lane[0], `a${i}`), node(lane[1], `b${i}`)])}
            {BRANCHES.map((path, i) => node(path[path.length - 1], `t${i}`))}
          </g>

          {/* Legacy: grey, with its cubes until each one leaves; it steps back once the move is done. */}
          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            <g
              transform={`translate(${(stepBack * 0.866).toFixed(2)} ${(stepBack * 0.5).toFixed(2)})`}
              style={{ opacity: legacyOpacity }}
            >
              <Slab look="cloud" box={legacyNow} o={O} />
              <IsoPill
                o={O}
                z={legacyNow.z + legacyNow.h}
                cx={LEGACY.x + LEGACY.w / 2}
                cy={LEGACY.d / 2}
                name={labels.legacy}
                icon={Server}
                index={0}
              />
              {edge(legacyNow, legacyLit)}
              {legacyCubes.map(({ c, box, opacity }) => (
                <g key={c.start} style={{ opacity }}>
                  <Slab look="cloud" box={{ ...box, z: legacyNow.z + legacyNow.h }} o={O} texture={false} />
                </g>
              ))}
            </g>
          </g>

          {/* Modern: light blue, growing as it receives the cubes, with the logotipo of Elaniin on its face. */}
          <g className="rise" style={{ "--i": 3 } as React.CSSProperties}>
            <Slab look="software" box={MODERN} o={O} />
            {/* Floor bands on the two faces: the tower is being built, the highest band is the one that is lit. */}
            {bands.map((b) => (
              <g
                key={b.z}
                style={{
                  stroke: b.top ? "var(--color-elevate-blue)" : "var(--color-excellence-blue)",
                  strokeOpacity: b.top ? 0.9 : 0.35,
                  strokeWidth: b.top ? 1.5 : 1,
                }}
              >
                <line x1={b.left[0].x} y1={b.left[0].y} x2={b.left[1].x} y2={b.left[1].y} />
                <line x1={b.right[0].x} y1={b.right[0].y} x2={b.right[1].x} y2={b.right[1].y} />
              </g>
            ))}
            {/* The notification waves: rings on the plane of the top face, expanding and fading (perspective ellipses). */}
            <g transform={planeTransform(O, MODERN.z + MODERN.h)}>
              {waves.map((w) => (
                <circle
                  key={w.i}
                  cx={MODERN.x + MODERN.w / 2}
                  cy={MODERN.d / 2}
                  r={w.r}
                  style={{
                    fill: "none",
                    stroke: "var(--color-elevate-blue)",
                    strokeWidth: 2 - w.k,
                    opacity: w.opacity,
                  }}
                />
              ))}
            </g>
            <IsoPill
              o={O}
              z={MODERN.z + MODERN.h}
              cx={MODERN.x + MODERN.w / 2}
              cy={MODERN.d / 2}
              name={labels.modern}
              icon={Layers}
              index={1}
            />
            {edge(MODERN, modernLit)}
            {modernCubes.map(({ c, box }) => (
              <g key={c.start} style={{ opacity: 1 - resetP }}>
                <Slab look="brand" box={box} o={O} texture={false} />
              </g>
            ))}
          </g>

          {/* The outputs: four tiles on the base that light as the light reaches them. */}
          <g className="rise" style={{ "--i": 4 } as React.CSSProperties}>
            {TILE_Y.map((y, i) => {
              const box: SlabBox = { x: TILE_X, y: y - TILE / 2, z: Z0, w: TILE, d: TILE, h: 6 };
              const Icon = TILE_ICONS[i];
              const lit = outputs[i].arrived;
              const plane = `${planeTransform(O, Z0 + box.h)} translate(${TILE_X + TILE / 2} ${y}) matrix(0 -1 1 0 0 0)`;
              return (
                <g key={y}>
                  <Slab look="plate" box={box} o={O} />
                  {edge(box, lit, `e${i}`)}
                  <g transform={plane}>
                    <Icon
                      x={-10}
                      y={-10}
                      width={20}
                      height={20}
                      strokeWidth={1.5}
                      style={{ color: lit > 0.5 ? "var(--color-elevate-blue)" : "var(--color-text-muted)" }}
                    />
                  </g>
                </g>
              );
            })}
          </g>

          {/* In flight: the cube rises over its lane and turns from grey to blue as it crosses. */}
          {cubes.map((c) => {
            if (!c.flying) return null;
            const a = cube(LEGACY, c.slot);
            const b = cube({ x: MODERN_X, z: Z0 + modernH }, c.slot);
            const box: SlabBox = {
              ...a,
              x: a.x + (b.x - a.x) * c.e,
              z: legacyNow.z + legacyNow.h + (b.z - legacyNow.z - legacyNow.h) * c.e + 44 * Math.sin(Math.PI * c.e),
            };
            const blue = clamp01((c.e - 0.4) / 0.4);
            return (
              <g key={c.start}>
                <g style={{ opacity: 1 - blue }}>
                  <Slab look="cloud" box={box} o={O} texture={false} />
                </g>
                <g style={{ opacity: blue }}>
                  <Slab look="brand" box={box} o={O} texture={false} />
                </g>
              </g>
            );
          })}

          {/* The light: across the lanes while the cubes move, then along the trunk to the outputs. */}
          {crossing.map((c) => {
            if (!c) return null;
            const p = pointAt(LANES[c.j % LANES.length], c.p);
            const fade = clamp01(c.p / 0.15) * clamp01((1 - c.p) / 0.15);
            return <IsoPulse key={`l${c.j}`} x={p.x} y={p.y} opacity={fade} haloId={haloId} />;
          })}
          {outputs.map((o, i) => {
            if (!o.active) return null;
            const p = pointAt(o.path, easeInOut(o.p));
            return <IsoPulse key={`o${i}`} x={p.x} y={p.y} opacity={clamp01(o.p / 0.1)} haloId={haloId} />;
          })}
        </g>
      </svg>
    </div>
  );
}
