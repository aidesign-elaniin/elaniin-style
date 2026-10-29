import type { CredentialId } from "./credentials";

// Site-wide values. The text of each page lives in its own file next to this one.
export const site = {
  name: "Elaniin",
  lang: "es",
  url: "https://example.com", // replace with the real domain (used by sitemap.xml)
  description: "Texto de relleno: descripción corta del sitio para buscadores.",
  email: "hola@example.com",
  tagline: { lead: "Texto de relleno.", rest: "Una línea sobre lo que hace la empresa." },
  entity: "Texto de relleno: descriptor de la empresa",
  // Footer extras (all optional, off by default). A client site must NOT show Elaniin's badges: list only the credentials the company really holds.
  credentials: [] as CredentialId[], // e.g. ["aws", "google", "clutchGlobal", "clutchSoftware", "clutchStaff", "gptw", "claude", "webflow"] (the wide Webflow badge goes last)
  credentialsLabel: "Nuestras certificaciones",
  social: [] as { network: "linkedin" | "instagram"; label: string; href: string }[], // real URLs only: the gate rejects href="#"
  aiSummary: false, // "Get an AI summary" row (Claude, ChatGPT, Gemini, Perplexity); the prompt names the public URL `url`
  aiSummaryLabel: "Resumen de la empresa con IA:",
  aiSummaryPrompt: "Resume a qué se dedica la empresa del sitio {url}: servicios, a quién sirve y cómo trabaja.",
};
