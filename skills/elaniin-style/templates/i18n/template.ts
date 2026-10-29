/** Fills the {placeholders} of a dictionary sentence. A sentence is one string; it is never built by concatenation. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
