import type { NextConfig } from "next";

// Static export: plain HTML in `out/`, no server. Move up the ladder (references/site-architect.md)
// only when the site needs forms with an API, per-language routing or dynamic content.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
