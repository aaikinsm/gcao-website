"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { CmsIcon, type CmsIconName } from "@/components/cms/CmsIcons";
import { RICH_TEXT_EDITOR_CLASS, sanitizeRichText, toEditorHtml } from "@/lib/rich-text";

const boxed =
  `mt-2 min-h-[12rem] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] leading-relaxed outline-none ring-[#006B3F]/30 focus:ring-2 ${RICH_TEXT_EDITOR_CLASS}`;

const plainEditor =
  `mt-3 min-h-[16rem] w-full border-0 bg-transparent px-0 py-2 text-[#0F1B14] leading-relaxed outline-none ${RICH_TEXT_EDITOR_CLASS}`;

export type FormattedFieldHandle = {
  insertText: (text: string) => void;
  previewDictation: (text: string) => void;
  commitDictation: (text: string) => void;
};

interface FormattedFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  plain?: boolean;
}

const marks: { command: string; label: string; icon: CmsIconName }[] = [
  { command: "bold", label: "Bold", icon: "bold" },
  { command: "italic", label: "Italic", icon: "italic" },
  { command: "underline", label: "Underline", icon: "underline" },
];

export const FormattedField = forwardRef<FormattedFieldHandle, FormattedFieldProps>(function FormattedField({
  id,
  name,
  label,
  value,
  onChange,
  plain = false,
}, ref) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<Text | null>(null);
  const onChangeRef = useRef(onChange);
  const lastEmitted = useRef("");
  onChangeRef.current = onChange;
  const html = toEditorHtml(value);
  const [bar, setBar] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (html === lastEmitted.current) return;
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "D", location: "FormattedField.tsx:sync", message: "editor html reset", data: { hadPreview: Boolean(previewRef.current && el.contains(previewRef.current)), htmlLen: html.length, textLen: el.textContent?.length ?? 0 }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    el.innerHTML = html;
    lastEmitted.current = html;
  }, [html]);

  useEffect(() => {
    if (!plain) return;
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
  }, [plain]);

  const emit = (raw: string) => {
    const next = sanitizeRichText(raw);
    lastEmitted.current = next;
    onChange(next);
  };

  const caretIn = (root: HTMLElement) => {
    const selection = document.getSelection();
    const preview = previewRef.current;
    if (
      selection &&
      selection.rangeCount > 0 &&
      root.contains(selection.getRangeAt(0).commonAncestorContainer)
    ) {
      const range = selection.getRangeAt(0);
      if (preview && (range.startContainer === preview || preview.contains(range.startContainer))) {
        const after = document.createRange();
        after.setStartAfter(preview);
        after.collapse(true);
        return after;
      }
      return range;
    }
    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
    return range;
  };

  const placeAfter = (node: Node) => {
    const selection = document.getSelection();
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  useEffect(() => {
    const root = editorRef.current;
    return () => {
      const preview = previewRef.current;
      if (!root || !preview || !root.contains(preview)) return;
      previewRef.current = null;
      const next = sanitizeRichText(root.innerHTML);
      if (next) onChangeRef.current(next);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    previewDictation(text: string) {
      const root = editorRef.current;
      const guess = text.trim();
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "C", location: "FormattedField.tsx:preview", message: "preview dictation", data: { hasRoot: Boolean(root), guessLen: guess.length, hasPreview: Boolean(previewRef.current) }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
      if (!root || !guess) return;
      root.focus();
      let preview = previewRef.current;
      if (!preview || !root.contains(preview)) {
        const range = caretIn(root);
        const probe = range.cloneRange();
        probe.setStart(root, 0);
        const lead = probe.toString().length > 0 && !/\s$/.test(probe.toString()) ? " " : "";
        range.deleteContents();
        preview = document.createTextNode(`${lead}${guess}`);
        range.insertNode(preview);
        previewRef.current = preview;
      } else {
        const lead = preview.textContent?.startsWith(" ") ? " " : "";
        const shown = `${lead}${guess}`;
        if (preview.textContent !== shown) preview.textContent = shown;
      }
      placeAfter(preview);
    },
    commitDictation(text: string) {
      const root = editorRef.current;
      const spoken = text.trim();
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "C", location: "FormattedField.tsx:commit", message: "commit dictation", data: { hasRoot: Boolean(root), spokenLen: spoken.length, hasPreview: Boolean(previewRef.current && root?.contains(previewRef.current)) }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
      if (!root || !spoken) return;
      const withSpace = text.endsWith(" ") ? text : `${spoken} `;
      const preview = previewRef.current;
      if (preview && root.contains(preview)) {
        const lead = preview.textContent?.startsWith(" ") ? " " : "";
        preview.textContent = `${lead}${withSpace.trimStart()}`;
        previewRef.current = null;
        placeAfter(preview);
      } else {
        root.focus();
        const range = caretIn(root);
        range.deleteContents();
        const node = document.createTextNode(withSpace);
        range.insertNode(node);
        placeAfter(node);
      }
      const next = sanitizeRichText(root.innerHTML);
      const editorHtml = toEditorHtml(next);
      lastEmitted.current = editorHtml;
      if (root.innerHTML !== editorHtml) root.innerHTML = editorHtml;
      onChange(next);
      const selection = document.getSelection();
      const end = document.createRange();
      end.selectNodeContents(root);
      end.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(end);
    },
    insertText(text: string) {
      const root = editorRef.current;
      if (!root || !text) return;
      root.focus();
      const selection = document.getSelection();
      let range: Range;
      if (
        selection &&
        selection.rangeCount > 0 &&
        root.contains(selection.getRangeAt(0).commonAncestorContainer)
      ) {
        range = selection.getRangeAt(0);
      } else {
        range = document.createRange();
        range.selectNodeContents(root);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      const inserted = document.execCommand("insertText", false, text);
      if (!inserted) {
        range.deleteContents();
        const node = document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      emit(root.innerHTML);
    },
  }));

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
      {bar ? (
        <div
          className="absolute z-20 flex -translate-x-1/2 items-center rounded-md bg-[#0F1B14] p-1 shadow-[0_12px_30px_rgba(15,27,20,0.28)]"
          style={{ top: bar.top, left: bar.left }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {marks.map((mark) => (
            <ToolbarButton key={mark.command} label={mark.label} onClick={() => run(mark.command)}>
              <CmsIcon name={mark.icon} />
            </ToolbarButton>
          ))}
        </div>
      ) : null}
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
});

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded text-[#EFEDE4] hover:text-white"
    >
      {children}
    </button>
  );
}
