"use client";

import { useMemo, useState } from "react";

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

  return (
    <div>
      {storedUrl ? <input type="hidden" name="image_url" value={storedUrl} /> : null}
      <label className="block cursor-pointer">
        <span className="text-sm font-medium text-[#0F1B14]">Cover image</span>
        <span className="mt-1 block text-xs text-[#0F1B14]/50">JPG, PNG, or WebP · up to 4MB</span>
        <div className="mt-3 overflow-hidden rounded-2xl border border-dashed border-black/15 bg-white">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={existingAlt} className="h-52 w-full object-cover" />
          ) : (
            <div className="flex h-52 items-center justify-center px-6 text-center text-sm text-[#0F1B14]/45">
              Drop a photo here or click to choose
            </div>
          )}
        </div>
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp"
          className="mt-3 block w-full text-sm text-[#0F1B14]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#006B3F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
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
