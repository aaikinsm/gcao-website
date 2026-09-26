import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewNewsPage() {
  return (
    <CmsShell current="news" title="New article" compact>
      <NewsForm />
    </CmsShell>
  );
}
