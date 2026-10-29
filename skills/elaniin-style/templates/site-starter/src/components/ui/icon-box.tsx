import type { ReactNode } from "react";

/* icon-box: 40px square for an icon (24px grid, 1.5px stroke, currentColor). `dark` for dark surfaces. */
export function IconBox({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`icon-box ${dark ? "icon-box-dark" : ""} ${className}`}>
      {children}
    </span>
  );
}
