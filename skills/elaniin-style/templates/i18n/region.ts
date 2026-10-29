/*
  The region of the visitor decides which client logos the strip shows (DESIGN.md components.logo-strip.regions).
  It is resolved in the proxy, without asking the visitor for location, and kept in a cookie so the pages stay static.
*/
export type Region = "sv" | "world";

export const REGION_COOKIE = "region";
export const REGION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year, in seconds

const isRegion = (value: string | undefined | null): value is Region =>
  value === "sv" || value === "world";

/* ?country=el-salvador (or sv) is El Salvador; ?country=all (or anything else) is the rest of the world. */
function fromQuery(value: string): Region {
  const v = value.trim().toLowerCase();
  return v === "sv" ||
    v === "el-salvador" ||
    v === "el_salvador" ||
    v === "elsalvador"
    ? "sv"
    : "world";
}

/*
  Order: the review override, then the ISO country that the hosting platform puts on the request (x-vercel-ip-country),
  otherwise null (the caller keeps the cookie it already has).
*/
export function resolveRegion(input: {
  query?: string | null;
  country?: string | null;
}): Region | null {
  if (input.query) return fromQuery(input.query);
  if (input.country)
    return input.country.trim().toUpperCase() === "SV" ? "sv" : "world";
  return null;
}

/* The region stored in the cookie; anything unknown is the rest of the world. */
export function parseRegion(value: string | undefined | null): Region {
  return isRegion(value) ? value : "world";
}
