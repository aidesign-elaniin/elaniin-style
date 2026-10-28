const ids = { dark: "elaniin-logo", white: "elaniin-logo-white" } as const;

/* Dark on light surfaces, white on dark ones; the blue logotipo exists only inside isometric resources (add it there, not here). */
export function Logo({ variant = "dark", className = "h-7 w-auto" }: { variant?: keyof typeof ids; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 281.45 75.91" role="img" aria-label="Elaniin">
      <use href={`#${ids[variant]}`} />
    </svg>
  );
}
