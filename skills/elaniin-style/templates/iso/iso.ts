/*
  Isometric kit (DESIGN.md motifs.isometric). One projection for the whole site: true isometric, axes at 30deg.
  World axes: x runs right and down, y runs left and down, z runs up. All numbers are SVG user units.
*/
/** Width of the viewBox of the scenes of one family: same scale on every card, so pills and text match. */
export const SCENE_W = 418;

export const COS30 = Math.cos(Math.PI / 6);

export type Pt3 = { x: number; y: number; z: number };
export type Pt2 = { x: number; y: number };

/** Screen position of the world origin of a scene. */
export type Origin = Pt2;

export function project(p: Pt3, o: Origin): Pt2 {
  return { x: o.x + (p.x - p.y) * COS30, y: o.y + (p.x + p.y) / 2 - p.z };
}

/** `points` attribute of a polygon or polyline from world points. */
export function pointsAttr(list: Pt3[], o: Origin): string {
  return list
    .map((p) => {
      const q = project(p, o);
      return `${q.x.toFixed(1)},${q.y.toFixed(1)}`;
    })
    .join(" ");
}

/** Transform that maps a drawing made in (x, y) world units onto a horizontal plane at height z. */
export function planeTransform(o: Origin, z: number): string {
  return `translate(0 ${-z}) matrix(${COS30} 0.5 ${-COS30} 0.5 ${o.x} ${o.y})`;
}

/** Position along a polyline (screen points) at progress 0..1 of its total length. */
export function pointAt(line: Pt2[], progress: number): Pt2 {
  const lengths = line.slice(1).map((p, i) => Math.hypot(p.x - line[i].x, p.y - line[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);
  let left = Math.min(1, Math.max(0, progress)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const k = lengths[i] === 0 ? 0 : left / lengths[i];
      return {
        x: line[i].x + (line[i + 1].x - line[i].x) * k,
        y: line[i].y + (line[i + 1].y - line[i].y) * k,
      };
    }
    left -= lengths[i];
  }
  return line[0];
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeInOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
