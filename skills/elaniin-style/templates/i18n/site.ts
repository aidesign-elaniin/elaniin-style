const REVIEW_SITE = "https://review.example.com"; // the review/staging URL of YOUR project (replace it)

/*
  Public origin used for canonical, hreflang and sitemap URLs. Set SITE_URL on the real production project.
  An empty value falls back to the review site, a trailing slash is dropped, and opening the site to search engines
  (ALLOW_INDEXING=true) without its own SITE_URL fails loudly instead of publishing canonicals that point at the review site.
*/
export function siteUrl(): string {
  const configured = process.env.SITE_URL;
  if (process.env.ALLOW_INDEXING === "true" && !configured) {
    throw new Error("ALLOW_INDEXING=true needs SITE_URL (the public origin of the site).");
  }
  return (configured || REVIEW_SITE).replace(/\/+$/, "");
}
