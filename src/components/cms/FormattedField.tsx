"use client";

import { useEffect, useRef } from "react";
import { RICH_TEXT_EDITOR_CLASS, sanitizeRichText, toEditorHtml } from "@/lib/rich-text";

const editor =
  `mt-2 min-h-[12rem] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] leading-relaxed outline-none ring-[#006B3F]/30 focus:ring-2 ${RICH_TEXT_EDITOR_CLASS}`;

interface FormattedFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function FormattedField({
  id,
  name,
  label,
  value,
  onChange,
}: FormattedFieldProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef("");
  const html = toEditorHtml(value);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (html === lastEmitted.current) return;
    el.innerHTML = html;
    lastEmitted.current = html;
  }, [html]);

  const emit = (raw: string) => {
    const next = sanitizeRichText(raw);
    lastEmitted.current = next;
    onChange(next);
  };

  const run = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    emit(editorRef.current?.innerHTML ?? "");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium text-[#0F1B14]" htmlFor={id}>
          {label}
        </label>
        <div className="flex flex-wrap gap-2">
          <ToolbarButton label="Bold" onClick={() => run("bold")} />
          <ToolbarButton label="Italic" onClick={() => run("italic")} />
          <ToolbarButton label="Underline" onClick={() => run("underline")} />
          <ToolbarButton label="Bullet" onClick={() => run("insertUnorderedList")} />
        </div>
      </div>
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline
        aria-label={label}
        contentEditable
        suppressContentEditableWarning
        className={editor}
        onInput={() => emit(editorRef.current?.innerHTML ?? "")}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold hover:border-[#006B3F]/40"
    >
      {label}
    </button>
  );
}
