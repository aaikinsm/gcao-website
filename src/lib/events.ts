import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getPool } from "@/lib/db";
import { slugify } from "@/lib/slug";

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
  status: "draft" | "published";
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
  status: "draft" | "published";
};

const TORONTO = "America/Toronto";

const dayFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TORONTO,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TORONTO,
  hour: "numeric",
  minute: "2-digit",
});

function asDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
    status: row.status,
  };
}

function torontoDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isMidnightToronto(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour === 0 && minute === 0;
}

export function formatEventDateRange(startsAt: Date, endsAt: Date | null) {
  const startDay = dayFmt.format(startsAt);
  if (!endsAt) return startDay;

  if (torontoDayKey(startsAt) === torontoDayKey(endsAt)) {
    if (isMidnightToronto(startsAt) && isMidnightToronto(endsAt)) return startDay;
    return `${startDay} · ${timeFmt.format(startsAt)}–${timeFmt.format(endsAt)}`;
  }

  return `${startDay} – ${dayFmt.format(endsAt)}`;
}

export function isUpcomingEvent(event: GcaoEvent, now = Date.now()) {
  const end = event.endsAt ?? event.startsAt;
  return end.getTime() >= now;
}

export function splitEvents(events: GcaoEvent[]) {
  const upcoming = events
    .filter((event) => isUpcomingEvent(event))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const past = events.filter((event) => !isUpcomingEvent(event));
  return { upcoming, past };
}

export async function getPublishedEvents(): Promise<GcaoEvent[]> {
  try {
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT id, title, slug, starts_at, ends_at, location, excerpt, body, image_url, status
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
      `SELECT id, title, slug, starts_at, ends_at, location, excerpt, body, image_url, status
       FROM events
       WHERE status = 'published' AND slug = ?
       LIMIT 1`,
      [slug],
    );
    const row = rows[0];
    return row ? mapEvent(row) : null;
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
  status: "draft" | "published";
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
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT id, title, slug, starts_at, ends_at, location, excerpt, body, image_url, status
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
    const [rows] = await getPool().query<EventRow[]>(
      `SELECT id, title, slug, starts_at, ends_at, location, excerpt, body, image_url, status
       FROM events WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ? mapEvent(rows[0]) : null;
  } catch (error) {
    console.error("Failed to load event", id, error);
    return null;
  }
}

export async function createEvent(input: EventInput) {
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO events (title, slug, starts_at, ends_at, location, excerpt, body, image_url, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ],
  );
  return result.insertId;
}

export async function updateEvent(id: number, input: EventInput) {
  await getPool().execute(
    `UPDATE events
     SET title = ?, slug = ?, starts_at = ?, ends_at = ?, location = ?, excerpt = ?, body = ?, image_url = ?, status = ?
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
      id,
    ],
  );
}

export async function deleteEvent(id: number) {
  await getPool().execute("DELETE FROM events WHERE id = ?", [id]);
}
