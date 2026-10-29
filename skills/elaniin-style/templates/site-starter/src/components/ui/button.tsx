import Link from "next/link";
import type { ReactNode } from "react";

/* button.primary / dark / secondary / tertiary / on-dark / on-dark-secondary (DESIGN.md components.button). Heights 32 (sm), 40 (md), 48 (lg); fit-content. `primary` and `dark` are equal-weight alternatives: never both in the same action group. */
const base =
  "btn-arrow inline-flex items-center justify-center gap-2 rounded-button font-display font-medium transition-colors duration-base focus-ring";
const size = { sm: "h-8 px-3.5 text-button", md: "h-10 px-5 text-button", lg: "h-12 px-6 text-button-lg" };
const variant = {
  primary: "bg-elevate-blue text-white hover:bg-blue-600 active:bg-blue-700",
  dark: "bg-excellence-blue text-white hover:bg-blue-800 active:bg-blue-active-dark",
  secondary: "border border-border-strong bg-white text-excellence-blue hover:bg-surface-subtle active:bg-border-default",
  tertiary: "text-text-link hover:text-text-link-hover hover:underline",
  "on-dark": "bg-white text-excellence-blue hover:bg-inspire-grey focus-ring-on-dark",
  "on-dark-secondary": "border border-border-on-dark-strong bg-transparent text-white hover:bg-white/10 focus-ring-on-dark",
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
