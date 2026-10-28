import type { ReactNode } from "react";
import { findRoute } from "../../lib/site-map";

/* Wraps every page: stamps the `content` of its route (real | mixed | placeholder) so the check script can compare it. */
export function PageShell({ path, children }: { path: string; children: ReactNode }) {
  const route = findRoute(path);
  if (!route) throw new Error(`PageShell: ${path} is not declared in src/lib/site-map.ts`);
  return <div data-content={route.content}>{children}</div>;
}
