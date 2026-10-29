import type { ReactNode } from "react";

/* tag (mono, UPPERCASE) and status badge. Status colors are for state only, never decoration or categories. */
export function Tag({ children, brand = false, dark = false, small = false }: { children: ReactNode; brand?: boolean; dark?: boolean; small?: boolean }) {
  return <span className={`tag ${brand ? "tag-brand" : ""} ${dark ? "tag-on-dark" : ""} ${small ? "tag-sm" : ""}`}>{children}</span>;
}

const status = { success: "badge-success", warning: "badge-warning", error: "badge-error", info: "badge-info", neutral: "badge-neutral" } as const;

export function StatusBadge({ state = "neutral", children }: { state?: keyof typeof status; children: ReactNode }) {
  return <span className={`status-badge ${status[state]}`}>{children}</span>;
}
