import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Instrument_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { site } from "@/content/site";
import "./globals.css";

const display = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-instrument-sans", display: "swap" });
const text = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang must match the language of the copy: "es" for Spanish, "en" for English.
  return (
    <html lang="es" className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-button focus:bg-white focus:px-4 focus:py-2">
          Saltar al contenido
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
