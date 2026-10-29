/* Path of a file in public/ (images, glyphs). Next prefixes links and routes with basePath by itself, but NOT plain <img src> or CSS url(): set
   NEXT_PUBLIC_BASE_PATH (e.g. "/my-repo" on GitHub Pages) at build time and every asset follows. Empty on a site served from the root. */
export const asset = (path: string): string => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
