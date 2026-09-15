import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "@/lib/slug";

const MAX_BYTES = 4 * 1024 * 1024;
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveCmsImage(file: File | null, existingUrl?: string) {
  if (!file || file.size === 0) {
    return existingUrl ?? "";
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 4MB or smaller.");
  }

  const ext = MIME_TO_EXT[file.type];
  if (!ext) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  const original = path.basename(file.name).replace(/\.[^.]+$/, "");
  const safe = slugify(original).slice(0, 40);
  const filename = `${Date.now()}-${safe}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, filename);
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return `/images/uploads/${filename}`;
}
