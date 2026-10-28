import type { Item } from "./types";

// Collection "legal". /legal/ has no page of its own: it redirects to the first item (see src/app/legal/page.tsx).
export const legal: Item[] = [
  {
    slug: "privacidad",
    title: "Privacidad",
    body: ["Texto de relleno: política de privacidad. Reemplazar por el texto legal real."],
    image: { src: "/images/placeholder-16x10.svg", alt: "" },
    placeholder: true,
  },
  {
    slug: "terminos",
    title: "Términos",
    body: ["Texto de relleno: términos de uso. Reemplazar por el texto legal real."],
    image: { src: "/images/placeholder-16x10.svg", alt: "" },
    placeholder: true,
  },
];
