"use client";

import { useRef, type ReactNode } from "react";
import { ArrowLink } from "../ui/arrow";

/*
  Expanded detail of a solution (DESIGN.md components.solution-dialog). Uses the native <dialog>: showModal() gives the focus trap, Escape,
  inert page and focus return for free. Surface white, radius modal (16), shadow menu, max 1080px; the backdrop is Excellence Blue at 55%.
  From 1024px two columns (details | visual column that takes the look of its solution). The close button stays white and legible on every look.
*/
export type SolutionDetail = {
  title: string;
  intro: string;
  bullets: { title: string; text: string }[];
  metrics: { value: string; label: string }[];
  cta: { label: string; href: string };
  closeLabel: string;
  visual: ReactNode;
};

const lookClass = { software: "solution-software", ai: "solution-ai", cloud: "solution-cloud" } as const;

export function SolutionDialog({ detail, look, openLabel, buttonClass }: { detail: SolutionDetail; look: "software" | "ai" | "cloud"; openLabel: string; buttonClass: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const close = () => ref.current?.close();
  // after closing, the browser returns the focus to the opener: do not paint the ring until the next key press (DESIGN.md section 8)
  const onClose = () => {
    const b = opener.current;
    if (!b) return;
    b.setAttribute("data-focus-returned", "");
    addEventListener("keydown", () => b.removeAttribute("data-focus-returned"), { once: true });
  };
  return (
    <>
      <button
        ref={opener}
        type="button"
        aria-label={openLabel}
        onClick={() => ref.current?.showModal()}
        className={`icon-grow relative z-10 grid size-10 shrink-0 place-items-center rounded-button border transition-colors duration-fast focus-ring ${buttonClass}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
      <dialog
        ref={ref}
        onClose={onClose}
        aria-labelledby={`dlg-${look}`}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto w-full max-w-dialog overflow-hidden rounded-modal border border-border-default bg-white p-0 text-text-primary shadow-menu backdrop:bg-excellence-blue/55"
      >
        <div className="dialog-scroll grid lg:grid-cols-2">
          <div className="min-w-0 p-8">
            <h2 id={`dlg-${look}`} className="font-display font-medium text-h2 text-balance">
              {detail.title}
            </h2>
            <p className="mt-4 text-body-lg text-text-secondary">{detail.intro}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {detail.bullets.map((b) => (
                <li key={b.title} className="min-w-0">
                  <p className="font-display font-medium">{b.title}</p>
                  <p className="text-body-sm text-text-secondary">{b.text}</p>
                </li>
              ))}
            </ul>
            <dl className="grid-hairline mt-8 grid-cols-2">
              {detail.metrics.map((m) => (
                <div key={m.label} className="pad-card">
                  <dt className="metric-label">{m.label}</dt>
                  <dd className="metric-value">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <ArrowLink href={detail.cta.href}>{detail.cta.label}</ArrowLink>
            </div>
          </div>
          <div className={`relative min-w-0 p-8 ${lookClass[look]}`}>{detail.visual}</div>
        </div>
        <button type="button" onClick={close} aria-label={detail.closeLabel} className="absolute right-3 top-3 grid size-10 place-items-center rounded-button border border-border-default bg-white text-text-primary focus-ring">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
