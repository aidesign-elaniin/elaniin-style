import { allRoutes } from "../../lib/site-map";

export const dynamic = "force-static";

// Emits out/site-manifest.json. scripts/check.mjs and scripts/overflow.html read it: no list of pages is written by hand anywhere else.
export function GET() {
  return Response.json({ routes: allRoutes() });
}
