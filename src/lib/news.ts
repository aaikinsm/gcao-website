import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { copyAttachments, deleteAttachments, listAttachments } from "@/lib/attachments";
import { getPool } from "@/lib/db";
import { slugify, formDateTimeToMysql, toDatetimeLocalValue } from "@/lib/slug";
import { parseNewsKind, type GcaoNews, type NewsKind } from "@/lib/news-types";
import { ensurePostExtras } from "@/lib/post-extras";
import { parseBodyMode, type BodyMode } from "@/lib/post-fields";
import { ensureAuthorColumns, ensurePendingStatus, parsePostStatus, type PostStatus } from "@/lib/post-status";

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
  status: PostStatus;
  authorName?: string | null;
  bodyMode: BodyMode;
  youtubeId: string | null;
  featured: boolean;
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
  status: string;
  author_name?: string | null;
  body_mode?: string | null;
  youtube_id?: string | null;
  featured?: number | null;
};

const NEWS_SELECT = `id, title, slug, kind, category, excerpt, body, image_url, published_at, status, author_name, body_mode, youtube_id, featured`;

let kindColumnReady = false;

export async function ensureNewsKindColumn() {
  if (kindColumnReady) return;
  const [rows] = await getPool().query<RowDataPacket[]>("SHOW COLUMNS FROM news LIKE 'kind'");
  if (rows.length === 0) {
    await getPool().query(
      "ALTER TABLE news ADD COLUMN kind VARCHAR(20) NOT NULL DEFAULT 'news'",
    );
  }
  await getPool().query("UPDATE news SET kind = 'news' WHERE kind IN ('notice', 'story')");
  await ensureAuthorColumns();
  await ensurePostExtras();
  await ensurePublicationPosts();
  kindColumnReady = true;
}

const PUBLICATION_POSTS = [
  {
    title: "GCAO Elections 2025",
    slug: "gcao-elections-2025",
    excerpt: "Click to Download document.",
    file: "PRESS-RELEASE-.pdf",
    publishedAt: "2025-09-01 12:00:00",
  },
  {
    title: "Ghanaian-Canadian Association of Ontario Seniors Report",
    slug: "gcao-seniors-report",
    excerpt: "Funding provided by the Government of Ontario.",
    file: "2026-GCAO-Seniors-Grant-Report.pdf",
    publishedAt: "2026-06-01 12:00:00",
  },
  {
    title: "Retreat Recap",
    slug: "retreat-recap",
    excerpt: "Click to read or download : Building Mental Health Resilience in Black, African & Caribbean.",
    file: "2025-MHFA-August-Retreat.pdf",
    publishedAt: "2025-08-01 12:00:00",
  },
  {
    title: "GCAO 2024 Annual Report",
    slug: "gcao-2024-annual-report",
    excerpt: "Click to read or download GCAO 2024 Annual Report.",
    file: "2024-Annual-Report.pdf",
    publishedAt: "2025-07-01 12:00:00",
  },
  {
    title: "GCAO 2023 Annual Report",
    slug: "gcao-2023-annual-report",
    excerpt: "Click to read or download GCAO 2023 Annual Report.",
    file: "2023-GCAO-Annual-Report.pdf",
    publishedAt: "2024-02-01 12:00:00",
  },
  {
    title: "Fall/Spring 2023 Newsletter",
    slug: "fall-spring-2023-newsletter",
    excerpt: "Click to read or download Fall/Spring 2023 community newsletter.",
    file: "FALL.SPRING-2023.pdf",
    publishedAt: "2023-04-01 12:00:00",
  },
  {
    title: "Spring 2022 Newsletter",
    slug: "spring-2022-newsletter",
    excerpt: "Click to read or download Spring 2022 report.",
    file: "gcao-newsletter-SPRING-22.pdf",
    publishedAt: "2022-07-01 12:00:00",
  },
  {
    title: "Spring 2021 Newsletter",
    slug: "spring-2021-newsletter",
    excerpt: "Click to read or download Spring 2021 report.",
    file: "gcao-newsletter-SPRING-21.pdf",
    publishedAt: "2021-07-01 12:00:00",
  },
  {
    title: "GCAO 2020 Annual Report",
    slug: "gcao-2020-annual-report",
    excerpt: "Click to read or download annual report.",
    file: "2021-GCAO-Annual-Report.pdf",
    publishedAt: "2021-07-01 12:00:00",
  },
] as const;

