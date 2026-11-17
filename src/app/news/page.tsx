import { SankofaNews } from "@/components/previews/SankofaNews";
import { getPublishedNews } from "@/lib/news";

export const revalidate = 120;

export default async function NewsPage() {
  const articles = await getPublishedNews();
  return <SankofaNews articles={articles} />;
}
