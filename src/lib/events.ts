import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { copyAttachments, deleteAttachments, listAttachments, type PostAttachment } from "@/lib/attachments";
import { getPool } from "@/lib/db";
import { ensurePostExtras } from "@/lib/post-extras";
import { parseBodyMode, type BodyMode } from "@/lib/post-fields";
import { ensureAuthorColumns, ensurePendingStatus, parsePostStatus, type PostStatus } from "@/lib/post-status";
import { formDateTimeToMysql, slugify, toDatetimeLocalValue } from "@/lib/slug";
import { torontoWallTime } from "@/lib/toronto-time";

export {
  formatEventDateRange,
  isUpcomingEvent,
  splitEvents,
  toUpcomingSlides,
  type UpcomingEventSlide,
} from "@/lib/event-display";

export type GcaoEvent = {
  id: number;
  title: string;
  slug: string;
  startsAt: Date;
  endsAt: Date | null;
  location: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  status: PostStatus;
  authorName: string | null;
  authorId: string | null;
  bodyMode: BodyMode;
  youtubeId: string | null;
  featured: boolean;
  attachments: PostAttachment[];
};

type EventRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  starts_at: Date | string;
  ends_at: Date | string | null;
  location: string;
  excerpt: string;
  body: string;
  image_url: string;
  status: string;
  author_name?: string | null;
  author_id?: string | null;
  body_mode?: string | null;
  youtube_id?: string | null;
  featured?: number | null;
};

const EVENT_SELECT = `id, title, slug, starts_at, ends_at, location, excerpt, body, image_url, status, author_name, author_id, body_mode, youtube_id, featured`;

async function ready() {
  await ensurePendingStatus();
  await ensureAuthorColumns();
  await ensurePostExtras();
}

function asDate(value: Date | string | null | undefined): Date | null {
  return torontoWallTime(value);
}

function mapEvent(row: EventRow): GcaoEvent | null {
  const startsAt = asDate(row.starts_at);
  if (!startsAt) return null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    startsAt,
    endsAt: asDate(row.ends_at),
    location: row.location,
    excerpt: row.excerpt,
    body: row.body,
    imageUrl: row.image_url,
    status: parsePostStatus(row.status),
    authorName: row.author_name?.trim() || null,
    authorId: row.author_id?.trim() || null,
    bodyMode: parseBodyMode(row.body_mode),
    youtubeId: row.youtube_id?.trim() || null,
    featured: Number(row.featured) === 1,
    attachments: [],
  };
}

async function withAttachments(event: GcaoEvent | null) {
  if (!event) return null;
  event.attachments = await listAttachments("event", event.id);
  return event;
}

export async function getPublishedEvents(): Promise<GcaoEvent[]> {
  try {
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT ${EVENT_SELECT}
       FROM events
       WHERE status = 'published'
       ORDER BY starts_at DESC`,
    );
    return rows.map(mapEvent).filter((event): event is GcaoEvent => event !== null);
  } catch (error) {
    console.error("Failed to load published events", error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<GcaoEvent | null> {
  try {
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT ${EVENT_SELECT}
       FROM events
       WHERE status = 'published' AND slug = ?
       LIMIT 1`,
      [slug],
    );
    const row = rows[0];
    return await withAttachments(row ? mapEvent(row) : null);
  } catch (error) {
    console.error("Failed to load event", slug, error);
    return null;
  }
}

export type EventInput = {
  title: string;
  slug: string;
  startsAt: string;
  endsAt: string | null;
  location: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  status: PostStatus;
  authorName?: string | null;
  authorId?: string | null;
  bodyMode: BodyMode;
  youtubeId: string | null;
  featured: boolean;
};

export async function uniqueEventSlug(base: string, excludeId?: number) {
  let slug = slugify(base);
  let n = 2;
  while (await eventSlugTaken(slug, excludeId)) {
    slug = `${slugify(base)}-${n}`;
    n += 1;
  }
  return slug;
}

