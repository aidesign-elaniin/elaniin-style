/*
  The section of the home the visitor is reading, for the language switch. The URL hash is not a reliable answer: it is the last
  anchor that was clicked, not where the page is scrolled to now. The section is the last one whose top has passed the line under
  the nav bar. The hero ("home") and a page with no sections answer null, so the switch lands on the top of the page.
*/
export type SectionTop = { id: string; top: number };

export function sectionAtLine(sections: SectionTop[], line: number): string | null {
  let found: string | null = null;
  for (const section of sections) if (section.top <= line) found = section.id;
  return found === "home" ? null : found;
}

/** The section in view right now, read from the page. */
export function currentSection(line = 80): string | null {
  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).map((el) => ({
    id: el.id,
    top: el.getBoundingClientRect().top,
  }));
  return sectionAtLine(sections, line);
}
