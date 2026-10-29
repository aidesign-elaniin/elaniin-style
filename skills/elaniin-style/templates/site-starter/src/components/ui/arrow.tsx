import Link from "next/link";
import type { ReactNode } from "react";

const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const ArrowIcon = () => (
  <svg {...common}>
    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
  </svg>
);
export const PlusIcon = () => (
  <svg {...common}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = () => (
  <svg {...common}>
    <path d="M5 12h14" />
  </svg>
);

/* Tertiary link with an arrow that slides 4px on hover. `stretch` covers the whole card (the card is one click target). */
export function ArrowLink({ href, children, dark = false, stretch = false }: { href: string; children: ReactNode; dark?: boolean; stretch?: boolean }) {
  return (
    <Link
      href={href}
      className={`btn-arrow inline-flex items-center gap-2 font-display text-body-sm font-medium focus-ring ${dark ? "text-text-on-dark-accent focus-ring-on-dark" : "text-text-link hover:text-text-link-hover"} ${stretch ? "after:absolute after:inset-0" : ""}`}
    >
      {children}
      <ArrowIcon />
    </Link>
  );
}
