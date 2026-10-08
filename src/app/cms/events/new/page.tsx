import { EventForm } from "@/components/cms/EventForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";

export default async function CmsNewEventPage() {
  const user = await assertCmsAllowed();
  return (
    <CmsShell current="events" title="New event" compact>
      <EventForm canPublish={user.role === "admin"} />
    </CmsShell>
  );
}
