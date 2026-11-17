import { SankofaEvents } from "@/components/previews/SankofaEvents";
import { getPublishedEvents } from "@/lib/events";

export const revalidate = 120;

export default async function EventsPage() {
  const events = await getPublishedEvents();
  return <SankofaEvents events={events} />;
}
