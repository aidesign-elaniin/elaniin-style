import { describe, expect, it } from "vitest";
import { parseRegion, resolveRegion } from "./region";

describe("resolveRegion", () => {
  it("takes the review override first", () => {
    expect(resolveRegion({ query: "el-salvador", country: "US" })).toBe("sv");
    expect(resolveRegion({ query: "SV" })).toBe("sv");
    expect(resolveRegion({ query: "all", country: "SV" })).toBe("world");
    expect(resolveRegion({ query: "anything" })).toBe("world");
  });

  it("uses the platform country when there is no override", () => {
    expect(resolveRegion({ country: "SV" })).toBe("sv");
    expect(resolveRegion({ country: "sv" })).toBe("sv");
    expect(resolveRegion({ country: "US" })).toBe("world");
    expect(resolveRegion({ country: "MX" })).toBe("world");
  });

  it("returns null when nothing says where the visitor is", () => {
    expect(resolveRegion({})).toBeNull();
    expect(resolveRegion({ query: "", country: "" })).toBeNull();
  });
});

describe("parseRegion", () => {
  it("accepts the two regions and falls back to the world", () => {
    expect(parseRegion("sv")).toBe("sv");
    expect(parseRegion("world")).toBe("world");
    expect(parseRegion("xx")).toBe("world");
    expect(parseRegion(undefined)).toBe("world");
  });
});
