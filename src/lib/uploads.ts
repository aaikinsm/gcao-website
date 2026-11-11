import { copyFile, mkdir, unlink, writeFile } from "node:fs/promises";
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

export async function saveCmsImageBuffer(
  bytes: Buffer,
  ext: "png" | "jpg" | "webp",
  label = "generated",
) {
  if (bytes.length > MAX_BYTES) {
    throw new Error("Image must be 4MB or smaller.");
  }
  const filename = `${Date.now()}-${slugify(label).slice(0, 40)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/images/uploads/${filename}`;
}

export async function saveCmsDocument(file: File) {
  if (file.size === 0) throw new Error("Choose a file to attach.");
  if (file.size > MAX_BYTES) throw new Error("Each file must be 4MB or smaller.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const imageExt = MIME_TO_EXT[file.type];
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!imageExt && !isPdf) throw new Error("Attach a JPG, PNG, WebP, or PDF.");
  if (isPdf && !bytes.subarray(0, 5).toString("utf8").startsWith("%PDF-")) {
    throw new Error("That PDF could not be read.");
  }

  const ext = imageExt ?? "pdf";
  const original = path.basename(file.name).replace(/\.[^.]+$/, "");
  const filename = `${Date.now()}-${slugify(original).slice(0, 40) || "file"}.${ext}`;
  const folder = ext === "pdf" ? "publications" : "images";
  const dir = path.join(process.cwd(), "public", folder, "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return { url: `/${folder}/uploads/${filename}`, filename: file.name || filename };
}

export function uploadFilePath(url: string) {
  if (!url.startsWith("/images/uploads/") && !url.startsWith("/publications/uploads/")) return null;
  if (url.includes("..") || url.includes("\\")) return null;
  return path.join(process.cwd(), "public", url.replace(/^\/+/, ""));
}

export async function copyUploadedFile(url: string) {
  const source = uploadFilePath(url);
  if (!source) return url;
  const ext = path.extname(source);
  const filename = `${Date.now()}-${path.basename(source, ext).slice(0, 40)}${ext}`;
  try {
    await copyFile(source, path.join(path.dirname(source), filename));
  } catch {
    return url;
  }
  const folder = url.startsWith("/publications/uploads/") ? "publications" : "images";
  return `/${folder}/uploads/${filename}`;
}

export async function deleteUploadedFile(url: string) {
  const target = uploadFilePath(url);
  if (!target) return;
  await unlink(target).catch(() => undefined);
}
