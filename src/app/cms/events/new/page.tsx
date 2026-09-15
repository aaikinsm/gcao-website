import { EventForm } from "@/components/cms/EventForm";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewEventPage() {
  return (
    <CmsShell
      current="events"
      title="New event"
      description="Fill in the basics. The URL slug updates from the title until you edit it."
    >
      <EventForm />
    </CmsShell>
  );
}
