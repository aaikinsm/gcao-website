"use client";

import { useMemo, useState } from "react";

interface ImagePickerProps {
  name?: string;
  existingUrl?: string;
  existingAlt?: string;
}

export function ImagePicker({
  name = "image",
  existingUrl,
  existingAlt = "Current image",
}: ImagePickerProps) {
  const [file, setFile] = useState<File | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : existingUrl), [file, existingUrl]);

  return (
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
  );
}
