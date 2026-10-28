import { COS30, type Origin, planeTransform } from "./iso";
import type { SlabBox } from "./slab";

/*
  The Elaniin logotipo lying on the right face of a slab, centered, in Elevate Blue (public/assets/logotipo-elaniin-blue.svg,
  approved only for the isometric resources, DESIGN.md components.logo / motifs.isometric rule 6). A skew follows the face plane.
*/
const SRC = { blue: "/assets/logotipo-elaniin-blue.svg", black: "/assets/logotipo-elaniin.svg" };

/** `tone` "blue" on the light software face (3.96:1), "black" on a mid-blue face (about 6.4:1 on blue-400). */
export function IsoLogotipo({
  o,
  box,
  width = 88,
  tone = "blue",
  face = "right",
}: {
  o: Origin;
  box: SlabBox;
  width?: number;
  tone?: "blue" | "black";
  /** "right" lies on the right face (the hero); "top" lies on the top face, reading in the direction of the pills, for slabs whose right face is hidden by a neighbor. */
  face?: "right" | "top";
}) {
  const { x, y, w, d, z, h } = box;
  const height = width * (75.91 / 281.45);
  if (face === "top") {
    const plane = `${planeTransform(o, z + h)} matrix(0 -1 1 0 ${x + (w - height) / 2} ${y + (d + width) / 2})`;
    return (
      <g transform={plane}>
        <image href={SRC[tone]} x={0} y={0} width={width} height={height} />
      </g>
    );
  }
  const u = (d - width) / 2;
  const zTop = z + h - (h - height) / 2;
  const xf = x + w; // the plane of the right face
  const e = o.x + (xf - y - d) * COS30;
  const f = o.y + (xf + y + d) / 2 - zTop;
  return (
    <g transform={`matrix(${COS30} -0.5 0 1 ${e} ${f})`}>
      <image href={SRC[tone]} x={u} y={0} width={width} height={height} />
    </g>
  );
}
