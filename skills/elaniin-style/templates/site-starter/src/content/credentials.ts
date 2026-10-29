/*
  Catalog of the credential badges of the footer (DESIGN.md components.footer.credentials). The files live in public/certification/ (master copies in
  skills/elaniin-style/assets/certification/; they are the marks of their owners and of Elaniin: show a badge ONLY if the company really holds it).
  They are black on transparent, made for light backgrounds: the footer turns them white (invert at 80%). `tall` is the height: square badges are 64px
  high; the wide Webflow one goes LAST and is 24px high. `name` is the alt text. Pick the badges in `site.credentials` (ids), in this order.
*/
export type CredentialId = "aws" | "google" | "clutchGlobal" | "clutchSoftware" | "clutchStaff" | "gptw" | "claude" | "webflow";

export const credentialCatalog: Record<CredentialId, { name: string; src: string; width: number; height: number; tall: "h-16" | "h-6" }> = {
  aws: { name: "AWS Partner, Premier Tier Services", src: "/certification/badge-clutch-aws.svg", width: 94, height: 94, tall: "h-16" },
  google: { name: "Google Cloud Partner", src: "/certification/gcp.svg", width: 104, height: 104, tall: "h-16" },
  clutchGlobal: { name: "Clutch Global", src: "/certification/badge-clutch-global.svg", width: 118, height: 104, tall: "h-16" },
  clutchSoftware: { name: "Clutch Top Software Developers, El Salvador", src: "/certification/badge-clutch-top-software-developers.svg", width: 98, height: 110, tall: "h-16" },
  clutchStaff: { name: "Clutch Top Staff Augmentation Company, El Salvador", src: "/certification/badge-clutch-top-staff.svg", width: 98, height: 110, tall: "h-16" },
  gptw: { name: "Great Place to Work, El Salvador", src: "/certification/gptw.svg", width: 104, height: 104, tall: "h-16" },
  claude: { name: "Claude Certified Services Partner", src: "/certification/claude.svg", width: 50, height: 50, tall: "h-16" },
  webflow: { name: "Webflow Professional Partner", src: "/certification/webflow.svg", width: 223, height: 34, tall: "h-6" },
};
