import { SankofaHome } from "@/components/previews/SankofaHome";
import { getPublishedEvents, toUpcomingSlides } from "@/lib/events";
import { getPublishedNews, selectHomeNews } from "@/lib/news";

export const revalidate = 120;

export default async function SankofaLightPreview() {
  const [upcomingEvents, news] = await Promise.all([
    getPublishedEvents().then(toUpcomingSlides),
    getPublishedNews().then(selectHomeNews),
  ]);

  return (
    <SankofaHome
      theme="light"
      optionLabel="A — Sankofa Light"
      basePath="/preview/sankofa-light"
      upcomingEvents={upcomingEvents}
      news={news}
    />
  );
}
