"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LinkButton } from "../ui/button";
import { cta } from "../../lib/site-map";
import { Logo } from "./logo";
import { MegaMenus, type MegaMenuData } from "./mega-menu";

/* An item is a plain link, or (with `menu`) a trigger of a mega-menu panel. */
type NavItem = { path: string; title: string; menu?: MegaMenuData };

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

/*
  Nav bar of the reference site (DESIGN.md components.nav):
  - (the same algorithm lives in templates/nav-theme.js for standalone HTML: change both together)
  - glass bar of 64px (`nav-bar`: white 80% under an 8px blur) that ADOPTS the color of the section under it. Sections with a
    dark background of their own declare data-nav-theme="blue" | "black"; this component sets data-theme / data-tone on the bar,
  - items are 40px pills (`nav-item`) with a subtle surface on hover; one primary CTA of height 40 on the right,
  - below lg a 40px hamburger opens a real drawer: aria-expanded, focus moves in, Tab is trapped, Esc / scrim / link close it
    and give the focus back, scroll is locked while open and it closes by itself when the viewport grows.
*/
export function Nav({ items, switcher, secondary }: { items: NavItem[]; switcher?: React.ReactNode; secondary?: { label: string; href: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tone, setTone] = useState<"blue" | "black">("blue");
  const bar = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  const close = (restore = true) => {
    setOpen(false);
    if (restore) btn.current?.focus();
  };

  useEffect(() => setOpen(false), [pathname]);

  // The bar takes the theme of the section that crosses its middle (rAF-throttled).
  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      raf = null;
      const mid = (bar.current?.offsetHeight ?? 64) / 2;
      let next: "light" | "dark" = "light";
      let nextTone: "blue" | "black" = "blue";
      document.querySelectorAll<HTMLElement>("[data-nav-theme]").forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          next = "dark";
          nextTone = s.dataset.navTheme === "black" ? "black" : "blue";
        }
      });
      setTheme(next);
      setTone(nextTone);
    };
    const schedule = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("overflow-hidden", open);
    if (!open) return;
    drawer.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !drawer.current) return;
      const nodes = Array.from(drawer.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = matchMedia("(min-width: 64rem)");
    const onGrow = () => mq.matches && close(false);
    addEventListener("keydown", onKey);
    mq.addEventListener("change", onGrow);
    return () => {
      removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onGrow);
      document.documentElement.classList.remove("overflow-hidden");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <header ref={bar} className="nav-bar" data-theme={open ? "light" : theme} data-tone={tone}>
        <div className="container-site flex h-full items-center gap-4 xl:gap-6">
          <Link href="/" aria-label="Inicio" className="shrink-0 rounded-button focus-ring">
            <Logo className="nav-logo-light h-7 w-auto" />
            <Logo variant="white" className="nav-logo-dark h-7 w-auto" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex xl:ml-4" aria-label="Principal">
            <MegaMenus menus={items.filter((r) => r.menu).map((r) => ({ id: r.menu!.id, label: r.title, data: r.menu! }))} />
            {items.filter((r) => !r.menu).map((r) => (
              <Link key={r.path} href={r.path} className="nav-item focus-ring" aria-current={pathname === r.path ? "page" : undefined}>
                {r.title}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            {switcher && <div className="hidden lg:block">{switcher}</div>}
            {secondary && (
              <LinkButton href={secondary.href} s="md" v="secondary" className="hidden lg:inline-flex">
                {secondary.label}
              </LinkButton>
            )}
            <LinkButton href={cta.href} s="md">
              {cta.label}
            </LinkButton>
            <button
              ref={btn}
              type="button"
              aria-controls="app-drawer"
              aria-expanded={open}
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="nav-toggle focus-ring lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="scrim lg:hidden" data-open={open} aria-hidden="true" onClick={() => close()} />
      <aside
        ref={drawer}
        id="app-drawer"
        data-open={open}
        className="drawer flex flex-col border-r border-border-default bg-white lg:hidden"
        aria-label="Principal"
      >
        <div className="flex h-16 items-center justify-between border-b border-border-default pl-6 pr-3">
          <Logo className="h-6 w-auto" />
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => close()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-button text-text-secondary transition-colors duration-base hover:bg-surface-subtle focus-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Principal móvil">
          {items.map((r) =>
            r.menu ? (
              <details key={r.path} className="group">
                <summary className="flex h-10 cursor-pointer list-none items-center justify-between rounded-button px-3 font-display text-body font-medium text-text-primary hover:bg-surface-subtle focus-ring">
                  {r.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className="transition-transform duration-base group-open:rotate-180">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <ul className="pb-2 pl-3">
                  {[...(r.menu.rows ?? []), ...(r.menu.cards ?? [])].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={() => close(false)} className="flex h-10 items-center rounded-button px-3 text-body-sm text-text-secondary hover:bg-surface-subtle focus-ring">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                key={r.path}
                href={r.path}
                onClick={() => close(false)}
                className="flex h-10 items-center rounded-button px-3 font-display text-body font-medium text-text-primary transition-colors duration-base hover:bg-surface-subtle focus-ring"
              >
                {r.title}
              </Link>
            ),
          )}
        </nav>
        <div className="flex flex-col gap-3 border-t border-border-default p-4">
          {switcher}
          {secondary && (
            <LinkButton href={secondary.href} v="secondary" className="w-full">
              {secondary.label}
            </LinkButton>
          )}
          <LinkButton href={cta.href} className="w-full">
            {cta.label}
          </LinkButton>
        </div>
      </aside>
    </>
  );
}
