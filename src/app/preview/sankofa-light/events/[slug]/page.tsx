import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SankofaEventDetail } from "@/components/previews/SankofaEventDetail";
import { getEventBySlug } from "@/lib/events";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} · GCAO`,
    description: event.excerpt,
  };
}

export default async function SankofaLightEventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <SankofaEventDetail
      theme="light"
      optionLabel="A — Sankofa Light · Event"
      basePath="/preview/sankofa-light"
      event={event}
    />
  );
}
