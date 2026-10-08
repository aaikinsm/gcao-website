import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/events";
import { getPublishedNews } from "@/lib/news";
import { absoluteUrl, DARK_EVENTS, DARK_NEWS, eventPath, newsPath, siteOrigin } from "@/lib/seo";

export const revalidate = 120;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const [articles, events] = await Promise.all([getPublishedNews(), getPublishedEvents()]);

  return [
    { url: absoluteUrl(origin, DARK_NEWS), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl(origin, DARK_EVENTS), changeFrequency: "daily", priority: 0.8 },
    ...articles.map((article) => ({
      url: absoluteUrl(origin, newsPath(article.slug)),
      lastModified: article.publishedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...events.map((event) => ({
      url: absoluteUrl(origin, eventPath(event.slug)),
      lastModified: event.startsAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
