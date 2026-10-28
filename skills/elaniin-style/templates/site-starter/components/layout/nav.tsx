"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cta, navRoutes } from "@/lib/site-map";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "./logo";

/* Sticky bar (bg-white/90 + 8px blur is the one allowed blur) + mobile drawer below md. */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    if (open) drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btn.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = "nav-link transition-colors duration-base hover:text-text-primary";
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-default bg-white/90 backdrop-blur">
        <div className="container-site flex h-16 items-center justify-between">
          <Link href="/" aria-label="Inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-body-sm text-text-secondary md:flex" aria-label="Principal">
            {navRoutes.map((r) => (
              <Link key={r.path} href={r.path} className={linkClass} aria-current={pathname === r.path ? "page" : undefined}>
                {r.title}
              </Link>
            ))}
            <LinkButton href={cta.href} s="md" arrow className="ml-2">
              {cta.label}
            </LinkButton>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <button
              ref={btn}
              type="button"
              aria-controls="app-drawer"
              aria-expanded={open}
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-button border border-border-default transition-colors duration-base hover:bg-surface-subtle focus-ring"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="scrim md:hidden" data-open={open} aria-hidden="true" onClick={() => setOpen(false)} />
      <aside
        ref={drawer}
        id="app-drawer"
        data-open={open}
        className="drawer flex flex-col border-r border-border-default bg-white md:hidden"
        aria-label="Principal"
      >
        <div className="flex h-16 items-center justify-between border-b border-border-default pl-6 pr-3">
          <Logo className="h-6 w-auto" />
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => {
              setOpen(false);
              btn.current?.focus();
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-button text-text-secondary transition-colors duration-base hover:bg-surface-subtle focus-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Principal móvil">
          {navRoutes.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              className="flex h-11 items-center rounded-button px-3 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
            >
              {r.title}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border-default p-4">
          <LinkButton href={cta.href} className="w-full">
            {cta.label}
          </LinkButton>
        </div>
      </aside>
    </>
  );
}
