import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";
import { ensurePostExtras } from "@/lib/post-extras";
import { copyUploadedFile, deleteUploadedFile, saveCmsDocument } from "@/lib/uploads";

export type PostType = "news" | "event";

export type PostAttachment = {
  id: number;
  url: string;
  filename: string;
  caption: string;
  sortOrder: number;
};

type AttachmentOrderItem = {
  key: string;
  id?: number;
  caption: string;
};

export function isImageAttachment(url: string) {
  return /\.(jpe?g|png|webp)$/i.test(url.split("?")[0]);
}

export async function listAttachments(postType: PostType, postId: number): Promise<PostAttachment[]> {
  await ensurePostExtras();
  const [rows] = await getPool().query<RowDataPacket[]>(
    `SELECT id, url, filename, caption, sort_order
     FROM post_attachments
     WHERE post_type = ? AND post_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [postType, postId],
  );
  return rows.map((row) => ({
    id: Number(row.id),
    url: String(row.url),
    filename: String(row.filename),
    caption: String(row.caption ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  }));
}

export function parseAttachmentOrder(raw: string): AttachmentOrderItem[] {
  if (!raw.trim()) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Attachments could not be read.");
  }
  if (!Array.isArray(data)) throw new Error("Attachments could not be read.");
  if (data.length > 24) throw new Error("Attach up to 24 files.");
  return data.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Attachments could not be read.");
    const row = item as Record<string, unknown>;
    const key = String(row.key ?? "");
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(key)) throw new Error("Attachments could not be read.");
    const id = row.id == null || row.id === "" ? undefined : Number(row.id);
    if (id !== undefined && !Number.isInteger(id)) throw new Error("Attachments could not be read.");
    return { key, id, caption: String(row.caption ?? "").trim().slice(0, 200) };
  });
}

export async function syncAttachments(
  postType: PostType,
  postId: number,
  order: AttachmentOrderItem[],
  formData: FormData,
) {
  await ensurePostExtras();
  const existing = await listAttachments(postType, postId);
  const kept = new Set<number>();
  const next: { url: string; filename: string; caption: string }[] = [];

  for (const item of order) {
    if (item.id) {
      const row = existing.find((entry) => entry.id === item.id);
      if (!row) continue;
      kept.add(row.id);
      next.push({ url: row.url, filename: row.filename, caption: item.caption });
      continue;
    }
    const file = formData.get(`attachment_file_${item.key}`);
    if (!(file instanceof File) || file.size === 0) continue;
    const saved = await saveCmsDocument(file);
    next.push({ url: saved.url, filename: saved.filename, caption: item.caption });
  }

  const removed = existing.filter((entry) => !kept.has(entry.id));
  await getPool().execute("DELETE FROM post_attachments WHERE post_type = ? AND post_id = ?", [
    postType,
    postId,
  ]);
  for (const [index, row] of next.entries()) {
    await getPool().execute(
      `INSERT INTO post_attachments (post_type, post_id, url, filename, caption, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [postType, postId, row.url, row.filename, row.caption, index],
    );
  }
  for (const row of removed) {
    if (next.some((item) => item.url === row.url)) continue;
    const [still] = await getPool().query<RowDataPacket[]>(
      "SELECT id FROM post_attachments WHERE url = ? LIMIT 1",
      [row.url],
    );
    if (still.length === 0) await deleteUploadedFile(row.url);
  }
}

export async function copyAttachments(postType: PostType, fromId: number, toId: number) {
  const rows = await listAttachments(postType, fromId);
  for (const [index, row] of rows.entries()) {
    const url = await copyUploadedFile(row.url);
    await getPool().execute<ResultSetHeader>(
      `INSERT INTO post_attachments (post_type, post_id, url, filename, caption, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [postType, toId, url, row.filename, row.caption, index],
    );
  }
}

export async function deleteAttachments(postType: PostType, postId: number) {
  const rows = await listAttachments(postType, postId);
  await getPool().execute("DELETE FROM post_attachments WHERE post_type = ? AND post_id = ?", [
    postType,
    postId,
  ]);
  for (const row of rows) {
    const [still] = await getPool().query<RowDataPacket[]>(
      "SELECT id FROM post_attachments WHERE url = ? LIMIT 1",
      [row.url],
    );
    if (still.length === 0) await deleteUploadedFile(row.url);
  }
}
