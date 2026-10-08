import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";
import { assertCmsAllowed } from "@/lib/cms";

export default async function CmsNewNewsPage() {
  const user = await assertCmsAllowed();
  return (
    <CmsShell current="news" title="New article" compact>
      <NewsForm canPublish={user.role === "admin"} />
    </CmsShell>
  );
}
