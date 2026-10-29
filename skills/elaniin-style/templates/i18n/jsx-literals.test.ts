import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

/*
  Guard for DESIGN.md section 13.4 rule 1, in BOTH directions: no visible string lives in a component. Unlike
  copy-guard.test.ts (which sees Spanish), this parses the JSX and flags any literal text node and any literal
  aria-label, alt, placeholder or title, whatever the language. Words and strings that are not copy are allowed below.
*/
const ALLOWED = new Set([
  "|", // separator of the language switch (aria-hidden)
  "PR #142", // pull request id inside the delivery mock (not a word)
  "9:41", // clock of the phone status bar in the signup mock
  "Elaniin", // brand name (logo alt)
  "", // empty alt: a decorative image has no accessible name (the client logos that animate; the names are announced once)
  "Marta R.", // invented driver name in the shipment mock (a proper name, not copy)
  // invented client brand names of the placeholder logos: never translated
  "altamar",
  "Kintsu",
  "nodo.",
  "Vértice",
  "orbita",
]);

const root = path.resolve(__dirname, "../..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".tsx") && !/\.test\./.test(name) ? [full] : [];
  });
}

const ATTRIBUTES = new Set(["aria-label", "alt", "placeholder", "title"]);

function literals(file: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      const text = node.getText().replace(/\s+/g, " ").trim();
      if (/[\p{L}]/u.test(text)) found.push(text);
    }
    if (
      ts.isJsxAttribute(node) &&
      ATTRIBUTES.has(node.name.getText()) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      found.push(node.initializer.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found.filter((text) => !ALLOWED.has(text));
}

describe("jsx literals", () => {
  it("has no literal visible text or accessible name in any component", () => {
    const offenders = [...walk(path.join(root, "src/app")), ...walk(path.join(root, "src/components"))].flatMap(
      (file) => literals(file).map((text) => `${path.relative(root, file)}: ${text}`),
    );
    expect(offenders).toEqual([]);
  });
});
