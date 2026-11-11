import type { ReactNode } from "react";

export const sidebarRule =
  "relative w-full py-5 before:absolute before:top-0 before:left-4 before:right-4 before:border-t before:border-black/10";

export function SidebarSection({ children }: { children: ReactNode }) {
  return <div className={`${sidebarRule} first:before:hidden`}>{children}</div>;
}
