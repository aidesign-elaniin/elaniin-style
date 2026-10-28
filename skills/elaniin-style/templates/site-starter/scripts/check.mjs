/*
  Gate before delivering: `npm run build && npm run check`.
  The list of pages is NOT written here: it is read from out/site-manifest.json (emitted from src/lib/site-map.ts).
  Fails (exit 1) when:
    - site-map.ts, sitemap.xml and the exported pages are not the same set
    - a page lacks its h1 or has more than one, has href="#", lacks the logotipo or lang
    - an internal link is broken (links end with "/" because of trailingSlash)
    - the `content` of a route does not match the data-placeholder marks drawn on screen
    - the source uses -mx-, gap-[..], grid-cols-[..], lift/card-glow inside grid-hairline, or gradients
    - an image has no alt, or is a data: / remote image
*/
import fs from "node:fs";
import path from "node:path";

const OUT = "out";
const fail = [];
const read = (p) => fs.readFileSync(p, "utf8");
if (!fs.existsSync(path.join(OUT, "site-manifest.json"))) {
  console.error("No out/site-manifest.json: run `npm run build` first.");
  process.exit(1);
}
const { routes } = JSON.parse(read(path.join(OUT, "site-manifest.json")));
const lang = /export const site = \{[^}]*lang: "([a-z]+)"/s.exec(read("src/content/site.ts"))?.[1] ?? "es";

// ---- sets: site-map vs sitemap.xml vs exported pages
const mapPaths = new Set(routes.map((r) => r.path));
const mapIndexable = new Set(routes.filter((r) => !r.redirect).map((r) => r.path));
const xml = fs.existsSync(path.join(OUT, "sitemap.xml")) ? read(path.join(OUT, "sitemap.xml")) : "";
const xmlPaths = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
const exported = new Set();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") exported.add("/" + path.relative(OUT, d).split(path.sep).filter(Boolean).join("/") + (d === OUT ? "" : "/"));
  }
})(OUT);
exported.delete("/_not-found/");
exported.delete("/404/");
const diff = (a, b) => [...a].filter((x) => !b.has(x));
for (const [name, a, b] of [["site-map", mapIndexable, xmlPaths], ["sitemap.xml", xmlPaths, mapIndexable], ["site-map", mapPaths, exported], ["exported pages", exported, mapPaths]]) {
  for (const x of diff(a, b)) fail.push(`${name} has ${x} but the other side does not`);
}

// ---- per page
const pageFile = (p) => path.join(OUT, p === "/" ? "" : p, "index.html");
const exists = (url) => {
  const clean = decodeURIComponent(url.split("#")[0].split("?")[0]);
  if (!clean) return true;
  const p = path.join(OUT, clean);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, "index.html")));
};
for (const r of routes) {
  const f = pageFile(r.path);
  if (!fs.existsSync(f)) continue;
  const html = read(f);
  const at = r.path;
  if (r.redirect) {
    // Static export: a redirect page is a tiny shell that forwards with JS. Check where it forwards to.
    const child = routes.find((x) => x.parent === r.path);
    if (!child || !html.includes(`NEXT_REDIRECT;replace;${child.path}`)) fail.push(`${at}: redirect does not forward to its first child (${child?.path})`);
    continue;
  }
  if (!new RegExp(`<html[^>]*lang="${lang}"`).test(html)) fail.push(`${at}: <html lang="${lang}"> missing`);
  if (!/<use[^>]*href="#elaniin-logo/.test(html)) fail.push(`${at}: official logotipo (<use href="#elaniin-logo…">) missing`);
  if (/href="#"/.test(html)) fail.push(`${at}: href="#" placeholder link`);
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    if (href.startsWith("/") && !exists(href)) fail.push(`${at}: broken link ${href}`);
  }
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    const src = /src="([^"]*)"/.exec(m[0])?.[1] ?? "";
    if (!/\salt="/.test(m[0])) fail.push(`${at}: image without alt (${src.slice(0, 50)})`);
    if (src.startsWith("data:")) fail.push(`${at}: data: URI image`);
    else if (/^https?:/.test(src)) fail.push(`${at}: remote image ${src}`);
    else if (src.startsWith("/") && !exists(src)) fail.push(`${at}: missing asset ${src}`);
  }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail.push(`${at}: ${h1} <h1> (must be exactly 1)`);
  const stamped = /data-content="([a-z]+)"/.exec(html)?.[1];
  if (stamped !== r.content) fail.push(`${at}: site-map says content "${r.content}" but the page stamps "${stamped}"`);
  const marks = (html.match(/data-placeholder/g) ?? []).length;
  if (r.content === "real" && marks > 0) fail.push(`${at}: content "real" but ${marks} filler marks on screen`);
  if (r.content !== "real" && marks === 0) fail.push(`${at}: content "${r.content}" but no data-placeholder chip on screen`);
}

// ---- source rules
const src = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|ts)$/.test(e.name)) src.push(p);
  }
})("src");
for (const f of src) {
  const t = read(f);
  const code = t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  if (/(^|[\s"'`])-mx-/.test(code)) fail.push(`${f}: negative margin (-mx-)`);
  if (/gap-\[/.test(code)) fail.push(`${f}: arbitrary gap (gap-[…])`);
  if (/grid-cols-\[/.test(code)) fail.push(`${f}: arbitrary grid-cols-[…]`);
  if (/gradient/i.test(code)) fail.push(`${f}: gradient`);
  if (/grid-hairline/.test(code) && /\b(lift|card-glow)\b/.test(code)) fail.push(`${f}: lift/card-glow in a file that uses grid-hairline`);
  if (/from\s+["']@\//.test(code)) fail.push(`${f}: "@/" alias import (use relative imports)`);
}

console.log(`${routes.length} routes in site-map · ${exported.size} pages exported · ${xmlPaths.size} in sitemap.xml`);
if (fail.length) {
  console.error(fail.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log("OK: site-map = sitemap.xml = exported pages; content marks match; no rule violations.");
