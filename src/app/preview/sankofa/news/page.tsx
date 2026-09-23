import { SankofaNews } from "@/components/previews/SankofaNews";
import { getPublishedNews } from "@/lib/news";

export const revalidate = 120;

export default async function SankofaDarkNewsPage() {
  const articles = await getPublishedNews();

  return (
    <SankofaNews
      theme="dark"
      optionLabel="B — Sankofa Dark · Updates"
      basePath="/preview/sankofa"
      articles={articles}
    />
  );
}
