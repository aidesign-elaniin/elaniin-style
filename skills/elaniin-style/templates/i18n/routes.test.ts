import { describe, expect, it } from "vitest";
import { absoluteUrl, alternates, href } from "./routes";

describe("routes", () => {
  it("builds the English home without a prefix and the Spanish home under /es", () => {
    expect(href("home", "en")).toBe("/");
    expect(href("home", "es")).toBe("/es");
  });

  it("appends the anchor to the path of the language", () => {
    expect(href("home", "en", "cases")).toBe("/#cases");
    expect(href("home", "es", "cases")).toBe("/es#cases");
  });

  it("lists both languages and x-default (English) as alternates", () => {
    expect(alternates("home")).toEqual({ en: "/", es: "/es", "x-default": "/" });
  });

  it("makes absolute URLs from the site URL", () => {
    expect(absoluteUrl("/es")).toMatch(/^https:\/\/.+\/es$/);
  });
});
