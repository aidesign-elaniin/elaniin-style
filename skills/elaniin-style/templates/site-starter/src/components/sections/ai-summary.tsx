import { Glyph } from "../ui/brand-glyphs";

/*
  AI summary (DESIGN.md components.footer.ai-summary), end of the footer legal row: "Get an AI summary of <brand>:" + assistant icons.
  Claude, ChatGPT, Gemini and Perplexity, in that order, as 32px icon buttons (radius button, no border) with an 18px single-color glyph in text-on-dark-secondary;
  hover: white 8% background and text-on-dark; focus-ring-on-dark. Each opens the assistant in a new tab (rel noopener noreferrer) with a prefilled prompt that asks it to
  summarize the brand from the PUBLIC URL of the site ({url} is filled in the prompt). Accessible name: the brand name plus the 'opens in a new tab' text from the dictionary.
  Glyphs: `ui/brand-glyphs.tsx` (the `simple-icons` dependency, one color; the ChatGPT mark is the official OpenAI Blossom SVG file from the brand team). NEVER draw a
  third-party mark by hand. Production must set the real public URL (`site.url` / SITE_URL), or the prompt names the review site.
*/
export type Assistant = "claude" | "chatgpt" | "gemini" | "perplexity";
const base: Record<Assistant, { name: string; url: (q: string) => string }> = {
  claude: { name: "Claude", url: (q) => `https://claude.ai/new?q=${q}` },
  chatgpt: { name: "ChatGPT", url: (q) => `https://chatgpt.com/?q=${q}` },
  gemini: { name: "Gemini", url: (q) => `https://gemini.google.com/app?q=${q}` },
  perplexity: { name: "Perplexity", url: (q) => `https://www.perplexity.ai/search?q=${q}` },
};

export function AiSummary({ label, prompt, siteUrl, newTab = "(se abre en una pestaña nueva)" }: { label: string; prompt: string; siteUrl: string; newTab?: string }) {
  const q = encodeURIComponent(prompt.replace("{url}", siteUrl));
  return (
    <div className="flex items-center gap-2 max-md:w-full">
      <span className="text-body-sm text-text-on-dark-secondary">{label}</span>
      <ul className="flex items-center gap-1">
        {(Object.keys(base) as Assistant[]).map((k) => (
          <li key={k}>
            <a
              href={base[k].url(q)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${base[k].name} (${newTab})`}
              className="grid size-8 place-items-center rounded-button text-text-on-dark-secondary transition-colors duration-fast hover:bg-white/10 hover:text-text-on-dark focus-ring-on-dark"
            >
              <Glyph name={k} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
