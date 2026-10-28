import { memo } from "react";
import { type Origin, planeTransform, pointsAttr } from "./iso";

/*
  A glass slab (DESIGN.md motifs.isometric): translucent faces in the defined color of its solution, 1px lines, and a
  fine texture on the top face that carries the identity of the nav card: software = module squares, AI = square grid,
  cloud = horizontal layer lines. `plate` is the bare glass of the base: no texture.
*/
export type SlabLook = "software" | "ai" | "cloud" | "brand" | "plate" | "dark";

type Faces = { top: string; left: string; right: string };

/* Software light blue, AI Excellence Blue (its brand color), cloud Inspire Grey, the base white and light blue. */
const FACES: Record<SlabLook, Faces> = {
  software: { top: "var(--color-blue-tint-50)", left: "var(--color-blue-100)", right: "var(--color-blue-200)" },
  ai: { top: "var(--color-blue-800)", left: "var(--color-excellence-blue)", right: "var(--color-blue-active-dark)" },
  cloud: {
    top: "var(--color-surface-subtle)",
    left: "var(--color-border-default)",
    right: "var(--color-border-strong)",
  },
  // Elaniin itself in the route scenes: the blue ramp, never Elevate Blue (a solid fill) and never Excellence Blue (that is AI).
  brand: { top: "var(--color-blue-200)", left: "var(--color-blue-300)", right: "var(--color-blue-400)" },
  plate: { top: "var(--color-white)", left: "var(--color-blue-tint-50)", right: "var(--color-blue-100)" },
  // For dark surfaces (the engagement scenes): clear glass, white at a different strength on each face.
  dark: { top: "var(--color-white)", left: "var(--color-white)", right: "var(--color-white)" },
};
const DARK_OPACITY = { top: 0.12, left: 0.07, right: 0.18 };

const GLASS = { opacity: 0.78, aiOpacity: 0.82, edge: "var(--color-excellence-blue)" };

export type SlabBox = { x: number; y: number; z: number; w: number; d: number; h: number };

/** The corners of the top face, used by the scene to light its edge. */
export const topFace = ({ x, y, z, w, d, h }: SlabBox) => [
  { x, y, z: z + h },
  { x: x + w, y, z: z + h },
  { x: x + w, y: y + d, z: z + h },
  { x, y: y + d, z: z + h },
];

/** Texture on the top face, drawn on the horizontal plane. */
function TopTexture({ look, box, o }: { look: Exclude<SlabLook, "plate" | "dark">; box: SlabBox; o: Origin }) {
  const { x, y, w, d, z, h } = box;
  const items: React.ReactNode[] = [];
  const plane = planeTransform(o, z + h);

  if (look === "software") {
    // The module grid of the system: small squares on a regular pitch.
    for (let i = 12; i <= w - 12; i += 12) {
      for (let j = 12; j <= d - 12; j += 12) {
        items.push(<rect key={`${i}-${j}`} x={x + i - 1.5} y={y + j - 1.5} width={3} height={3} rx={0.5} />);
      }
    }
    return (
      <g transform={plane} style={{ fill: "var(--color-blue-400)", opacity: 0.6 }}>
        {items}
      </g>
    );
  }

  if (look === "brand") {
    // The same module squares as software, in white on the darker blue.
    for (let i = 12; i <= w - 12; i += 12) {
      for (let j = 12; j <= d - 12; j += 12) {
        items.push(<rect key={`${i}-${j}`} x={x + i - 1.5} y={y + j - 1.5} width={3} height={3} rx={0.5} />);
      }
    }
    return (
      <g transform={plane} style={{ fill: "var(--color-white)", opacity: 0.7 }}>
        {items}
      </g>
    );
  }

  if (look === "ai") {
    // A square grid of hairlines, like the AI card.
    for (let i = 12; i < w; i += 12) items.push(<line key={`a${i}`} x1={x + i} y1={y} x2={x + i} y2={y + d} />);
    for (let j = 12; j < d; j += 12) items.push(<line key={`b${j}`} x1={x} y1={y + j} x2={x + w} y2={y + j} />);
    return (
      <g transform={plane} style={{ stroke: "var(--color-white)", strokeWidth: 1, opacity: 0.14 }}>
        {items}
      </g>
    );
  }

  // Cloud: horizontal layer lines.
  for (let j = 10; j < d; j += 10) items.push(<line key={j} x1={x} y1={y + j} x2={x + w} y2={y + j} />);
  return (
    <g transform={plane} style={{ stroke: "var(--color-border-input)", strokeWidth: 1, opacity: 0.5 }}>
      {items}
    </g>
  );
}

function SlabBase({ look, box, o, texture = true }: { look: SlabLook; box: SlabBox; o: Origin; texture?: boolean }) {
  const { x, y, z, w, d, h } = box;
  // AI is Excellence Blue itself, so its lines are the on-dark hairline; every other slab is outlined in Excellence Blue.
  const dark = look === "ai" || look === "dark";
  const edge = {
    stroke: dark ? "var(--color-border-on-dark-strong)" : GLASS.edge,
    strokeWidth: 1,
    strokeLinejoin: "round" as const,
    strokeOpacity: dark ? 1 : 0.9,
  };
  const faces = FACES[look];
  const opacity = (name: keyof typeof DARK_OPACITY) =>
    look === "dark" ? DARK_OPACITY[name] : dark ? GLASS.aiOpacity : GLASS.opacity;
  const face = (fill: string, name: keyof typeof DARK_OPACITY) => ({ fill, fillOpacity: opacity(name), ...edge });

  const left = [
    { x, y: y + d, z },
    { x: x + w, y: y + d, z },
    { x: x + w, y: y + d, z: z + h },
    { x, y: y + d, z: z + h },
  ];
  const right = [
    { x: x + w, y, z },
    { x: x + w, y: y + d, z },
    { x: x + w, y: y + d, z: z + h },
    { x: x + w, y, z: z + h },
  ];

  return (
    <g>
      <polygon points={pointsAttr(left, o)} style={face(faces.left, "left")} />
      <polygon points={pointsAttr(right, o)} style={face(faces.right, "right")} />
      <polygon points={pointsAttr(topFace(box), o)} style={face(faces.top, "top")} />
      {texture && look !== "plate" && look !== "dark" && <TopTexture look={look} box={box} o={o} />}
    </g>
  );
}

export const Slab = memo(SlabBase);
