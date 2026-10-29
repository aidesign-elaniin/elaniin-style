import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { anchors } from "./anchors";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [full] : [];
  });
}

describe("anchors", () => {
  it("uses English, unique ids", () => {
    const values = Object.values(anchors);
    expect(new Set(values).size).toBe(values.length);
    expect(anchors).toEqual({ home: "home", routes: "routes", solutions: "solutions", engagement: "engagement", method: "method", cases: "cases", research: "research", contact: "contact" });
  });

  it("leaves no Spanish anchor id in the source", () => {
    const old = /#inicio|#soluciones|#casos|#investigaciones|#contacto|"inicio"|"soluciones"|"casos"|"investigaciones"|"contacto"/;
    const offenders = walk(path.resolve(__dirname, ".."))
      .filter((f) => old.test(readFileSync(f, "utf8")))
      .map((f) => path.relative(path.resolve(__dirname, "../.."), f));
    expect(offenders).toEqual([]);
  });
});
