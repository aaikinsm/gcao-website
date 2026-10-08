import type { Metadata } from "next";
import { headers } from "next/headers";
import type { GcaoEvent } from "@/lib/events";
import type { GcaoNews } from "@/lib/news-types";

export const DARK_NEWS = "/preview/sankofa/news";
export const DARK_EVENTS = "/preview/sankofa/events";

const PUBLISHER = "Ghanaian-Canadian Association of Ontario";

export async function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export function newsPath(slug: string) {
  return `${DARK_NEWS}/${slug}`;
}

export function eventPath(slug: string) {
  return `${DARK_EVENTS}/${slug}`;
}

export function absoluteUrl(origin: string, path: string) {
  return new URL(path, origin).toString();
}

export function absoluteImage(origin: string, imageUrl: string) {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return absoluteUrl(origin, imageUrl);
}

export function postMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type: "article" | "website";
}): Metadata {
  const title = `${input.title} · GCAO`;
  const images = input.image ? [input.image] : undefined;
  return {
    title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title,
      description: input.description,
      url: input.path,
      type: input.type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images,
    },
  };
}

export function newsJsonLd(article: GcaoNews, pageUrl: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image,
    datePublished: article.publishedAt.toISOString(),
    mainEntityOfPage: pageUrl,
    publisher: { "@type": "Organization", name: PUBLISHER },
  };
}

export function eventJsonLd(event: GcaoEvent, pageUrl: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.excerpt,
    startDate: event.startsAt.toISOString(),
    endDate: event.endsAt?.toISOString(),
    image,
    url: pageUrl,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.location },
    organizer: { "@type": "Organization", name: PUBLISHER },
  };
}
