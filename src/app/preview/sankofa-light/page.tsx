import { SankofaHome } from "@/components/previews/SankofaHome";
import { getPublishedEvents, toUpcomingSlides } from "@/lib/events";

export const revalidate = 120;

export default async function SankofaLightPreview() {
  const upcomingEvents = toUpcomingSlides(await getPublishedEvents());

  return (
    <SankofaHome
      theme="light"
      optionLabel="A — Sankofa Light"
      basePath="/preview/sankofa-light"
      upcomingEvents={upcomingEvents}
    />
  );
}
