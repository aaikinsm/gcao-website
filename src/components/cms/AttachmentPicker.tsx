"use client";

import { useEffect, useRef, useState } from "react";
import type { PostAttachment } from "@/lib/attachments";
import { CmsIcon } from "@/components/cms/CmsIcons";

type DraftAttachment = {
  key: string;
  id?: number;
  url: string;
  filename: string;
  caption: string;
  file?: File;
};

function isImage(name: string) {
  return /\.(jpe?g|png|webp)$/i.test(name);
}

function FileSlot({ fileName, file }: { fileName: string; file?: File }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current || !file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    ref.current.files = transfer.files;
  }, [file]);
  return <input ref={ref} type="file" name={fileName} className="hidden" />;
}

export function AttachmentPicker({ initial = [] }: { initial?: PostAttachment[] }) {
  const [items, setItems] = useState<DraftAttachment[]>(() =>
    initial.map((item) => ({
      key: `e${item.id}`,
      id: item.id,
      url: item.url,
      filename: item.filename,
      caption: item.caption,
    })),
  );

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const added: DraftAttachment[] = Array.from(list).map((file) => ({
      key: `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      caption: "",
      file,
    }));
    setItems((current) => [...current, ...added].slice(0, 24));
  };

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = index + direction;
      if (next < 0 || next >= current.length) return current;
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  };

  const order = JSON.stringify(
    items.map((item) => ({
      key: item.key,
      id: item.id,
      caption: item.caption,
    })),
  );

  return (
    <div>
      <input type="hidden" name="attachment_order" value={order} />
      <p className="inline-flex items-center gap-2 text-sm font-medium text-[#0F1B14]">
        <CmsIcon name="paperclip" className="h-4 w-4 opacity-70" />
        Attachments
      </p>
      <p className="mt-1 text-xs text-[#0F1B14]/50">JPG, PNG, WebP, or PDF · up to 4MB each</p>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {items.map((item, index) => (
            <li key={item.key} className="rounded-2xl border border-black/10 p-3">
              {item.file ? <FileSlot fileName={`attachment_file_${item.key}`} file={item.file} /> : null}
              <div className="flex items-center gap-3">
                {isImage(item.filename) || isImage(item.url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-14 w-20 rounded-xl object-cover" />
                ) : (
                  <span className="flex h-14 w-20 items-center justify-center rounded-xl bg-[#006B3F]/10 text-xs font-semibold text-[#006B3F]">
                    PDF
                  </span>
                )}
                <p className="min-w-0 flex-1 truncate text-sm text-[#0F1B14]/70">{item.filename}</p>
              </div>
              <input
                value={item.caption}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.key === item.key ? { ...entry, caption: event.target.value } : entry,
                    ),
                  )
                }
                placeholder="Caption"
                className="mt-3 w-full border-0 border-b border-black/10 bg-transparent px-0 py-2 text-sm outline-none focus:border-[#006B3F]"
              />
              <div className="mt-2 flex gap-3 text-sm font-semibold text-[#006B3F]">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                >
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((entry) => entry.key !== item.key))}
                  className="text-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <label className="mt-3 block cursor-pointer text-sm font-semibold text-[#006B3F]">
        Add files
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
          multiple
          className="mt-2 block w-full text-sm font-normal text-[#0F1B14]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#006B3F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
