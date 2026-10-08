import { ComposeChooser } from "@/components/cms/ComposeChooser";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";

export default async function CmsNewPostPage() {
  const user = await assertCmsAllowed();
  return (
    <CmsShell
      current="new"
      title="New post"
      description="Write it yourself or upload a flyer. An admin publishes it before it goes live."
    >
      <ComposeChooser canPublish={user.role === "admin"} />
    </CmsShell>
  );
}
