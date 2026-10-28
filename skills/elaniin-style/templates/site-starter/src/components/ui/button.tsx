import Link from "next/link";
import type { ReactNode } from "react";

/* button.primary / secondary / on-dark (DESIGN.md components.button). Heights 40 (md) and 48 (lg). */
const base =
  "btn-arrow inline-flex items-center justify-center gap-2 rounded-button font-display font-medium transition-colors duration-base focus-ring";
const size = { md: "h-10 px-4 text-body-sm", lg: "h-12 px-6 text-body" };
const variant = {
  primary: "bg-elevate-blue text-white hover:bg-blue-600 active:bg-blue-700",
  secondary: "border border-border-strong bg-white text-excellence-blue hover:bg-surface-subtle active:bg-border-default",
} as const;

export function LinkButton({
  href,
  children,
  v = "primary",
  s = "lg",
  arrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  v?: keyof typeof variant;
  s?: keyof typeof size;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${size[s]} ${variant[v]} ${className}`}>
      {children}
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
        </svg>
      )}
    </Link>
  );
}
