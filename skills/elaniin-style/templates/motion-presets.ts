/*
  Motion presets — mirror DESIGN.md `motion.*` and tokens.css CSS variables.
  Import from "motion" (v14) or "framer-motion" (v11/12): both accept cubic-bezier arrays.
*/

export const ease = {
  standard: [0.4, 0, 0.2, 1] as const,
  emphasized: [0.25, 1, 0.5, 1] as const,
} as const;

export const duration = {
  instant: 0.1,
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  reveal: 0.5,
} as const;

export const revealDistance = 16;
export const revealStagger = 0.06;

/** Standard entrance: 16px up + fade, emphasized ease, 500ms. */
export const reveal = {
  initial: { opacity: 0, y: revealDistance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px -10% 0px" },
  transition: { duration: duration.reveal, ease: ease.emphasized },
} as const;

/** Container that staggers children by 60ms. */
export const revealStaggerParent = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-10% 0px -10% 0px" },
  transition: { staggerChildren: revealStagger },
} as const;

/** Child variant for revealStaggerParent. */
export const revealStaggerChild = {
  initial: { opacity: 0, y: revealDistance },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: duration.reveal, ease: ease.emphasized },
} as const;

/** Route transition (in / out). */
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: duration.slow, ease: ease.standard },
} as const;
