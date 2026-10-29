import type { ReactNode } from "react";
import { cn } from "../cn";

/* "card" is the fixed 320px stage in the grid; "fill" stretches to its container (expanded detail). */
export type VisualSize = "card" | "fill";

/* Decorative stage for the animated mocks. Hidden from assistive tech: the card copy carries the meaning. */
export function VisualPanel({
  children,
  className,
  size = "card",
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  size?: VisualSize;
  /** No background, border or radius: the mock rests on the surface of the card (the grid cards of the solutions section). */
  bare?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden p-6 max-md:p-4",
        !bare && "rounded-media border border-border-default bg-surface-subtle",
        size === "card" ? "h-80" : "h-full min-h-80 lg:min-h-[480px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
