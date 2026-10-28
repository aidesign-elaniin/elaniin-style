/*
  The travelling light of an isometric scene (DESIGN.md motifs.isometric): a 4-unit Elevate Blue core with a white
  center and a blurred 3-unit halo. Put <HaloFilter /> once in the svg and pass its id.
*/
export function HaloFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation={3} />
    </filter>
  );
}

export function IsoPulse({ x, y, opacity = 1, haloId }: { x: number; y: number; opacity?: number; haloId: string }) {
  return (
    <g style={{ opacity }}>
      <circle cx={x} cy={y} r={11} filter={`url(#${haloId})`} style={{ fill: "var(--color-blue-400)", opacity: 0.5 }} />
      <circle cx={x} cy={y} r={4} style={{ fill: "var(--color-elevate-blue)" }} />
      <circle cx={x} cy={y} r={1.5} style={{ fill: "var(--color-white)" }} />
    </g>
  );
}