async function eventSlugTaken(slug: string, excludeId?: number) {
  const [rows] = await getPool().query<RowDataPacket[]>(
    excludeId
      ? "SELECT id FROM events WHERE slug = ? AND id <> ? LIMIT 1"
      : "SELECT id FROM events WHERE slug = ? LIMIT 1",
    excludeId ? [slug, excludeId] : [slug],
  );
  return rows.length > 0;
}

export async function getAllEvents(): Promise<GcaoEvent[]> {
  try {
    await ready();
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT ${EVENT_SELECT}
       FROM events
       ORDER BY starts_at DESC`,
    );
    return rows.map(mapEvent).filter((event): event is GcaoEvent => event !== null);
  } catch (error) {
    console.error("Failed to load events", error);
    return [];
  }
}

export async function getEventById(id: number): Promise<GcaoEvent | null> {
  try {
    await ready();
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT ${EVENT_SELECT}
       FROM events WHERE id = ? LIMIT 1`,
      [id],
    );
    return await withAttachments(rows[0] ? mapEvent(rows[0]) : null);
  } catch (error) {
    console.error("Failed to load event", id, error);
    return null;
  }
}

export async function createEvent(input: EventInput) {
  await ready();
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO events (title, slug, starts_at, ends_at, location, excerpt, body, image_url, status, author_name, author_id, body_mode, youtube_id, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.slug,
      input.startsAt,
      input.endsAt,
      input.location,
      input.excerpt,
      input.body,
      input.imageUrl,
      input.status,
      input.authorName?.trim() || null,
      input.authorId?.trim() || null,
      input.bodyMode,
      input.youtubeId,
      input.featured ? 1 : 0,
    ],
  );
  return result.insertId;
}

export async function updateEvent(id: number, input: EventInput) {
  await ready();
  await getPool().execute(
    `UPDATE events
     SET title = ?, slug = ?, starts_at = ?, ends_at = ?, location = ?, excerpt = ?, body = ?, image_url = ?, status = ?, body_mode = ?, youtube_id = ?, featured = ?
     WHERE id = ?`,
    [
      input.title,
      input.slug,
      input.startsAt,
      input.endsAt,
      input.location,
      input.excerpt,
      input.body,
      input.imageUrl,
      input.status,
      input.bodyMode,
      input.youtubeId,
      input.featured ? 1 : 0,
      id,
    ],
  );
}

export async function deleteEvent(id: number) {
  await deleteAttachments("event", id);
  await getPool().execute("DELETE FROM events WHERE id = ?", [id]);
}

export async function clearEventFeatured(exceptId?: number) {
  await ensurePostExtras();
  if (exceptId) {
    await getPool().execute("UPDATE events SET featured = 0 WHERE featured = 1 AND id <> ?", [exceptId]);
    return;
  }
  await getPool().execute("UPDATE events SET featured = 0 WHERE featured = 1");
}

export async function duplicateEventRecord(id: number, authorName: string | null, authorId: string) {
  const event = await getEventById(id);
  if (!event) return null;
  const title = `Copy of ${event.title}`.slice(0, 200);
  const startsAt = formDateTimeToMysql(toDatetimeLocalValue(event.startsAt));
  if (!startsAt) return null;
  const endsAt = event.endsAt ? formDateTimeToMysql(toDatetimeLocalValue(event.endsAt)) : null;
  const newId = await createEvent({
    title,
    slug: await uniqueEventSlug(title),
    startsAt,
    endsAt,
    location: event.location,
    excerpt: event.excerpt,
    body: event.body,
    imageUrl: event.imageUrl,
    status: "draft",
    authorName,
    authorId,
    bodyMode: event.bodyMode,
    youtubeId: event.youtubeId,
    featured: false,
  });
  await copyAttachments("event", event.id, newId);
  return newId;
}
