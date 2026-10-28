const ids = { dark: "elaniin-logo", white: "elaniin-logo-white", blue: "elaniin-logo-blue" } as const;

/* Dark on light surfaces, white on dark ones; blue only inside isometric resources. */
export function Logo({ variant = "dark", className = "h-7 w-auto" }: { variant?: keyof typeof ids; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 281.45 75.91" role="img" aria-label="Elaniin">
      <use href={`#${ids[variant]}`} />
    </svg>
  );
}
