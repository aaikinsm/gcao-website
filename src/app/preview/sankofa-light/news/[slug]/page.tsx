import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SankofaNewsDetail } from "@/components/previews/SankofaNewsDetail";
import { JsonLd } from "@/components/shared/JsonLd";
import { getNewsBySlug } from "@/lib/news";
import { absoluteImage, absoluteUrl, newsJsonLd, newsPath, postMetadata, siteOrigin } from "@/lib/seo";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Update not found" };
  const origin = await siteOrigin();
  return postMetadata({
    title: article.title,
    description: article.excerpt,
    path: newsPath(article.slug),
    image: absoluteImage(origin, article.imageUrl),
    type: "article",
  });
}

export default async function SankofaLightNewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();
  const origin = await siteOrigin();
  const pageUrl = absoluteUrl(origin, newsPath(article.slug));

  return (
    <>
      <JsonLd data={newsJsonLd(article, pageUrl, absoluteImage(origin, article.imageUrl))} />
      <SankofaNewsDetail
        theme="light"
        optionLabel="A — Sankofa Light · Update"
        basePath="/preview/sankofa-light"
        article={article}
        shareUrl={pageUrl}
      />
    </>
  );
}
