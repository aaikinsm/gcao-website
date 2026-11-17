import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostPreviewNotice, previewTheme } from "@/components/cms/PostPreviewNotice";
import { SankofaNewsDetail } from "@/components/previews/SankofaNewsDetail";
import { assertCmsAllowed } from "@/lib/cms";
import { getNewsById } from "@/lib/news";
import { postAccessError } from "@/lib/post-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview · GCAO",
  robots: { index: false, follow: false },
};

export default async function CmsNewsPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const user = await assertCmsAllowed();
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const article = await getNewsById(id);
  if (!article) notFound();
  const reason = postAccessError(user, article);
  if (reason) redirect(`/cms/posts?error=${reason}`);

  const theme = previewTheme((await searchParams).theme);
  const isLight = theme === "light";
  const path = `/cms/news/${article.id}/preview`;

  return (
    <SankofaNewsDetail
      theme={theme}
      optionLabel={isLight ? "A — Sankofa Light · Update" : "B — Sankofa Dark · Update"}
      basePath={isLight ? "/preview/sankofa-light" : "/preview/sankofa"}
      article={article}
      notice={
        <PostPreviewNotice published={article.status === "published"} theme={theme} path={path} />
      }
    />
  );
}
