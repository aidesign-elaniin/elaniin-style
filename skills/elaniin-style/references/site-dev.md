# Site development / Desarrollo del sitio

> Desarrollo del sitio **Elaniin 2027** (Next.js App Router). Fuente de verdad del estilo:
> `DESIGN.md` v1.87.2 en el repo del sitio. Esta skill replica sus tokens y patrones.

## Stack

- **Next.js 16** (App Router, TypeScript) — *esta versión tiene breaking changes; leer
  `node_modules/next/dist/docs/` antes de codificar.*
- **React 19**
- **Tailwind CSS v4** — `@tailwindcss/postcss`, tema en `@theme` dentro de `globals.css`
  (con reset de defaults: `--color-*: initial`, etc.).
- **motion v14** — importar desde `motion/react`. `<MotionConfig reducedMotion="user">`
  en el provider raíz.
- lucide-react (iconos), @number-flow/react (números animados), vitest (tests).

## Estructura

```
src/
├── app/                    # App Router: layout.tsx, page.tsx, globals.css
├── components/
│   ├── ui/                 # button.tsx, reveal.tsx, primitivos
│   └── <feature>/          # bloques por sección
├── lib/
│   ├── motion.ts           # presets ease/duration
│   └── tokens.ts           # tokens para uso en TS (charts, etc.)
└── providers.tsx           # MotionConfig, fuentes, i18n
```

## Convenciones

1. **Tokens, nunca valores cráudos.** `bg-excellence-blue`, no `bg-[#01172E]`.
   Clases default de Tailwind inexistentes no compilan (reset intencional).
2. **Fuentes con next/font:** Instrument Sans (display), DM Sans (text), Geist Mono (mono);
   `font-display: swap`; auto-hosted woff2 (SIL OFL).
3. **Reveal:** componente `Reveal` que usa `whileInView` con `reveal` preset de
   `lib/motion.ts`. No animar en el servidor; hidratar con `"use client"`.
4. **Botones:** matriz de variantes (primary/elevate, dark/excellence, secondary/outline,
   tertiary/link) × tamaños; loading state que preserva ancho; `focus-ring`.
5. **i18n:** contenido EN (primario) y ES (secundario); la UI sigue el locale.
6. **Accesibilidad:** landmarks, un h1, skip-link, foco visible siempre, reduced-motion.

## Motion en el sitio

```tsx
// providers.tsx
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

```ts
// lib/motion.ts
export const ease = {
  standard: [0.4, 0, 0.2, 1] as const,
  emphasized: [0.25, 1, 0.5, 1] as const,
};
export const duration = { instant: 0.1, fast: 0.15, base: 0.2, slow: 0.3, reveal: 0.5 } as const;
```

Ladder: CSS `rise` para entradas simples que deben correr sin hidratación; `motion` para
coreografía (stagger de contenedores, page transitions).

## Instalación de motion (sin preguntar)

`scripts/ensure-motion.sh` detecta package manager e instala `motion` sin preguntar.
Si no hay `package.json`, no hace nada (modo CSS-only). **Nunca** pedir al usuario
que lo instale a mano.

## Deploy

- Producción: Vercel o Node server (`next start`).
- La skill y sus templates son estáticos; el sitio es la app Next.
