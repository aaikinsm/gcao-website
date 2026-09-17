import { SankofaHome } from "@/components/previews/SankofaHome";
import { getPublishedEvents, toUpcomingSlides } from "@/lib/events";

export const revalidate = 120;

export default async function SankofaDarkPreview() {
  const upcomingEvents = toUpcomingSlides(await getPublishedEvents());

  return (
    <SankofaHome
      theme="dark"
      optionLabel="B — Sankofa Dark"
      basePath="/preview/sankofa"
      upcomingEvents={upcomingEvents}
    />
  );
}
