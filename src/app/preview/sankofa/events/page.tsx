import { SankofaEvents } from "@/components/previews/SankofaEvents";
import { getPublishedEvents } from "@/lib/events";

export const revalidate = 120;

export default async function SankofaDarkEventsPage() {
  const events = await getPublishedEvents();

  return (
    <SankofaEvents
      theme="dark"
      optionLabel="B — Sankofa Dark · Events"
      basePath="/preview/sankofa"
      events={events}
    />
  );
}
