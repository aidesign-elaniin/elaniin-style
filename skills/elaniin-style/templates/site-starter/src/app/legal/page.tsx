import { redirect } from "next/navigation";
import { collections } from "../../lib/site-map";

// /legal/ has no page of its own: it forwards to the first child.
// With a static export the redirect is done by the browser (meta refresh / JS), not by a server.
export default function LegalIndex() {
  const { base, items } = collections.legal;
  redirect(`${base}${items[0].slug}/`);
}
