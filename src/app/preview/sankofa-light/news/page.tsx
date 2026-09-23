import { SankofaNews } from "@/components/previews/SankofaNews";
import { getPublishedNews } from "@/lib/news";

export const revalidate = 120;

export default async function SankofaLightNewsPage() {
  const articles = await getPublishedNews();

  return (
    <SankofaNews
      theme="light"
      optionLabel="A — Sankofa Light · Updates"
      basePath="/preview/sankofa-light"
      articles={articles}
    />
  );
}
