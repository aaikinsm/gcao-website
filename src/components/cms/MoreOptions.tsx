"use client";

import { Children, isValidElement, useState, type ReactNode, type SyntheticEvent } from "react";
import { CmsIcon } from "@/components/cms/CmsIcons";
import { sidebarRule } from "@/components/cms/SidebarSection";

export function MoreOptions({
  open = false,
  children,
}: {
  open?: boolean;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(open);

  return (
    <details
      open={expanded}
      onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
        setExpanded(event.currentTarget.open);
      }}
      className="group"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-[#0F1B14] [&::-webkit-details-marker]:hidden">
        More options
        <CmsIcon
          name="chevron"
          className="h-4 w-4 text-[#0F1B14]/40 transition-transform group-open:rotate-180"
        />
      </summary>
      {Children.map(children, (child, index) =>
        isValidElement(child) ? (
          <div key={index} className={sidebarRule}>
            {child}
          </div>
        ) : null,
      )}
    </details>
  );
}
