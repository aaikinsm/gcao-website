import { CmsEntryList } from "@/components/cms/CmsEntryList";
import { CmsNotice, CmsShell, PrimaryLink } from "@/components/cms/CmsShell";
import { formatEventDateRange, getAllEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function CmsEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const query = await searchParams;
  const events = await getAllEvents();

  return (
    <CmsShell
      current="events"
      title="Events"
      description="Create dated gatherings. Published items appear on the public events pages."
      action={<PrimaryLink href="/cms/events/new">New event</PrimaryLink>}
    >
      <CmsNotice saved={query.saved === "1"} deleted={query.deleted === "1"} noun="Event" />
      <CmsEntryList
        empty="No events yet. Create one to get started."
        items={events.map((event) => ({
          id: event.id,
          title: event.title,
          href: `/cms/events/${event.id}`,
          status: event.status,
          imageUrl: event.imageUrl,
          meta: formatEventDateRange(event.startsAt, event.endsAt),
        }))}
      />
    </CmsShell>
  );
}
