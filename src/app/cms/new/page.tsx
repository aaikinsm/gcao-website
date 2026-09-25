import { ComposeChooser } from "@/components/cms/ComposeChooser";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewPostPage() {
  return (
    <CmsShell
      current="new"
      title="New post"
      description="Write it yourself or upload a flyer. You always review the draft before it goes live."
    >
      <ComposeChooser />
    </CmsShell>
  );
}
