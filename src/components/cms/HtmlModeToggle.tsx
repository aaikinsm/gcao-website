"use client";

import { CmsIcon } from "@/components/cms/CmsIcons";

export function HtmlModeToggle({
  html,
  onChange,
}: {
  html: boolean;
  onChange: (html: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={html}
      onClick={() => onChange(!html)}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#0F1B14]"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${html ? "bg-[#006B3F]" : "bg-black/15"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${html ? "translate-x-5" : ""}`}
        />
      </span>
      <CmsIcon name={html ? "code" : "pencil"} />
      {html ? "Custom HTML" : "Write"}
    </button>
  );
}
