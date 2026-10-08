import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SankofaEventDetail } from "@/components/previews/SankofaEventDetail";
import { JsonLd } from "@/components/shared/JsonLd";
import { getEventBySlug } from "@/lib/events";
import { absoluteImage, absoluteUrl, eventJsonLd, eventPath, postMetadata, siteOrigin } from "@/lib/seo";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  const origin = await siteOrigin();
  return postMetadata({
    title: event.title,
    description: event.excerpt,
    path: eventPath(event.slug),
    image: absoluteImage(origin, event.imageUrl),
    type: "website",
  });
}

export default async function SankofaLightEventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const origin = await siteOrigin();
  const pageUrl = absoluteUrl(origin, eventPath(event.slug));

  return (
    <>
      <JsonLd data={eventJsonLd(event, pageUrl, absoluteImage(origin, event.imageUrl))} />
      <SankofaEventDetail
        theme="light"
        optionLabel="A — Sankofa Light · Event"
        basePath="/preview/sankofa-light"
        event={event}
        shareUrl={pageUrl}
      />
    </>
  );
}
