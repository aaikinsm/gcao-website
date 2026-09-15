import { SankofaEvents } from "@/components/previews/SankofaEvents";
import { getPublishedEvents } from "@/lib/events";

export const revalidate = 120;

export default async function SankofaLightEventsPage() {
  const events = await getPublishedEvents();

  return (
    <SankofaEvents
      theme="light"
      optionLabel="A — Sankofa Light · Events"
      basePath="/preview/sankofa-light"
      events={events}
    />
  );
}
