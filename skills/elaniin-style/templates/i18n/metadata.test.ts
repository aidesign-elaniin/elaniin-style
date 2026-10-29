import { afterEach, describe, expect, it } from "vitest";
import { buildMetadata } from "./metadata";

const page = { title: "Your Site | Test", description: "A test description." };

describe("buildMetadata", () => {
  afterEach(() => {
    delete process.env.ALLOW_INDEXING;
    delete process.env.SITE_URL;
  });

  it("canonical points at the page itself in each language", () => {
    expect(buildMetadata("en", "home", page).alternates?.canonical).toBe("/");
    expect(buildMetadata("es", "home", page).alternates?.canonical).toBe("/es");
  });

  it("declares hreflang for both languages and x-default (English)", () => {
    expect(buildMetadata("es", "home", page).alternates?.languages).toEqual({ en: "/", es: "/es", "x-default": "/" });
  });

  it("sets the Open Graph locale and the alternate one", () => {
    const og = buildMetadata("es", "home", page).openGraph as { locale?: string; alternateLocale?: string };
    expect(og.locale).toBe("es_LA");
    expect(og.alternateLocale).toBe("en_US");
  });

  it("keeps the review site out of search engines unless ALLOW_INDEXING=true", () => {
    expect(buildMetadata("en", "home", page).robots).toEqual({ index: false, follow: false });
    process.env.ALLOW_INDEXING = "true";
    process.env.SITE_URL = "https://example.com"; // opening the site to search engines requires its own origin (src/lib/site.ts)
    expect(buildMetadata("en", "home", page).robots).toBeUndefined();
  });
});
