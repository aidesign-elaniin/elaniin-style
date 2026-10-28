import type { LucideIcon } from "lucide-react";
import { type Origin, planeTransform } from "./iso";

/*
  A white pill with an icon and a name, lying on a horizontal plane at height z and reading in the direction of the
  logotipo (rising to the right). It floats 4px and keeps a flat shadow on the glass (DESIGN.md motifs.isometric rule 10).
  (cx, cy) is its center on the plane; `check` adds a small success mark at its end.
*/
const PILL_H = 38;
export const pillLength = (name: string, withCheck = false) => 56 + name.length * 9 + (withCheck ? 26 : 0);

export function IsoPill({
  o,
  z,
  cx,
  cy,
  name,
  icon: Icon,
  index = 0,
  check,
  length: fixedLength,
  lit = 0,
}: {
  o: Origin;
  z: number;
  cx: number;
  cy: number;
  name: string;
  icon: LucideIcon;
  index?: number;
  /** 0 to 1: how much of the check mark is shown. Passing it (even 0) reserves room for the mark at the end of the pill. */
  check?: number;
  /** A fixed length, so several pills can share the same width (see `pillLength`). */
  length?: number;
  /** 0 to 1: how much the pill's outline lights in Elevate Blue. */
  lit?: number;
}) {
  const length = fixedLength ?? pillLength(name, check !== undefined);
  const plane = `${planeTransform(o, z)} matrix(0 -1 1 0 ${cx - PILL_H / 2} ${cy + length / 2})`;
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
          {lit > 0 && (
            <rect
              x={0}
              y={0}
              width={length}
              height={PILL_H}
              rx={8}
              style={{ fill: "none", stroke: "var(--color-elevate-blue)", strokeWidth: 2, opacity: lit }}
            />
          )}
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
          {check !== undefined && check > 0 && (
            <g style={{ opacity: check }}>
              <circle cx={length - 16} cy={PILL_H / 2} r={7} style={{ fill: "var(--color-success-dot)" }} />
              <path
                d={`M ${length - 19.5} ${PILL_H / 2} l 2.5 2.5 l 4.5 -5`}
                style={{
                  fill: "none",
                  stroke: "var(--color-white)",
                  strokeWidth: 1.6,
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                }}
              />
            </g>
          )}
        </g>
      </g>
    </g>
  );
}
