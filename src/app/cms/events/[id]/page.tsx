import { notFound, redirect } from "next/navigation";
import { EventForm } from "@/components/cms/EventForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";
import { getEventById } from "@/lib/events";
import { postAccessError } from "@/lib/post-access";

export const dynamic = "force-dynamic";

export default async function CmsEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await assertCmsAllowed();
  const { id } = await params;
  const event = await getEventById(Number(id));
  if (!event) notFound();
  const reason = postAccessError(user, event);
  if (reason) redirect(`/cms/posts?error=${reason}`);

  return (
    <CmsShell current="events" title="Edit event" compact>
      <EventForm event={event} canPublish={user.role === "admin"} />
    </CmsShell>
  );
}
