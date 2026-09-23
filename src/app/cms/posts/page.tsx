import Link from "next/link";
import { CmsEntryList } from "@/components/cms/CmsEntryList";
import { CmsNotice, CmsShell, PrimaryLink } from "@/components/cms/CmsShell";
import { formatEventDateRange, getAllEvents } from "@/lib/events";
import { getAllNews, newsKindLabel } from "@/lib/news";
import { toDatetimeLocalValue } from "@/lib/slug";

export const dynamic = "force-dynamic";

const filters = [
  { id: "all", label: "All" },
  { id: "events", label: "Events" },
  { id: "news", label: "News" },
  { id: "notice", label: "Notices" },
  { id: "story", label: "Stories" },
] as const;

type Filter = (typeof filters)[number]["id"];

export default async function CmsPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; filter?: string }>;
}) {
  const query = await searchParams;
  const filter = (filters.some((item) => item.id === query.filter) ? query.filter : "all") as Filter;
  const [events, news] = await Promise.all([getAllEvents(), getAllNews()]);

  const eventItems = events.map((event) => ({
    id: event.id,
    title: event.title,
    href: `/cms/events/${event.id}`,
    status: event.status,
    imageUrl: event.imageUrl,
    group: "events" as const,
    meta: `Event · ${formatEventDateRange(event.startsAt, event.endsAt)}`,
  }));

  const newsItems = news.map((item) => ({
    id: item.id + 100000,
    title: item.title,
    href: `/cms/news/${item.id}`,
    status: item.status,
    imageUrl: item.imageUrl,
    group: item.kind,
    meta: `${newsKindLabel(item.kind)} · ${toDatetimeLocalValue(item.publishedAt).replace("T", " ")}`,
  }));

  const items = [...eventItems, ...newsItems].filter((item) => {
    if (filter === "all") return true;
    if (filter === "events") return item.group === "events";
    return item.group === filter;
  });

  return (
    <CmsShell
      current="posts"
      title="All posts"
      description="Events, news, notices, and stories in one list."
      action={<PrimaryLink href="/cms/new">New post</PrimaryLink>}
    >
      <CmsNotice saved={query.saved === "1"} deleted={query.deleted === "1"} noun="Post" />
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((item) => {
          const href = item.id === "all" ? "/cms/posts" : `/cms/posts?filter=${item.id}`;
          const active = filter === item.id;
          return (
            <Link
              key={item.id}
              href={href}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                active
                  ? "border-[#006B3F] bg-[#006B3F] text-white"
                  : "border-black/10 hover:border-[#006B3F]/40"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <CmsEntryList empty="Nothing in this list yet." items={items} />
    </CmsShell>
  );
}
