import Image from "next/image";

/* The official logotipo (public/brand/*.svg), never text. Dark on light, white on dark, blue only in isometric resources. */
const files = {
  dark: "/brand/logotipo-elaniin.svg",
  white: "/brand/white-logotipo-elaniin.svg",
  blue: "/brand/logotipo-elaniin-blue.svg",
} as const;

export function Logo({ variant = "dark", className = "h-7 w-auto" }: { variant?: keyof typeof files; className?: string }) {
  return <Image src={files[variant]} alt="Elaniin" width={281} height={76} className={className} priority />;
}
