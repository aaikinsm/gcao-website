import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewNewsPage() {
  return (
    <CmsShell
      current="news"
      title="New article"
      description="Write a recap or announcement. The URL slug updates from the title until you edit it."
    >
      <NewsForm />
    </CmsShell>
  );
}
