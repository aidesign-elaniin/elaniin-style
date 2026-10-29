"use client";

import { cn } from "./cn";
import { currentSection } from "./current-section";
import { withHash, type SwitchLink } from "./routes";

/*
  Language switch: two links to the SAME page in the other language (DESIGN.md section 13.2). No state, so it works inside
  the client Nav and in the server Footer. Without JavaScript it is a plain link; with it, a click lands on the section the
  visitor is reading right now (the anchors are the same in both languages), not on the last anchor that was clicked, and on
  the top of the page when they are on the hero. "auto" follows the nav bar theme through the `group`
  data-theme of the header; "dark" is for surfaces that are always dark (footer).
*/
const TONES = {
  auto: {
    current: "text-text-primary group-data-[theme=dark]:text-text-on-dark focus-ring",
    other:
      "text-text-secondary hover:text-text-primary group-data-[theme=dark]:text-text-on-dark-secondary group-data-[theme=dark]:hover:text-text-on-dark focus-ring",
    separator: "text-border-strong group-data-[theme=dark]:text-border-on-dark-strong",
  },
  dark: {
    current: "text-text-on-dark focus-ring-on-dark",
    other: "text-text-on-dark-secondary hover:text-text-on-dark focus-ring-on-dark",
    separator: "text-border-on-dark-strong",
  },
} as const;

export function LanguageSwitch({
  links,
  label,
  variant = "auto",
  className,
}: {
  links: SwitchLink[];
  label: string;
  variant?: "auto" | "dark";
  className?: string;
}) {
  const tone = TONES[variant];
  return (
    <nav aria-label={label} className={cn("flex items-center", className)}>
      {links.map((link, i) => (
        <span key={link.lang} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className={cn("select-none", tone.separator)}>
              |
            </span>
          )}
          <a
            href={link.href}
            hrefLang={link.lang}
            lang={link.lang}
            aria-label={link.name}
            aria-current={link.current ? "true" : undefined}
            onClick={(event) => {
              if (link.current || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              const section = currentSection();
              window.location.assign(withHash(link.href, section ? `#${section}` : ""));
            }}
            className={cn(
              "inline-flex h-8 items-center rounded-button px-2 font-text text-body-sm font-medium transition-colors duration-150 ease-standard",
              link.current ? tone.current : tone.other,
            )}
          >
            {link.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
