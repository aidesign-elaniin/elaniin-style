/* Labels of the isometric scenes. They come from YOUR dictionary (no visible string lives in a component); brand names are not translated. */
export type DeliveryVisualCopy = { steps: [string, string, string, string] }; // AI delivery: tests, review, staging, production
export type ProductVisualCopy = { platform: string; web: string; mobile: string }; // software: widest tier (bottom) to the top one
export type CloudVisualCopy = { availability: string }; // cloud: the pill
export type AudienceVisualsCopy = {
  staff: { team: string };
  modernization: { legacy: string; modern: string };
  public: { documented: string; secure: string; traceable: string };
  software: { product: string };
  critical: { label: string };
  impact: { label: string };
  availability: { primary: string; backup: string };
};
