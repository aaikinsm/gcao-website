import Link from "next/link";
import { CmsShell, PrimaryLink } from "@/components/cms/CmsShell";
import { formatEventDateRange, getAllEvents } from "@/lib/events";
import { getAllNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function CmsDashboardPage() {
  const [events, news] = await Promise.all([getAllEvents(), getAllNews()]);
  const publishedEvents = events.filter((event) => event.status === "published").length;
  const publishedNews = news.filter((item) => item.status === "published").length;

  return (
    <CmsShell
      current="overview"
      title="Content"
      description="Add and update events and news. Published events show on the Sankofa events pages right away."
      action={<PrimaryLink href="/cms/events/new">New event</PrimaryLink>}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/cms/events"
          className="rounded-[2rem] border border-black/10 bg-white p-8 transition-colors hover:border-[#006B3F]/40"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">Events</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">{events.length}</p>
          <p className="mt-2 text-sm text-[#0F1B14]/50">{publishedEvents} published</p>
        </Link>
        <Link
          href="/cms/news"
          className="rounded-[2rem] border border-black/10 bg-white p-8 transition-colors hover:border-[#006B3F]/40"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">News</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">{news.length}</p>
          <p className="mt-2 text-sm text-[#0F1B14]/50">{publishedNews} published</p>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <PrimaryLink href="/cms/news/new">New article</PrimaryLink>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <RecentList
          heading="Recent events"
          href="/cms/events"
          items={events.slice(0, 5).map((event) => ({
            href: `/cms/events/${event.id}`,
            title: event.title,
            meta: `${event.status} · ${formatEventDateRange(event.startsAt, event.endsAt)}`,
          }))}
        />
        <RecentList
          heading="Recent news"
          href="/cms/news"
          items={news.slice(0, 5).map((item) => ({
            href: `/cms/news/${item.id}`,
            title: item.title,
            meta: `${item.status} · ${item.category}`,
          }))}
        />
      </div>
    </CmsShell>
  );
}

function RecentList({
  heading,
  href,
  items,
}: {
  heading: string;
  href: string;
  items: { href: string; title: string; meta: string }[];
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        <Link href={href} className="text-sm font-semibold text-[#006B3F]">
          See all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[#0F1B14]/50">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-black/5 rounded-3xl border border-black/10 bg-white">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block px-5 py-4 hover:bg-[#FFFBF2]">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-xs capitalize text-[#0F1B14]/45">{item.meta}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
