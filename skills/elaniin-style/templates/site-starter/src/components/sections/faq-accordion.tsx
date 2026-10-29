"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "../ui/arrow";

export type FaqItem = { question: string; answer: string };

/* One question open at a time, the FIRST open at rest; a second tap on the open one closes it. The question is an h3 whose child is the BUTTON that covers the whole row. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <ul className="border-b border-border-default">
      {items.map((q, i) => {
        const isOpen = open === i;
        return (
          <li key={q.question} className="border-t border-border-default">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${uid}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start gap-4 py-6 text-left focus-ring md:gap-6"
              >
                <span className="w-8 shrink-0 pt-1.5 font-mono text-caption uppercase tracking-wider text-text-secondary">Q{i + 1}</span>
                <span className="min-w-0 flex-1 font-display text-h4 font-medium text-text-primary">{q.question}</span>
                <span className="grid size-10 shrink-0 place-items-center rounded-button border border-border-default bg-white text-text-primary transition-colors duration-fast hover:bg-surface-subtle">
                  {isOpen ? <MinusIcon /> : <PlusIcon />}
                </span>
              </button>
            </h3>
            <div id={`${uid}-${i}`} role="region" data-open={isOpen ? "" : undefined} className="accordion-panel">
              <div className="overflow-hidden">
                <p className="max-w-body pb-6 pl-12 text-body-lg text-text-secondary md:pl-14">{q.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
