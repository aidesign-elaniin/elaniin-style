import type { NextConfig } from "next";

// Static export: plain HTML in `out/`, no server. Move up the ladder (references/site-architect.md)
// only when the site needs forms with an API, per-language routing or dynamic content.
// NEXT_PUBLIC_BASE_PATH (e.g. "/my-repo") publishes the site under a sub-path such as a GitHub Pages project site; see src/lib/asset.ts.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default config;
