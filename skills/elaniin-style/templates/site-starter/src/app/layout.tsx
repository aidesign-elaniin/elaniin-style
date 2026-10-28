import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Instrument_Sans } from "next/font/google";
import { Footer } from "../components/layout/footer";
import { Fx } from "../components/layout/fx";
import { LogoSprite } from "../components/layout/logo-sprite";
import { Nav } from "../components/layout/nav";
import { site } from "../content/site";
import { navRoutes } from "../lib/site-map";
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
  const items = navRoutes().map((r) => ({ path: r.path, title: r.title }));
  return (
    <html lang={site.lang} className={`${display.variable} ${text.variable} ${mono.variable}`}>
      <head>
        {/* enables the reveal entrances only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <LogoSprite />
        <Fx />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-button focus:bg-white focus:px-4 focus:py-2">
          Saltar al contenido
        </a>
        <Nav items={items} />
        <main id="main" className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
