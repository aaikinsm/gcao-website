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
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
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

type TimedEvent = {
  startsAt: Date;
  endsAt: Date | null;
};

export function isUpcomingEvent(event: TimedEvent, now = Date.now()) {
  const end = event.endsAt ?? event.startsAt;
  return end.getTime() >= now;
}

export function splitEvents<T extends TimedEvent>(events: T[]) {
  const upcoming = events
    .filter((event) => isUpcomingEvent(event))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  const past = events.filter((event) => !isUpcomingEvent(event));
  return { upcoming, past };
}

export type UpcomingEventSlide = {
  slug: string;
  title: string;
  excerpt: string;
  location: string;
  imageUrl: string;
  dateLabel: string;
};

type SlideSource = TimedEvent & {
  featured: boolean;
  slug: string;
  title: string;
  excerpt: string;
  location: string;
  imageUrl: string;
};

export function toUpcomingSlides(events: SlideSource[]): UpcomingEventSlide[] {
  const upcoming = splitEvents(events).upcoming.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.startsAt.getTime() - b.startsAt.getTime();
  });
  return upcoming.map((event) => ({
    slug: event.slug,
    title: event.title,
    excerpt: event.excerpt,
    location: event.location,
    imageUrl: event.imageUrl,
    dateLabel: formatEventDateRange(event.startsAt, event.endsAt),
  }));
}
