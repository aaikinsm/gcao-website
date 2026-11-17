import { notFound, redirect } from "next/navigation";
import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";
import { getNewsById } from "@/lib/news";
import { postAccessError } from "@/lib/post-access";

export const dynamic = "force-dynamic";

export default async function CmsEditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await assertCmsAllowed();
  const { id } = await params;
  const article = await getNewsById(Number(id));
  if (!article) notFound();
  const reason = postAccessError(user, article);
  if (reason) redirect(`/cms/posts?error=${reason}`);

  return (
    <CmsShell current="news" title="Edit article" compact>
      <NewsForm article={article} canPublish={user.role === "admin"} />
    </CmsShell>
  );
}
