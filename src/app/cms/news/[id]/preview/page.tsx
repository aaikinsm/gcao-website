import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostPreviewNotice } from "@/components/cms/PostPreviewNotice";
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
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await assertCmsAllowed();
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const article = await getNewsById(id);
  if (!article) notFound();
  const reason = postAccessError(user, article);
  if (reason) redirect(`/cms/posts?error=${reason}`);

  return (
    <SankofaNewsDetail
      article={article}
      notice={<PostPreviewNotice published={article.status === "published"} />}
    />
  );
}
