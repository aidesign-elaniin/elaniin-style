import { describe, expect, it } from "vitest";
import { defaultLang, hasLang, langs, otherLang } from "./i18n";

describe("i18n", () => {
  it("accepts only the two supported languages, in lowercase", () => {
    expect(hasLang("en")).toBe(true);
    expect(hasLang("es")).toBe(true);
    expect(hasLang("fr")).toBe(false);
    expect(hasLang("EN")).toBe(false);
    expect(hasLang("")).toBe(false);
  });

  it("English is the default language", () => {
    expect(defaultLang).toBe("en");
    expect(langs).toEqual(["en", "es"]);
  });

  it("otherLang flips between the two languages", () => {
    expect(otherLang("en")).toBe("es");
    expect(otherLang("es")).toBe("en");
  });
});
