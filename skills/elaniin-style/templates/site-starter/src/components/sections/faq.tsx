import { FaqAccordion, type FaqItem } from "./faq-accordion";

/*
  FAQ (DESIGN.md components.faq): reusable section on WHITE, designed to sit between two dark sections. Two columns from 1024px (5 + 7): the title
  (h1 type, max 14ch) stays in view (sticky, 112px from the top) while the answers open; the right column is the accordion. Below 1024px the title
  goes above it. The questions are ALSO the data of the page's FAQPage JSON-LD (faqJsonLd), so the visible text and the data cannot drift apart.
*/
export type { FaqItem };

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: q.answer } })),
  };
}

export function Faq({ id = "faq", title, items }: { id?: string; title: string; items: FaqItem[] }) {
  return (
    <section id={id} className="bg-white section-y">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }} />
      <div className="container-site grid-page gap-y-12">
        <div className="col-span-12 min-w-0 lg:col-span-5">
          <h2 className="max-w-title font-display font-medium text-h1 text-balance text-text-primary lg:sticky lg:top-28">{title}</h2>
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