async function ensurePublicationPosts() {
  for (const post of PUBLICATION_POSTS) {
    const [existing] = await getPool().query<RowDataPacket[]>(
      "SELECT id FROM news WHERE slug = ? LIMIT 1",
      [post.slug],
    );
    if (existing.length > 0) continue;
    const href = `/publications/${post.file}`;
    const line = post.excerpt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const body = `<p>${line}</p><p><a href="${href}">Read or download</a></p>`;
    await getPool().execute(
      `INSERT INTO news (title, slug, kind, category, excerpt, body, image_url, published_at, status, author_name)
       VALUES (?, ?, 'publication', '', ?, ?, '', ?, 'published', NULL)`,
      [post.title, post.slug, post.excerpt, body, post.publishedAt],
    );
  }
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
    status: parsePostStatus(row.status),
    authorName: row.author_name?.trim() || null,
    bodyMode: parseBodyMode(row.body_mode),
    youtubeId: row.youtube_id?.trim() || null,
    featured: Number(row.featured) === 1,
    attachments: [],
  };
}

async function withAttachments(article: GcaoNews | null) {
  if (!article) return null;
  article.attachments = await listAttachments("news", article.id);
  return article;
}

export function selectHomeNews(articles: GcaoNews[]) {
  const featured = articles.find((article) => article.featured);
  const rest = articles.filter((article) => article !== featured);
  return [featured, ...rest].filter((article): article is GcaoNews => Boolean(article)).slice(0, 3);
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
    await ensureAuthorColumns();
    await ensurePendingStatus();
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
    await ensureAuthorColumns();
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
    await ensureAuthorColumns();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT} FROM news WHERE id = ? LIMIT 1`,
      [id],
    );
    return await withAttachments(rows[0] ? mapNews(rows[0]) : null);
  } catch (error) {
    console.error("Failed to load news", id, error);
    return null;
  }
}

export async function getNewsBySlug(slug: string): Promise<GcaoNews | null> {
  try {
    await ensureNewsKindColumn();
    await ensureAuthorColumns();
    const [rows] = await getPool().query<NewsRow[]>(
      `SELECT ${NEWS_SELECT} FROM news WHERE slug = ? AND status = 'published' LIMIT 1`,
      [slug],
    );
    return await withAttachments(rows[0] ? mapNews(rows[0]) : null);
  } catch (error) {
    console.error("Failed to load news", slug, error);
    return null;
  }
}

export async function createNews(input: NewsInput) {
  await ensureNewsKindColumn();
  await ensureAuthorColumns();
  await ensurePendingStatus();
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO news (title, slug, kind, category, excerpt, body, image_url, published_at, status, author_name, body_mode, youtube_id, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      input.authorName?.trim() || null,
      input.bodyMode,
      input.youtubeId,
      input.featured ? 1 : 0,
    ],
  );
  return result.insertId;
}

export async function updateNews(id: number, input: NewsInput) {
  await ensureNewsKindColumn();
  await ensureAuthorColumns();
  await ensurePendingStatus();
  await getPool().execute(
    `UPDATE news
     SET title = ?, slug = ?, kind = ?, category = ?, excerpt = ?, body = ?, image_url = ?, published_at = ?, status = ?, body_mode = ?, youtube_id = ?, featured = ?
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
      input.bodyMode,
      input.youtubeId,
      input.featured ? 1 : 0,
      id,
    ],
  );
}

export async function deleteNews(id: number) {
  await deleteAttachments("news", id);
  await getPool().execute("DELETE FROM news WHERE id = ?", [id]);
}

export async function clearNewsFeatured(exceptId?: number) {
  await ensurePostExtras();
  if (exceptId) {
    await getPool().execute("UPDATE news SET featured = 0 WHERE featured = 1 AND id <> ?", [exceptId]);
    return;
  }
  await getPool().execute("UPDATE news SET featured = 0 WHERE featured = 1");
}

export async function duplicateNewsRecord(id: number, authorName: string | null) {
  const article = await getNewsById(id);
  if (!article) return null;
  const title = `Copy of ${article.title}`.slice(0, 200);
  const publishedAt = formDateTimeToMysql(toDatetimeLocalValue(article.publishedAt));
  if (!publishedAt) return null;
  const newId = await createNews({
    title,
    slug: await uniqueNewsSlug(title),
    kind: article.kind,
    category: article.category,
    excerpt: article.excerpt,
    body: article.body,
    imageUrl: article.imageUrl,
    publishedAt,
    status: "draft",
    authorName,
    bodyMode: article.bodyMode,
    youtubeId: article.youtubeId,
    featured: false,
  });
  await copyAttachments("news", article.id, newId);
  return newId;
}
