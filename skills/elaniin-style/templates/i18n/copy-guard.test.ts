import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/*
  Guard for DESIGN.md section 13.4 rule 1: no visible string lives in a component; copy comes from src/content.
  It flags Spanish text (accents or common words) in src/app and src/components, ignoring comments.
  PENDING lists the files not migrated yet. Each section task removes its files; a file left in the list
  that no longer holds Spanish also fails, so the list cannot go stale.
*/
const PENDING: string[] = [];

/* Client brand names (Vidrí...) are never translated, so the files that hold them are exempt. */
const EXEMPT = [
  "src/components/sections/clients/clients-data.ts",
];

const root = path.resolve(__dirname, "../..");
const SPANISH = /[áéíóúñÁÉÍÓÚÑ¿¡]|\b(Casos|Soluciones|Hablemos|Nosotros|Recursos|Contacto|Informe|Estudio|Saltar)\b/;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [full] : [];
  });
}

const stripComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const files = [...walk(path.join(root, "src/app")), ...walk(path.join(root, "src/components"))].map((f) => ({
  rel: path.relative(root, f),
  hasSpanish: SPANISH.test(stripComments(readFileSync(f, "utf8"))) && !EXEMPT.includes(path.relative(root, f)),
}));

describe("copy guard", () => {
  it("has no Spanish text in files that are already migrated", () => {
    const leaks = files.filter((f) => f.hasSpanish && !PENDING.includes(f.rel)).map((f) => f.rel);
    expect(leaks).toEqual([]);
  });

  it("keeps PENDING honest: every listed file still holds Spanish", () => {
    const stale = PENDING.filter((rel) => !files.find((f) => f.rel === rel)?.hasSpanish);
    expect(stale).toEqual([]);
  });
});
