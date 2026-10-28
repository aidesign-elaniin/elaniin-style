import Image from "next/image";

/*
  Filler is ALWAYS visible: a chip "Texto de relleno" next to the title, with the data-placeholder attribute.
  scripts/check.mjs compares these marks with the `content` of the route in site-map.ts.
*/
export function PlaceholderChip({ label = "Texto de relleno" }: { label?: string }) {
  return (
    <span
      data-placeholder
      className="mono-label inline-flex h-6 items-center rounded-tag border border-border-default bg-surface-subtle px-2 text-tag-sm text-text-muted"
    >
      {label}
    </span>
  );
}

/* Local SVG with the final proportion; swap the file for the real image without touching the code. No gradients. */
export function ImagePlaceholder({
  src = "/images/placeholder-16x10.svg",
  alt,
  ratio = "16 / 10",
  className = "",
}: {
  src?: string;
  alt: string;
  ratio?: string;
  className?: string;
}) {
  const [w, h] = ratio.split("/").map((n) => Number(n.trim()));
  return <Image src={src} alt={alt} width={w * 100} height={h * 100} className={`w-full rounded-card border border-border-default ${className}`} />;
}
