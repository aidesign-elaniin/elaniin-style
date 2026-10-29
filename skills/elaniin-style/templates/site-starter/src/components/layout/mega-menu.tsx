"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowIcon } from "../ui/arrow";
import { IconBox } from "../ui/icon-box";

/*
  Mega-menu of the bar (DESIGN.md components.mega-menu): desktop dropdown panels under the nav, from 1024px. One shared panel attached flush under
  the bar (white, hairline, radius menu, shadow menu, container width). Behavior: opens on hover with an 80ms intent delay, on click/tap or ArrowDown
  (focus moves into the panel); switching triggers is instant; closes 140ms after the pointer leaves the nav and panel, on Escape (focus returns to
  the trigger), on click outside and when focus leaves the header. Tab from an open trigger enters the panel. Two kinds of panel:
  - "rows": a list of rich rows (icon-box 40 + title body-lg 500 + description body-sm secondary, subtle on hover), with an optional `featured` column on the
    right (the Resources menu: 2fr rows + 3fr featured work).
  - "cards": THREE cards inset 8px (gap 8px, radius card). `look` software|ai|cloud (the solution looks, with 4 sublinks on a hairline) or "dark" (Elaniin Black,
    the engagement cards: icon-box dark, name h3, one line, an isometric `scene` at the bottom right, an arrow that slides in on hover; card-glow-quiet).
    Under the cards a help strip on surface-subtle: a question and a tertiary link.
  The mobile sheet keeps a plain list (see nav.tsx).
*/
export type MenuRow = { label: string; description?: string; href: string; icon?: ReactNode };
export type MenuCard = {
  label: string;
  description: string;
  href: string;
  icon: ReactNode;
  look: "software" | "ai" | "cloud" | "dark";
  sublinks?: { label: string; href: string }[];
  scene?: ReactNode;
};
export type MegaMenuData = {
  id: string;
  kind: "rows" | "cards";
  heading?: string;
  rows?: MenuRow[];
  featured?: ReactNode;
  cards?: MenuCard[];
  help?: { question: string; label: string; href: string };
};

const cardLook = {
  software: "solution-software border-border-strong text-text-primary",
  cloud: "solution-cloud border-border-strong text-text-primary",
  ai: "solution-ai border-border-on-dark text-text-on-dark",
  dark: "card-glow-quiet bg-surface-dark-alt border-border-on-dark hover:border-border-on-dark-strong text-text-on-dark",
} as const;

