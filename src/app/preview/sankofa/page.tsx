import { SankofaHome } from "@/components/previews/SankofaHome";
import { getPublishedEvents, toUpcomingSlides } from "@/lib/events";
import { getPublishedNews, selectHomeNews } from "@/lib/news";

export const revalidate = 120;

export default async function SankofaDarkPreview() {
  const [upcomingEvents, news] = await Promise.all([
    getPublishedEvents().then(toUpcomingSlides),
    getPublishedNews().then(selectHomeNews),
  ]);

  return (
    <SankofaHome
      theme="dark"
      optionLabel="B — Sankofa Dark"
      basePath="/preview/sankofa"
      upcomingEvents={upcomingEvents}
      news={news}
    />
  );
}
