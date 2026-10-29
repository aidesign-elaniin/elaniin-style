/* Section ids. English in both languages: they are technical, not content (DESIGN.md section 13.1). */
export const anchors = {
  home: "home",
  routes: "routes",
  solutions: "solutions",
  engagement: "engagement",
  method: "method",
  cases: "cases",
  research: "research",
  contact: "contact",
} as const;

export type AnchorKey = keyof typeof anchors;
