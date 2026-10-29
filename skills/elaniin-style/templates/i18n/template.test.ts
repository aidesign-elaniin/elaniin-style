import { describe, expect, it } from "vitest";
import { fill } from "./template";

describe("fill", () => {
  it("replaces every {key} with its value", () => {
    expect(fill("Shipment {id}", { id: "#4821" })).toBe("Shipment #4821");
    expect(fill("{a} and {a} and {b}", { a: 1, b: "x" })).toBe("1 and 1 and x");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(fill("Hi {name}", {})).toBe("Hi {name}");
  });
});
