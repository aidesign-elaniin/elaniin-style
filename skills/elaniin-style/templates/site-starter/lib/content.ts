import fs from "node:fs";
import path from "node:path";
import { collections } from "./site-map";

export type ServiceItem = {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  image: { src: string; alt: string };
};

type Collections = { services: ServiceItem };

/** Reads every JSON file of a collection at build time (content/<collection>/*.json). */
export function getCollection<K extends keyof typeof collections>(name: K): Collections[K][] {
  const dir = path.join(process.cwd(), "content", name);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Collections[K]);
}
