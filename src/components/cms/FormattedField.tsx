"use client";

import { useEffect, useRef, useState } from "react";
import { RICH_TEXT_EDITOR_CLASS, sanitizeRichText, toEditorHtml } from "@/lib/rich-text";

const boxed =
  `mt-2 min-h-[12rem] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] leading-relaxed outline-none ring-[#006B3F]/30 focus:ring-2 ${RICH_TEXT_EDITOR_CLASS}`;

const plainEditor =
  `mt-8 min-h-[16rem] w-full border-0 bg-transparent px-0 py-2 text-[#0F1B14] leading-relaxed outline-none ${RICH_TEXT_EDITOR_CLASS}`;

interface FormattedFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  plain?: boolean;
}

export function FormattedField({
  id,
  name,
  label,
  value,
  onChange,
  plain = false,
}: FormattedFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef("");
  const html = toEditorHtml(value);
  const [bar, setBar] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (html === lastEmitted.current) return;
    el.innerHTML = html;
    lastEmitted.current = html;
  }, [html]);

  useEffect(() => {
    const place = () => {
      const root = editorRef.current;
      const wrap = wrapRef.current;
      const selection = document.getSelection();
      if (!root || !wrap || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setBar(null);
        return;
      }
      const range = selection.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) {
        setBar(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) {
        setBar(null);
        return;
      }
      const parent = wrap.getBoundingClientRect();
      const top = rect.top - parent.top;
      setBar({
        top: top > 48 ? top - 44 : top + rect.height + 8,
        left: rect.left - parent.left + rect.width / 2,
      });
    };

    document.addEventListener("selectionchange", place);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("selectionchange", place);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, []);

  const emit = (raw: string) => {
    const next = sanitizeRichText(raw);
    lastEmitted.current = next;
    onChange(next);
  };

  const run = (command: string) => {
    const root = editorRef.current;
    if (!root) return;
    const selection = document.getSelection();
    const saved =
      selection && selection.rangeCount > 0 && root.contains(selection.getRangeAt(0).commonAncestorContainer)
        ? selection.getRangeAt(0).cloneRange()
        : null;
    root.focus();
    if (saved && selection) {
      selection.removeAllRanges();
      selection.addRange(saved);
    }
    document.execCommand(command, false);
    emit(root.innerHTML);
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      {bar && (
        <div
          className="absolute z-20 flex -translate-x-1/2 items-center rounded-md bg-[#0F1B14] p-1 shadow-[0_12px_30px_rgba(15,27,20,0.28)]"
          style={{ top: bar.top, left: bar.left }}
          onMouseDown={(event) => event.preventDefault()}
        >
          <FormatMark label="Bold" onClick={() => run("bold")} className="font-semibold">
            B
          </FormatMark>
          <FormatMark label="Italic" onClick={() => run("italic")} className="italic">
            I
          </FormatMark>
          <FormatMark label="Underline" onClick={() => run("underline")} className="underline">
            U
          </FormatMark>
        </div>
      )}
      <div
        ref={editorRef}
        id={id}
        role="textbox"
        aria-multiline
        aria-label={label}
        contentEditable
        suppressContentEditableWarning
        className={plain ? plainEditor : boxed}
        onInput={() => emit(editorRef.current?.innerHTML ?? "")}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function FormatMark({
  label,
  onClick,
  className = "",
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center text-sm text-[#EFEDE4] hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}
