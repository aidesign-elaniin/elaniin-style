import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

/*
  How the elements of an .mdx file look. Tokens only. The page already has its h1 (PageHeader), so "# " in a file renders as h2.
  Authors can also use <Callout>…</Callout> inside any .mdx file.
*/
export function Callout({ children }: { children: ReactNode }) {
  return <aside className="my-8 max-w-body min-w-0 rounded-card border border-border-default bg-surface-subtle pad-card text-body text-text-primary">{children}</aside>;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (p) => <h2 {...p} className="mt-12 mb-4 max-w-body font-display font-medium text-h3 text-text-primary" />,
    h2: (p) => <h2 {...p} className="mt-12 mb-4 max-w-body font-display font-medium text-h3 text-text-primary" />,
    h3: (p) => <h3 {...p} className="mt-8 mb-3 max-w-body font-display font-medium text-h4 text-text-primary" />,
    p: (p) => <p {...p} className="my-5 max-w-body break-words text-body text-text-secondary" />,
    ul: (p) => <ul {...p} className="my-5 max-w-body list-disc space-y-2 pl-6 text-body text-text-secondary" />,
    ol: (p) => <ol {...p} className="my-5 max-w-body list-decimal space-y-2 pl-6 text-body text-text-secondary" />,
    a: (p) => <a {...p} className="text-text-primary underline underline-offset-4 focus-ring" />,
    strong: (p) => <strong {...p} className="font-medium text-text-primary" />,
    blockquote: (p) => <blockquote {...p} className="my-8 max-w-body border-l border-border-strong pl-5 text-lead text-text-primary" />,
    hr: (p) => <hr {...p} className="my-10 border-border-default" />,
    img: (p) => <img {...p} loading="lazy" className="my-8 h-auto w-full rounded-card border border-border-default" />,
    pre: (p) => <pre {...p} className="my-6 max-w-full overflow-x-auto rounded-code bg-surface-code pad-card font-mono text-body-sm text-text-on-dark" />,
    code: (p) => <code {...p} className="font-mono text-body-sm" />,
    table: (p) => (
      <div className="my-6 max-w-full overflow-x-auto">
        <table {...p} className="w-full text-left text-body-sm text-text-secondary" />
      </div>
    ),
    th: (p) => <th {...p} className="border-b border-border-strong py-2 pr-4 font-medium text-text-primary" />,
    td: (p) => <td {...p} className="border-b border-border-default py-2 pr-4" />,
    Callout,
    ...components,
  };
}
