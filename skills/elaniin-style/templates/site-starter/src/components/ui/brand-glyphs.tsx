import { asset } from "../../lib/asset";
import { siClaude, siGooglegemini, siInstagram, siPerplexity } from "simple-icons";

/*
  Single-color brand glyphs (currentColor) for the footer: the social buttons and the AI summary (DESIGN.md components.footer).
  Instagram, Claude, Gemini and Perplexity come from the `simple-icons` dependency (CC0), never drawn by hand. LinkedIn and the ChatGPT mark are NOT in
  simple-icons any more: they are SVG files (public/icons/linkedin.svg; chatgpt.svg is the official OpenAI Blossom supplied by the brand team, with its own
  viewBox cropped to the glyph; masters in skills/elaniin-style/assets/icons/brand/) painted with the text color through a CSS mask.
*/
const fromPackage = { instagram: siInstagram.path, claude: siClaude.path, gemini: siGooglegemini.path, perplexity: siPerplexity.path } as const;
const fromFile = { linkedin: "/icons/linkedin.svg", chatgpt: "/icons/chatgpt.svg", clutch: "/certification/clutch.svg" } as const;
// Clutch has no glyph in the icon set: it is a tile with its own logo file (88x25), drawn as a one-color MASK 16px high so the red dot of the file is not shown.
const wide = { clutch: 88 / 25 } as const;

export type GlyphName = keyof typeof fromPackage | keyof typeof fromFile;

export function Glyph({ name, size = 18 }: { name: GlyphName; size?: number }) {
  if (name in fromFile) {
    const url = `url(${asset(fromFile[name as keyof typeof fromFile])})`;
    return <span aria-hidden="true" className="inline-block bg-current" style={{ width: size * (wide[name as keyof typeof wide] ?? 1), height: size, maskImage: url, WebkitMaskImage: url, maskRepeat: "no-repeat", maskPosition: "center", maskSize: "contain" }} />;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={fromPackage[name as keyof typeof fromPackage]} />
    </svg>
  );
}
