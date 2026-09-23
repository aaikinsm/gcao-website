import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SankofaNewsDetail } from "@/components/previews/SankofaNewsDetail";
import { getNewsBySlug } from "@/lib/news";

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Update not found" };
  return {
    title: `${article.title} · GCAO`,
    description: article.excerpt,
  };
}

export default async function SankofaDarkNewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <SankofaNewsDetail
      theme="dark"
      optionLabel="B — Sankofa Dark · Update"
      basePath="/preview/sankofa"
      article={article}
    />
  );
}
