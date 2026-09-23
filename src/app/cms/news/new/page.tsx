import { NewsForm } from "@/components/cms/NewsForm";
import { CmsShell } from "@/components/cms/CmsShell";

export default function CmsNewNewsPage() {
  return (
    <CmsShell
      current="news"
      title="New article"
      description="Write an update. Suggest a category after you have a title and body, or pick News, Notice, or Story."
    >
      <NewsForm />
    </CmsShell>
  );
}
