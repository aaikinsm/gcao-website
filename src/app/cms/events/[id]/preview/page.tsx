import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostPreviewNotice } from "@/components/cms/PostPreviewNotice";
import { SankofaEventDetail } from "@/components/previews/SankofaEventDetail";
import { assertCmsAllowed } from "@/lib/cms";
import { getEventById } from "@/lib/events";
import { postAccessError } from "@/lib/post-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview · GCAO",
  robots: { index: false, follow: false },
};

export default async function CmsEventPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await assertCmsAllowed();
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const event = await getEventById(id);
  if (!event) notFound();
  const reason = postAccessError(user, event);
  if (reason) redirect(`/cms/posts?error=${reason}`);

  return (
    <SankofaEventDetail
      event={event}
      notice={<PostPreviewNotice published={event.status === "published"} />}
    />
  );
}
