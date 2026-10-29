import { NextResponse, type NextRequest } from "next/server";
import { resolveLocale } from "./proxy-rules";
import {
  REGION_COOKIE,
  REGION_COOKIE_MAX_AGE,
  resolveRegion,
} from "./region";

/*
  The region of the visitor (client logos) goes in a cookie, so the pages stay static. ?country= is the review override and
  wins; then the country header of the hosting platform; with neither, the cookie already there is left alone.
*/
function withRegion(request: NextRequest, response: NextResponse) {
  const region = resolveRegion({
    query: request.nextUrl.searchParams.get("country"),
    country: request.headers.get("x-vercel-ip-country"),
  });
  if (region && request.cookies.get(REGION_COOKIE)?.value !== region) {
    response.cookies.set(REGION_COOKIE, region, {
      path: "/",
      maxAge: REGION_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }
  return response;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone(); // keeps the query string
  const result = resolveLocale(url.pathname);

  if (result.action === "next") return withRegion(request, NextResponse.next());

  url.pathname = result.pathname;
  if (result.action === "redirect")
    return withRegion(request, NextResponse.redirect(url, 308));
  return withRegion(request, NextResponse.rewrite(url));
}

/*
  Runs on every page URL, so that anything unknown ends in a localized page or a localized 404 (the catch-all route).
  It skips Next internals (_next, __nextjs...) and real static files by extension (icon.svg, sitemap.xml, robots.txt, assets).
*/
export const config = {
  matcher: [
    "/((?!_next/|__nextjs|.*\\.(?:svg|png|jpe?g|gif|webp|avif|ico|txt|xml|json|webmanifest|map|woff2?|css|js)$).*)",
  ],
};
