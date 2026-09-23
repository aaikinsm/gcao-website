import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { parseNewsKind, type GcaoNews, type NewsKind } from "@/lib/news-types";

export type { GcaoNews, NewsKind } from "@/lib/news-types";
export { NEWS_KINDS, newsKindLabel, parseNewsKind } from "@/lib/news-types";

export type NewsInput = {
  title: string;
  slug: string;
  kind: NewsKind;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  publishedAt: string;
  status: "draft" | "published";
};

type NewsRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  kind?: string;
  category: string;
  excerpt: string;
  body: string;
  image_url: string;
  published_at: Date | string;
  status: "draft" | "published";
};

const NEWS_SELECT = `id, title, slug, kind, category, excerpt, body, image_url, published_at, status`;

let kindColumnReady = false;

export async function ensureNewsKindColumn() {
  if (kindColumnReady) return;
  const [rows] = await getPool().query<RowDataPacket[]>("SHOW COLUMNS FROM news LIKE 'kind'");
  if (rows.length === 0) {
    await getPool().query(
      "ALTER TABLE news ADD COLUMN kind VARCHAR(20) NOT NULL DEFAULT 'news'",
    );
  }
  kindColumnReady = true;
}

function asDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function mapNews(row: NewsRow): GcaoNews | null {
  const publishedAt = asDate(row.published_at);
  if (!publishedAt) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    kind: parseNewsKind(row.kind),
    category: row.category,
    excerpt: row.excerpt,
    body: row.body,
    imageUrl: row.image_url,
    publishedAt,
    status: row.status,
  };
}

export async function uniqueNewsSlug(base: string, excludeId?: number) {
  let slug = slugify(base);
  let n = 2;
  while (await newsSlugTaken(slug, excludeId)) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
}

async function newsSlugTaken(slug: string, excludeId?: number) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    excludeId
      ? "SELECT id FROM news WHERE slug = ? AND id <> ? LIMIT 1"
      : "SELECT id FROM news WHERE slug = ? LIMIT 1",
    excludeId ? [slug, excludeId] : [slug],
  );
  return rows.length > 0;
}

export async function getAllNews(): Promise<GcaoNews[]> {
  try {
    await ensureNewsKindColumn();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT}
       FROM news
       ORDER BY published_at DESC`,
    );
    return rows.map(mapNews).filter((item): item is GcaoNews => item !== null);
  } catch (error) {
    console.error("Failed to load news", error);
    return [];
  }
}

export async function getPublishedNews(): Promise<GcaoNews[]> {
  try {
    await ensureNewsKindColumn();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT}
       FROM news
       WHERE status = 'published'
       ORDER BY published_at DESC`,
    );
    return rows.map(mapNews).filter((item): item is GcaoNews => item !== null);
  } catch (error) {
    console.error("Failed to load published news", error);
    return [];
  }
}

export async function getNewsById(id: number): Promise<GcaoNews | null> {
  try {
    await ensureNewsKindColumn();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT} FROM news WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ? mapNews(rows[0]) : null;
  } catch (error) {
    console.error("Failed to load news", id, error);
    return null;
  }
}

export async function getNewsBySlug(slug: string): Promise<GcaoNews | null> {
  try {
    await ensureNewsKindColumn();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT} FROM news WHERE slug = ? AND status = 'published' LIMIT 1`,
      [slug],
    );
    return rows[0] ? mapNews(rows[0]) : null;
  } catch (error) {
    console.error("Failed to load news", slug, error);
    return null;
  }
}

export async function createNews(input: NewsInput) {
  await ensureNewsKindColumn();
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO news (title, slug, kind, category, excerpt, body, image_url, published_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.slug,
      input.kind,
      input.category,
      input.excerpt,
      input.body,
      input.imageUrl,
      input.publishedAt,
      input.status,
    ],
  );
  return result.insertId;
}

export async function updateNews(id: number, input: NewsInput) {
  await ensureNewsKindColumn();
  await getPool().execute(
    `UPDATE news
     SET title = ?, slug = ?, kind = ?, category = ?, excerpt = ?, body = ?, image_url = ?, published_at = ?, status = ?
     WHERE id = ?`,
    [
      input.title,
      input.slug,
      input.kind,
      input.category,
      input.excerpt,
      input.body,
      input.imageUrl,
      input.publishedAt,
      input.status,
      id,
    ],
  );
}

export async function deleteNews(id: number) {
  await getPool().execute("DELETE FROM news WHERE id = ?", [id]);
}
