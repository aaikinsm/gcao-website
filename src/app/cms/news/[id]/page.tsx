import { notFound } from "next/navigation";
import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { getNewsById } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function CmsEditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsById(Number(id));
  if (!article) notFound();

  return (
    <CmsShell current="news" title="Edit article" compact>
      <NewsForm article={article} />
    </CmsShell>
  );
}
