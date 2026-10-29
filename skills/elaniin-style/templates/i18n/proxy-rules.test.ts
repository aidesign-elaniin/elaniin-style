import { describe, expect, it } from "vitest";
import { config } from "./proxy";
import { resolveLocale } from "./proxy-rules";

describe("resolveLocale", () => {
  it("serves the home in English through the English tree and in Spanish as it is", () => {
    expect(resolveLocale("/")).toEqual({ action: "rewrite", pathname: "/en" });
    expect(resolveLocale("/es")).toEqual({ action: "next" });
  });

  it("redirects /en to the unprefixed URL", () => {
    expect(resolveLocale("/en")).toEqual({ action: "redirect", pathname: "/" });
    expect(resolveLocale("/en/solutions")).toEqual({ action: "redirect", pathname: "/solutions" });
  });

  it("sends any URL that is not in the route table to the catch-all, in the language of the URL", () => {
    expect(resolveLocale("/solutions")).toEqual({ action: "rewrite", pathname: "/en/404" });
    expect(resolveLocale("/zzz")).toEqual({ action: "rewrite", pathname: "/en/404" });
    expect(resolveLocale("/es/zzz")).toEqual({ action: "rewrite", pathname: "/es/404" });
  });

  it("matches whole segments only, never prefixes of a word", () => {
    expect(resolveLocale("/english")).toEqual({ action: "rewrite", pathname: "/en/404" });
    expect(resolveLocale("/espanol")).toEqual({ action: "rewrite", pathname: "/en/404" });
    expect(resolveLocale("/es-x")).toEqual({ action: "rewrite", pathname: "/en/404" });
  });
});

describe("resolveLocale with translated slugs", () => {
  /* The folder under src/app/[lang] is named after the English slug; the Spanish slug is resolved here. */
  const table = {
    home: { en: "/", es: "/es" },
    solutions: { en: "/solutions", es: "/es/soluciones" },
  } as const;

  it("serves the English slug unprefixed and the Spanish slug under /es", () => {
    expect(resolveLocale("/solutions", table)).toEqual({ action: "rewrite", pathname: "/en/solutions" });
    expect(resolveLocale("/es/soluciones", table)).toEqual({ action: "rewrite", pathname: "/es/solutions" });
    expect(resolveLocale("/es", table)).toEqual({ action: "next" });
  });

  it("sends a slug of the other language to the Spanish catch-all", () => {
    expect(resolveLocale("/es/solutions", table)).toEqual({ action: "rewrite", pathname: "/es/404" });
    expect(resolveLocale("/soluciones", table)).toEqual({ action: "rewrite", pathname: "/en/404" });
  });

  it("still redirects /en/<slug> to the unprefixed URL", () => {
    expect(resolveLocale("/en/solutions", table)).toEqual({ action: "redirect", pathname: "/solutions" });
  });
});

describe("resolveLocale with uppercase language segments", () => {
  it("redirects /ES and /EN to the lowercase URL", () => {
    expect(resolveLocale("/ES")).toEqual({ action: "redirect", pathname: "/es" });
    expect(resolveLocale("/ES/soluciones")).toEqual({ action: "redirect", pathname: "/es/soluciones" });
    expect(resolveLocale("/EN")).toEqual({ action: "redirect", pathname: "/" });
    expect(resolveLocale("/EN/solutions")).toEqual({ action: "redirect", pathname: "/solutions" });
  });
});

describe("proxy matcher", () => {
  /* The matcher is path-to-regexp: "/(" + a regular expression + ")". */
  const matches = (path: string) => new RegExp(`^/${config.matcher[0].slice(1)}$`).test(path);

  it("runs on every page URL, including odd ones, so they all end in a localized page or a localized 404", () => {
    for (const path of ["/", "/es", "/solutions", "/apiary", "/api/x", "/x.php", "/ES"]) expect(matches(path)).toBe(true);
  });

  it("skips Next internals and real static files", () => {
    for (const path of ["/_next/static/a.js", "/__nextjs_font/x.woff2", "/icon.svg", "/robots.txt", "/sitemap.xml", "/assets/white-logotipo-elaniin.svg"]) {
      expect(matches(path)).toBe(false);
    }
  });
});
