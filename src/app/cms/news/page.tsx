import { CmsEntryList } from "@/components/cms/CmsEntryList";
import { CmsNotice, CmsShell, PrimaryLink } from "@/components/cms/CmsShell";
import { getAllNews } from "@/lib/news";
import { toDatetimeLocalValue } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function CmsNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const query = await searchParams;
  const news = await getAllNews();

  return (
    <CmsShell
      current="news"
      title="News"
      description="Editorial recaps and community stories. Public news pages will use these rows later."
      action={<PrimaryLink href="/cms/news/new">New article</PrimaryLink>}
    >
      <CmsNotice saved={query.saved === "1"} deleted={query.deleted === "1"} noun="Article" />
      <CmsEntryList
        empty="No articles yet. Create one to get started."
        items={news.map((item) => ({
          id: item.id,
          title: item.title,
          href: `/cms/news/${item.id}`,
          status: item.status,
          imageUrl: item.imageUrl,
          meta: `${item.category} · ${toDatetimeLocalValue(item.publishedAt).replace("T", " ")}`,
        }))}
      />
    </CmsShell>
  );
}
