import { EventForm } from "@/components/cms/EventForm";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewEventPage() {
  return (
    <CmsShell current="events" title="New event" compact>
      <EventForm />
    </CmsShell>
  );
}
