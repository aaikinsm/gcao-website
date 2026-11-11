"use client";

import { useMemo, useRef, useState } from "react";
import { CmsIcon } from "@/components/cms/CmsIcons";

interface ImagePickerProps {
  name?: string;
  existingUrl?: string;
  existingAlt?: string;
  generatedUrl?: string;
  onGeneratedUrl?: (url: string) => void;
  onGenerate?: () => void;
  generatePending?: boolean;
  generateEnabled?: boolean;
}

export function ImagePicker({
  name = "image",
  existingUrl,
  existingAlt = "Current image",
  generatedUrl,
  onGenerate,
  generatePending = false,
  generateEnabled = false,
}: ImagePickerProps) {
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : generatedUrl || existingUrl),
    [file, generatedUrl, existingUrl],
  );
  const storedUrl = generatedUrl || existingUrl || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      {storedUrl ? <input type="hidden" name="image_url" value={storedUrl} /> : null}
      <p className="text-sm font-medium text-[#0F1B14]">Cover image</p>
      <p className="mt-1 text-xs text-[#0F1B14]/50">JPG, PNG, or WebP · up to 4MB</p>
      <button
        type="button"
        onClick={openPicker}
        className="mt-3 block w-full overflow-hidden rounded-2xl border border-dashed border-black/15 bg-white text-left"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={existingAlt} className="h-52 w-full object-cover" />
        ) : (
          <span className="flex h-52 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-[#0F1B14]/55">
            <CmsIcon name="image" className="h-6 w-6" />
            Choose a cover
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        aria-label="Cover image"
        className="sr-only"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      {preview ? (
        <button
          type="button"
          onClick={openPicker}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#0F1B14] hover:border-[#006B3F]/40"
        >
          <CmsIcon name="image" />
          Replace cover
        </button>
      ) : null}
      {onGenerate ? (
        <button
          type="button"
          onClick={onGenerate}
          disabled={!generateEnabled || generatePending}
          className="mt-3 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#0F1B14] hover:border-[#006B3F]/40 disabled:opacity-50"
        >
          {generatePending ? "Generating…" : "Generate an image"}
        </button>
      ) : null}
    </div>
  );
}
