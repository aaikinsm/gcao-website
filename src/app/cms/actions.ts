"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertCmsAllowed } from "@/lib/cms";
import {
  createEvent,
  deleteEvent,
  getEventById,
  uniqueEventSlug,
  updateEvent,
} from "@/lib/events";
import {
  createNews,
  deleteNews,
  getNewsById,
  uniqueNewsSlug,
  updateNews,
} from "@/lib/news";
import { formDateTimeToMysql, slugify } from "@/lib/slug";
import { saveCmsImage } from "@/lib/uploads";

export type CmsActionState = { error: string } | null;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function statusFrom(formData: FormData): "draft" | "published" {
  return text(formData, "status") === "published" ? "published" : "draft";
}

function fileFrom(formData: FormData) {
  const value = formData.get("image");
  return value instanceof File ? value : null;
}

function revalidateEvents(slug?: string) {
  revalidatePath("/preview/sankofa/events");
  revalidatePath("/preview/sankofa-light/events");
  if (slug) {
    revalidatePath(`/preview/sankofa/events/${slug}`);
    revalidatePath(`/preview/sankofa-light/events/${slug}`);
  }
  revalidatePath("/cms");
  revalidatePath("/cms/events");
}

export async function saveEventAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  assertCmsAllowed();

  const idRaw = text(formData, "id");
  const id = idRaw ? Number(idRaw) : null;
  const title = text(formData, "title");
  const location = text(formData, "location");
  const excerpt = text(formData, "excerpt");
  const body = text(formData, "body");
  const startsAt = formDateTimeToMysql(text(formData, "starts_at"));
  const endsAt = formDateTimeToMysql(text(formData, "ends_at"));
  const requestedSlug = slugify(text(formData, "slug") || title);

  if (title.length < 3) return { error: "Add a title of at least 3 characters." };
  if (!startsAt) return { error: "Choose a start date and time." };
  if (!location) return { error: "Add a location." };
  if (!excerpt) return { error: "Add a short excerpt." };
  if (!body) return { error: "Add the event details." };

  const existing = id ? await getEventById(id) : null;
  if (id && !existing) return { error: "That event could not be found." };

  try {
    const imageUrl = await saveCmsImage(fileFrom(formData), existing?.imageUrl);
    if (!imageUrl) return { error: "Upload an image for this event." };

    const slug = await uniqueEventSlug(requestedSlug, existing?.id);
    const input = {
      title,
      slug,
      startsAt,
      endsAt,
      location,
      excerpt,
      body,
      imageUrl,
      status: statusFrom(formData),
    };

    if (existing) await updateEvent(existing.id, input);
    else await createEvent(input);

    revalidateEvents(slug);
    if (existing && existing.slug !== slug) revalidateEvents(existing.slug);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save the event." };
  }

  redirect("/cms/events?saved=1");
}

export async function deleteEventAction(id: number) {
  assertCmsAllowed();
  const existing = await getEventById(id);
  await deleteEvent(id);
  revalidateEvents(existing?.slug);
  redirect("/cms/events?deleted=1");
}

export async function saveNewsAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  assertCmsAllowed();

  const idRaw = text(formData, "id");
  const id = idRaw ? Number(idRaw) : null;
  const title = text(formData, "title");
  const category = text(formData, "category") || "Community";
  const excerpt = text(formData, "excerpt");
  const body = text(formData, "body");
  const publishedAt = formDateTimeToMysql(text(formData, "published_at"));
  const requestedSlug = slugify(text(formData, "slug") || title);

  if (title.length < 3) return { error: "Add a title of at least 3 characters." };
  if (!["Health", "Community", "Culture"].includes(category)) {
    return { error: "Choose a category." };
  }
  if (!publishedAt) return { error: "Choose a published date." };
  if (!excerpt) return { error: "Add a short excerpt." };
  if (!body) return { error: "Add the article body." };

  const existing = id ? await getNewsById(id) : null;
  if (id && !existing) return { error: "That article could not be found." };

  try {
    const imageUrl = await saveCmsImage(fileFrom(formData), existing?.imageUrl);
    if (!imageUrl) return { error: "Upload an image for this article." };

    const slug = await uniqueNewsSlug(requestedSlug, existing?.id);
    const input = {
      title,
      slug,
      category,
      excerpt,
      body,
      imageUrl,
      publishedAt,
      status: statusFrom(formData),
    };

    if (existing) await updateNews(existing.id, input);
    else await createNews(input);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save the article." };
  }

  revalidatePath("/cms");
  revalidatePath("/cms/news");
  redirect("/cms/news?saved=1");
}

export async function deleteNewsAction(id: number) {
  assertCmsAllowed();
  await deleteNews(id);
  revalidatePath("/cms");
  revalidatePath("/cms/news");
  redirect("/cms/news?deleted=1");
}
