import type { Item } from "./types";

// Collection "services": listing at /servicios/, detail at /servicios/<slug>/.
export const services: Item[] = [
  {
    slug: "analisis",
    title: "Análisis de producto",
    summary: "Texto de relleno: resumen del servicio en una o dos frases.",
    body: [
      "Texto de relleno: primer párrafo que explica el servicio, para quién es y qué resuelve.",
      "Texto de relleno: segundo párrafo con el proceso, los entregables y los tiempos habituales.",
    ],
    image: { src: "/images/placeholder-16x10.svg", alt: "Imagen de relleno de análisis de producto" },
    placeholder: true,
  },
  {
    slug: "diseno",
    title: "Diseño de producto",
    summary: "Texto de relleno: resumen del servicio en una o dos frases.",
    body: [
      "Texto de relleno: primer párrafo que explica el servicio, para quién es y qué resuelve.",
      "Texto de relleno: segundo párrafo con el proceso, los entregables y los tiempos habituales.",
    ],
    image: { src: "/images/placeholder-16x10.svg", alt: "Imagen de relleno de diseño de producto" },
    placeholder: true,
  },
  {
    // Example of an item with REAL text (placeholder: false), and no summary because the brief gave none.
    slug: "ingenieria",
    title: "Ingeniería",
    body: ["Construimos y mantenemos el producto con entregas pequeñas, medibles y frecuentes."],
    image: { src: "/images/placeholder-16x10.svg", alt: "Imagen de relleno de ingeniería" },
    placeholder: false,
  },
];
