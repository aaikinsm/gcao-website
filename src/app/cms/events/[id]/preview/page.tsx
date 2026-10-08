import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPreviewNotice, previewTheme } from "@/components/cms/PostPreviewNotice";
import { SankofaEventDetail } from "@/components/previews/SankofaEventDetail";
import { assertCmsAllowed } from "@/lib/cms";
import { getEventById } from "@/lib/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview · GCAO",
  robots: { index: false, follow: false },
};

export default async function CmsEventPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  await assertCmsAllowed();
  const { id: idRaw } = await params;
  const id = Number(idRaw);
  if (!Number.isInteger(id)) notFound();

  const event = await getEventById(id);
  if (!event) notFound();

  const theme = previewTheme((await searchParams).theme);
  const isLight = theme === "light";
  const path = `/cms/events/${event.id}/preview`;

  return (
    <SankofaEventDetail
      theme={theme}
      optionLabel={isLight ? "A — Sankofa Light · Event" : "B — Sankofa Dark · Event"}
      basePath={isLight ? "/preview/sankofa-light" : "/preview/sankofa"}
      event={event}
      notice={
        <PostPreviewNotice published={event.status === "published"} theme={theme} path={path} />
      }
    />
  );
}
