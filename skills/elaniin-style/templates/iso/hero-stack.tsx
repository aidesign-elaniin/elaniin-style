/*
  Elaniin isometric hero resource, React / Next build. Source: elaniin-2027-website
  (src/components/ui/iso + sections/hero/hero-stack.tsx, DESIGN.md motifs.isometric). Same scene as the vanilla
  build in templates/iso-stack.js. Needs: tokens.css (colors, `rise`, `iso-levitate`, `iso-float`), lucide-react,
  and public/assets/logotipo-elaniin-blue.svg. Usage: <HeroStack labels={{ software: "Software", ai: "AI", cloud: "Cloud" }} />
  Rules and recipe for new resources: references/isometric.md.
*/
"use client";

import { Fragment, useId } from "react";
import { Cloud, Code, Sparkles, type LucideIcon } from "lucide-react";
import { Floor } from "./floor";
import { COS30, clamp01, easeInOut, planeTransform, pointAt, pointsAttr, project } from "./iso";
import { Slab, type SlabBox, type SlabLook, topFace } from "./slab";
import { useClock } from "./use-clock";

/*
  Hero resource (DESIGN.md motifs.isometric, components.hero variant "split"): the three solutions as glass slabs on a
  base plate. Nothing floats: a pulse of light travels a trace on the plate, climbs a riser and at each level splits
  into the arm that feeds one slab. The slab that receives it slides forward and lights its edge while the others
  step back. Elaniin's logotipo lies on the software slab. Decorative: the hero text carries the meaning.
  One clock (12s loop) drives everything; the slabs assemble once with the CSS `rise` entrance. Under
  prefers-reduced-motion the clock rests on the assembled state: nothing slides, no pulse.
*/
const VB = { x: 67, y: 30, w: 640, h: 500 }; // x centers the art: its horizontal extent is about 123 to 651
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const O = { x: 400, y: 246 };
/** The piece levitates this many units above its shadow, a diamond a little smaller than the base plate. */
const LIFT = 36;
const D = 200;

const PLATE: SlabBox = { x: -90, y: -30, z: 0, w: 350, d: 260, h: 12 };
const RISER: SlabBox = { x: -68, y: 192, z: 12, w: 16, d: 16, h: 200 };
const RISER_X = RISER.x + RISER.w; // the face the arms leave from
const RISER_Y = RISER.y + RISER.d / 2; // the arms run along the plane of the slabs' left faces

type Station = { look: Exclude<SlabLook, "plate">; icon: LucideIcon; box: SlabBox; tile: { x: number; y: number } };

/*
  Bottom to top, each slab narrower than the one below so a strip of every top face stays in view (the strip is where
  its label sits). All left faces share one plane, so the arms run along the same line.
*/
const STATIONS: Station[] = [
  { look: "cloud", icon: Cloud, box: { x: 0, y: 0, z: 12, w: 230, d: D, h: 40 }, tile: { x: 195, y: 100 } },
  { look: "software", icon: Code, box: { x: 0, y: 0, z: 72, w: 160, d: D, h: 80 }, tile: { x: 125, y: 100 } },
  { look: "ai", icon: Sparkles, box: { x: 0, y: 0, z: 172, w: 90, d: D, h: 40 }, tile: { x: 45, y: 100 } },
];
const levelOf = (s: Station) => s.box.z + s.box.h / 2;

const T = { trace: 1000, traceDur: 1000, rise: 900, branch: 1000, up: 700, hold: 900, down: 700 };
const SLIDE = 28; // world units along x
const DIM = 0.4; // how much the other slabs step back

/* Per station: R starts the riser climb, B starts the arm, A is the arrival that triggers the slide. */
const TIMES = (() => {
  let r = T.trace + T.traceDur;
  return STATIONS.map(() => {
    const row = { R: r, B: r + T.rise, A: r + T.rise + T.branch };
    r = row.B; // the riser pulse keeps climbing while the arm carries its share
    return row;
  });
})();

