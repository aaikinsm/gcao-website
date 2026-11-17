import { SankofaHome } from "@/components/previews/SankofaHome";
import { getPublishedEvents, toUpcomingSlides } from "@/lib/events";
import { getPublishedNews, selectHomeNews } from "@/lib/news";

export const revalidate = 120;

export default async function HomePage() {
  const [upcomingEvents, news] = await Promise.all([
    getPublishedEvents().then(toUpcomingSlides),
    getPublishedNews().then(selectHomeNews),
  ]);

  return <SankofaHome upcomingEvents={upcomingEvents} news={news} />;
}
