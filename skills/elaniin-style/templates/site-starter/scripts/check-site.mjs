/*
  Gate before delivering: run `npm run build && npm run check`.
  Reads the generated HTML in out/ and fails (exit 1) on:
    - an internal link that points to a page that does not exist
    - a local image/asset whose file does not exist
    - an image without alt, a data: URI image or a remote image
  No dependencies: plain regex over the built files.
*/
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
if (!fs.existsSync(OUT)) {
  console.error("No out/ folder: run `npm run build` first.");
  process.exit(1);
}

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(OUT);

const pages = files.filter((f) => f.endsWith(".html"));
const exists = (url) => {
  const clean = decodeURIComponent(url.split("#")[0].split("?")[0]);
  if (!clean) return true;
  const p = path.join(OUT, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, "index.html")));
};

const problems = [];
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const where = path.relative(OUT, page);
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href) || href === "#") continue;
    if (href.startsWith("/") && !exists(href)) problems.push(`${where}: broken link ${href}`);
  }
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    const tag = m[0];
    const src = /src="([^"]*)"/.exec(tag)?.[1] ?? "";
    if (!/\salt="/.test(tag)) problems.push(`${where}: image without alt (${src.slice(0, 60)})`);
    if (src.startsWith("data:")) problems.push(`${where}: data: URI image`);
    else if (/^https?:/.test(src)) problems.push(`${where}: remote image ${src}`);
    else if (src.startsWith("/") && !exists(src)) problems.push(`${where}: missing asset ${src}`);
  }
}

console.log(`${pages.length} pages checked.`);
if (problems.length) {
  console.error(problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log("OK: no broken links, no missing assets, every image has alt.");