/* The trace ends exactly where the riser pulse starts (the foot of the face the arms leave from): no jump between them. */
const TRACE_POINTS = [
  { x: PLATE.x + PLATE.w, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
  { x: RISER_X, y: PLATE.y + PLATE.d - 12, z: PLATE.h },
  { x: RISER_X, y: RISER_Y, z: PLATE.h },
];
const TRACE_SCREEN = TRACE_POINTS.map((p) => project(p, O));

const envelope = (t: number, a: number) => {
  const s = t - a;
  if (s <= 0) return 0;
  if (s < T.up) return easeInOut(s / T.up);
  if (s < T.up + T.hold) return 1;
  if (s < T.up + T.hold + T.down) return 1 - easeInOut((s - T.up - T.hold) / T.down);
  return 0;
};

type Labels = { software: string; ai: string; cloud: string };

export function HeroStack({ labels }: { labels: Labels }) {
  const { ref, t } = useClock(12000);
  const glowId = useId();

  const envs = TIMES.map((row) => envelope(t, row.A));
  const emphasis = Math.max(...envs);

  /*
    Layers, bottom to top: the base svg, then for every slab a frost (CSS backdrop blur clipped to the slab's
    silhouette) and the svg of the slab itself. The frost sits between a slab and everything below it, so whatever is
    seen through the glass (lower slabs, the plate, the arms, the pulses) is blurred, and the slab stays sharp.
  */
  const layer = "absolute inset-0 block h-full w-full";

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full">
      {/* The shadow stays on the ground while the piece above it levitates. */}
      <svg viewBox={VIEWBOX} className="block h-auto w-full" focusable="false">
        <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
          <Floor o={O} x={PLATE.x + 10} y={PLATE.y + 10} w={PLATE.w - 20} d={PLATE.d - 20} z={-LIFT} />
        </g>
      </svg>

      <div className="iso-levitate absolute inset-0">
        <svg viewBox={VIEWBOX} className={layer} focusable="false">
          <defs>
            <filter id={`${glowId}-halo`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={3} />
            </filter>
          </defs>

          <g className="rise" style={{ "--i": 0 } as React.CSSProperties}>
            <Slab look="plate" box={PLATE} o={O} />
            <Slab look="plate" box={RISER} o={O} />
          </g>

          {/* Trace on the plate, arms and pulses: the way the light travels, all attached to the structure. */}
          <g className="rise" style={{ "--i": 2 } as React.CSSProperties}>
            <polyline
              points={TRACE_SCREEN.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
              style={{
                fill: "none",
                stroke: "var(--color-excellence-blue)",
                strokeOpacity: 0.4,
                strokeWidth: 1,
                strokeLinejoin: "round",
              }}
            />
            <Arms t={t} envs={envs} />
            <Pulses t={t} haloId={`${glowId}-halo`} />
          </g>
        </svg>

        {STATIONS.map((station, i) => {
          const env = envs[i];
          const off = SLIDE * env;
          const opacity = 1 - DIM * emphasis * (1 - env);
          return (
            <Fragment key={station.look}>
              <Frost box={station.box} off={off} opacity={opacity} index={i} />
              <svg viewBox={VIEWBOX} className={layer} focusable="false">
                <g className="rise" style={{ "--i": 2 + i * 2 } as React.CSSProperties}>
                  <g transform={`translate(${(off * COS30).toFixed(2)} ${(off * 0.5).toFixed(2)})`} style={{ opacity }}>
                    <Slab look={station.look} box={station.box} o={O} />
                    {station.look === "software" && <Logotipo box={station.box} />}
                    <Tile station={station} index={i} name={labels[station.look]} />
                    {env > 0 && (
                      <polygon
                        points={pointsAttr(topFace(station.box), O)}
                        style={{
                          fill: "none",
                          // Elevate Blue is only 2.4:1 on the AI slab (Excellence Blue), so its lit edge uses the on-dark accent.
                          stroke:
                            station.look === "ai" ? "var(--color-text-on-dark-accent)" : "var(--color-elevate-blue)",
                          strokeWidth: 2,
                          strokeLinejoin: "round",
                          opacity: env,
                        }}
                      />
                    )}
                  </g>
                </g>
              </svg>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* Frosted glass: a 14px backdrop blur (the nav bar uses 8px), clipped to the slab's silhouette. */
const FROST_BLUR = 14; // px
const pct = (p: { x: number; y: number }) =>
  `${(((p.x - VB.x) / VB.w) * 100).toFixed(2)}% ${(((p.y - VB.y) / VB.h) * 100).toFixed(2)}%`;

function Frost({ box, off, opacity, index }: { box: SlabBox; off: number; opacity: number; index: number }) {
  const { x, y, z, w, d, h } = box;
  const silhouette = [
    { x, y, z: z + h },
    { x: x + w, y, z: z + h },
    { x: x + w, y, z },
    { x: x + w, y: y + d, z },
    { x, y: y + d, z },
    { x, y: y + d, z: z + h },
  ].map((p) => pct(project(p, O)));
  const blur = `blur(${FROST_BLUR}px)`;
  return (
    <div className="rise pointer-events-none absolute inset-0" style={{ "--i": 2 + index * 2 } as React.CSSProperties}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(${silhouette.join(", ")})`,
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          transform: `translate(${(((off * COS30) / VB.w) * 100).toFixed(3)}%, ${(((off * 0.5) / VB.h) * 100).toFixed(3)}%)`,
          opacity,
        }}
      />
    </div>
  );
}

/*
  A white pill with the solution icon and name, lying on the top face and reading in the direction of the logotipo
  (rising to the right). It floats 4px and keeps a flat shadow on the glass.
*/
const PILL_H = 38;
const pillLength = (name: string) => 56 + name.length * 9;

function Tile({ station, index, name }: { station: Station; index: number; name: string }) {
  const { box, icon: Icon } = station;
  const length = pillLength(name);
  const plane = `${planeTransform(O, box.z + box.h)} matrix(0 -1 1 0 ${station.tile.x - PILL_H / 2} ${station.tile.y + length / 2})`;
  return (
    <g>
      <g transform={plane} style={{ fill: "var(--color-blue-300)", opacity: 0.35 }}>
        <rect x={0} y={0} width={length} height={PILL_H} rx={8} />
      </g>
      <g className="iso-float" style={{ "--d": index } as React.CSSProperties}>
        <g transform={plane}>
          <rect
            x={0}
            y={0}
            width={length}
            height={PILL_H}
            rx={8}
            style={{
              fill: "var(--color-white)",
              stroke: "var(--color-excellence-blue)",
              strokeWidth: 1,
              strokeOpacity: 0.9,
            }}
          />
          <Icon
            x={12}
            y={(PILL_H - 20) / 2}
            width={20}
            height={20}
            strokeWidth={1.5}
            style={{ color: "var(--color-elevate-blue)" }}
          />
          <text
            x={42}
            y={PILL_H / 2 + 5}
            style={{
              fill: "var(--color-text-primary)",
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            {name}
          </text>
        </g>
      </g>
    </g>
  );
}

/* The logotipo lies on the right face of the software slab: a skew that follows the face plane. */
function Logotipo({ box }: { box: SlabBox }) {
  const { w, d, z, h } = box;
  const width = 88;
  const height = width * (75.91 / 281.45);
  const u = (d - width) / 2;
  const zTop = z + h - (h - height) / 2;
  const e = O.x + (w - d) * COS30;
  const f = O.y + (w + d) / 2 - zTop;
  return (
    <g transform={`matrix(${COS30} -0.5 0 1 ${e} ${f})`}>
      <image href="/assets/logotipo-elaniin-blue.svg" x={u} y={0} width={width} height={height} />
    </g>
  );
}

/* One arm per slab, from the riser to the slab's left corner; it telescopes with the slab as it slides. */
function Arms({ t, envs }: { t: number; envs: number[] }) {
  return (
    <g>
      {STATIONS.map((station, i) => {
        const level = levelOf(station);
        const row = TIMES[i];
        const from = project({ x: RISER_X, y: RISER_Y, z: level }, O);
        const to = project({ x: SLIDE * envs[i], y: RISER_Y, z: level }, O);

        const travelling = t >= row.B && t < row.A;
        const progress = easeInOut(clamp01((t - row.B) / T.branch));
        const head = project({ x: RISER_X + (SLIDE * envs[i] - RISER_X) * progress, y: RISER_Y, z: level }, O);
        const trailOpacity = travelling ? 1 : t >= row.A ? clamp01(1 - (t - row.A) / 700) : 0;

        return (
          <g key={station.look}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              style={{ stroke: "var(--color-excellence-blue)", strokeOpacity: 0.5, strokeWidth: 1 }}
            />
            {trailOpacity > 0 && (
              <line
                x1={from.x}
                y1={from.y}
                x2={travelling ? head.x : to.x}
                y2={travelling ? head.y : to.y}
                style={{
                  stroke: "var(--color-elevate-blue)",
                  strokeWidth: 2,
                  strokeLinecap: "round",
                  opacity: trailOpacity,
                }}
              />
            )}
            <circle
              cx={to.x}
              cy={to.y}
              r={3}
              style={{ fill: "var(--color-white)", stroke: "var(--color-elevate-blue)", strokeWidth: 1.5 }}
            />
          </g>
        );
      })}
    </g>
  );
}

/* The light: along the trace, up the riser, and along each arm. */
function Pulses({ t, haloId }: { t: number; haloId: string }) {
  const pulses: { x: number; y: number; opacity: number; key: string }[] = [];

  const traceEnd = T.trace + T.traceDur;
  if (t >= T.trace && t < traceEnd) {
    const p = pointAt(TRACE_SCREEN, easeInOut((t - T.trace) / T.traceDur));
    pulses.push({ ...p, opacity: clamp01((t - T.trace) / 150), key: "trace" });
  }

  const last = TIMES[TIMES.length - 1];
  if (t >= traceEnd && t < last.B + 200) {
    // The riser pulse climbs from level to level, continuing while each arm carries its share.
    let z = PLATE.h;
    let from = z;
    TIMES.forEach((row, i) => {
      const level = levelOf(STATIONS[i]);
      if (t >= row.R && t < row.B) z = from + (level - from) * easeInOut((t - row.R) / T.rise);
      else if (t >= row.B) z = level;
      from = level;
    });
    const p = project({ x: RISER_X, y: RISER_Y, z }, O);
    pulses.push({ ...p, opacity: t < last.B ? 1 : clamp01(1 - (t - last.B) / 200), key: "riser" });
  }

  TIMES.forEach((row, i) => {
    if (t >= row.B && t < row.A) {
      const level = levelOf(STATIONS[i]);
      const k = easeInOut((t - row.B) / T.branch);
      const p = project({ x: RISER_X + (0 - RISER_X) * k, y: RISER_Y, z: level }, O);
      pulses.push({ ...p, opacity: 1, key: `arm-${i}` });
    }
  });

  return (
    <g>
      {pulses.map((p) => (
        <g key={p.key} style={{ opacity: p.opacity }}>
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
      ))}
    </g>
  );
}
