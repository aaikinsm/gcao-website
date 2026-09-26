import { notFound } from "next/navigation";
import { EventForm } from "@/components/cms/EventForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { getEventById } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function CmsEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(Number(id));
  if (!event) notFound();

  return (
    <CmsShell current="events" title="Edit event" compact>
      <EventForm event={event} />
    </CmsShell>
  );
}