function Cards({ menu }: { menu: MegaMenuData }) {
  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 p-2">
        {menu.cards?.map((c) => {
          const dark = c.look === "ai" || c.look === "dark";
          return (
            <li key={c.href} className={`group relative flex min-w-0 flex-col rounded-card border pad-card ${cardLook[c.look]}`}>
              <IconBox dark={dark}>{c.icon}</IconBox>
              <h3 className="mt-4 font-display text-h3 font-medium">
                <Link href={c.href} className={`after:absolute after:inset-0 ${dark ? "focus-ring-on-dark" : "focus-ring"} rounded-button`}>
                  {c.label}
                </Link>
              </h3>
              <p className={`mt-2 text-body-sm ${dark ? "text-text-on-dark-secondary" : "text-text-secondary"}`}>{c.description}</p>
              {c.sublinks && (
                <ul className={`mt-4 border-t pt-2 ${dark ? "border-border-on-dark" : "border-border-default"}`}>
                  {c.sublinks.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="relative z-10 flex items-center justify-between rounded-tag px-2 py-1.5 text-body-sm hover:bg-black/5">
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {c.scene && (
                <div aria-hidden="true" className="mt-auto ml-auto w-full max-w-xs pt-4">
                  {c.scene}
                </div>
              )}
              <span aria-hidden="true" className="absolute right-4 top-4 -translate-x-1 opacity-0 transition-all duration-fast group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowIcon />
              </span>
            </li>
          );
        })}
      </ul>
      {menu.help && (
        <div className="flex items-center justify-between gap-4 bg-surface-subtle px-6 py-4">
          <p className="text-body-sm text-text-secondary">{menu.help.question}</p>
          <Link href={menu.help.href} className="btn-arrow inline-flex items-center gap-2 font-display text-body-sm font-medium text-text-link hover:text-text-link-hover focus-ring">
            {menu.help.label}
            <ArrowIcon />
          </Link>
        </div>
      )}
    </div>
  );
}

function Rows({ menu }: { menu: MegaMenuData }) {
  return (
    <div className={`grid ${menu.featured ? "grid-cols-5" : "grid-cols-1"}`}>
      <div className={`min-w-0 p-8 ${menu.featured ? "col-span-2 border-r border-border-default" : ""}`}>
        {menu.heading && <p className="px-3 text-body-sm font-medium text-text-muted">{menu.heading}</p>}
        <ul className="mt-2 flex flex-col">
          {menu.rows?.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="group flex items-start gap-3 rounded-menu p-3 hover:bg-surface-subtle focus-ring">
                {r.icon && <IconBox>{r.icon}</IconBox>}
                <span className="min-w-0">
                  <span className="block font-display text-body-lg font-medium text-text-primary">{r.label}</span>
                  {r.description && <span className="block text-body-sm text-text-secondary">{r.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {menu.featured && <div className="col-span-3 min-w-0">{menu.featured}</div>}
    </div>
  );
}

/* Triggers + shared panel. Rendered inside the bar (<header className="nav-bar">) so the panel attaches flush under it. */
export function MegaMenus({ menus, labels }: { menus: { id: string; label: string; data: MegaMenuData }[]; labels?: Record<string, never> }) {
  void labels;
  const [open, setOpen] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  // switching between triggers: the panel height animates to its content (300ms emphasized) and the content cross-slides 24px in the direction of travel (200ms emphasized)
  const previous = useRef<string | null>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const from = previous.current && open && previous.current !== open ? (menus.findIndex((m) => m.id === open) > menus.findIndex((m) => m.id === previous.current) ? 24 : -24) : 0;
  useEffect(() => {
    previous.current = open;
    if (!open) setHeight(undefined);
  }, [open]);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);
  const schedule = (fn: () => void, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggers.current[open]?.focus();
        setOpen(null);
      }
    };
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(null);
    const onFocus = (e: FocusEvent) => !wrap.current?.closest("header")?.contains(e.target as Node) && setOpen(null);
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    addEventListener("focusin", onFocus);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
      removeEventListener("focusin", onFocus);
    };
  }, [open]);

  const current = menus.find((m) => m.id === open);
  return (
    <div ref={wrap} onPointerLeave={() => schedule(() => setOpen(null), 140)} onPointerEnter={() => timer.current && clearTimeout(timer.current)} className="contents">
      <ul className="flex items-center gap-1">
        {menus.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              ref={(el) => {
                triggers.current[m.id] = el;
              }}
              aria-expanded={open === m.id}
              aria-controls={`menu-${m.id}`}
              onPointerEnter={() => schedule(() => setOpen(m.id), open ? 0 : 80)}
              onClick={() => setOpen(open === m.id ? null : m.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(m.id);
                  requestAnimationFrame(() => document.querySelector<HTMLElement>(`#menu-${m.id} a`)?.focus());
                }
              }}
              className={`nav-item focus-ring ${open === m.id ? "bg-surface-subtle" : ""}`}
            >
              {m.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" className={`transition-transform duration-base ${open === m.id ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <div id={`menu-${current.id}`} className="absolute inset-x-0 top-full z-40 bg-transparent" role="region" aria-label={current.label}>
          <div className="container-site">
            <div className="menu-panel overflow-hidden rounded-t-none" style={{ height, transition: "height var(--dur-slow) var(--ease-emphasized)" }}>
              <div ref={inner}>
                <div key={current.id} className={from ? "menu-swap" : ""} style={{ "--from": `${from}px` } as CSSProperties}>
                  {current.data.kind === "cards" ? <Cards menu={current.data} /> : <Rows menu={current.data} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
