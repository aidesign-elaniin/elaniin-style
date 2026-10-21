import { memo } from "react";
import { type Origin, pointsAttr } from "./iso";

/*
  Shadow of an isometric piece (DESIGN.md motifs.isometric): a flat grey diamond with the footprint of the piece, drawn
  at depth `z` (negative = below the piece, so the piece levitates over it). No grid lines, no blur.
*/
type FloorProps = { o: Origin; x: number; y: number; w: number; d: number; z: number };

function FloorBase({ o, x, y, w, d, z }: FloorProps) {
  const diamond = pointsAttr(
    [
      { x, y, z },
      { x: x + w, y, z },
      { x: x + w, y: y + d, z },
      { x, y: y + d, z },
    ],
    o,
  );

  return <polygon points={diamond} style={{ fill: "var(--color-surface-subtle)" }} />;
}

export const Floor = memo(FloorBase);
