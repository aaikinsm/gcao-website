"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertCmsAllowed } from "@/lib/cms";
import type { AiComposeResult } from "@/lib/cms-draft";
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
  parseNewsKind,
  uniqueNewsSlug,
  updateNews,
} from "@/lib/news";
import {
  classifyArticleKind,
  draftFromImage,
  draftFromSource,
  generateImagePng,
  openaiConfigured,
  rewriteDraft,
  type AiDraftFields,
} from "@/lib/openai";
import { formDateTimeToMysql, slugify } from "@/lib/slug";
import { saveCmsImage, saveCmsImageBuffer } from "@/lib/uploads";

export type CmsActionState = { error: string } | null;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function statusFrom(formData: FormData): "draft" | "published" {
  return text(formData, "status") === "published" ? "published" : "draft";
}

function fileFrom(formData: FormData, key = "image") {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}

function revalidateEvents(slug?: string) {
  revalidatePath("/preview/sankofa/events");
  revalidatePath("/preview/sankofa-light/events");
  revalidatePath("/preview/sankofa");
  revalidatePath("/preview/sankofa-light");
  if (slug) {
    revalidatePath(`/preview/sankofa/events/${slug}`);
    revalidatePath(`/preview/sankofa-light/events/${slug}`);
  }
  revalidatePath("/cms");
  revalidatePath("/cms/events");
  revalidatePath("/cms/posts");
}

function revalidateNews(slug?: string) {
  revalidatePath("/preview/sankofa/news");
  revalidatePath("/preview/sankofa-light/news");
  revalidatePath("/preview/sankofa");
  revalidatePath("/preview/sankofa-light");
  if (slug) {
    revalidatePath(`/preview/sankofa/news/${slug}`);
    revalidatePath(`/preview/sankofa-light/news/${slug}`);
  }
  revalidatePath("/cms");
  revalidatePath("/cms/news");
  revalidatePath("/cms/posts");
}

function imageFallback(formData: FormData, existing?: string) {
  return text(formData, "image_url") || existing || "";
}

function toComposeResult(draft: AiDraftFields): AiComposeResult {
  return {
    postType: draft.postType,
    kind: draft.kind,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.body,
    location: draft.location,
    startsAt: draft.startsAt,
    endsAt: draft.endsAt,
    category: draft.category,
  };
}

export async function aiStatusAction() {
  assertCmsAllowed();
  return { enabled: openaiConfigured() };
}

export async function extractFromUploadAction(formData: FormData): Promise<AiComposeResult> {
  assertCmsAllowed();
  const file = fileFrom(formData, "source");
  // #region agent log
  fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" },
    body: JSON.stringify({
      sessionId: "92ff33",
      runId: "pre-fix",
      hypothesisId: "E",
      location: "actions.ts:extractFromUploadAction",
      message: "server action entered",
      data: {
        hasFile: Boolean(file && file.size > 0),
        size: file?.size ?? 0,
        type: file?.type ?? "",
        openai: openaiConfigured(),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (!openaiConfigured()) return { error: "AI is not set up on this computer." };

  if (!file || file.size === 0) return { error: "Choose a flyer or PDF first." };
  if (file.size > 8 * 1024 * 1024) return { error: "File must be 8MB or smaller." };

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const { extractPdfText } = await import("@/lib/pdf-text");
      const extracted = await extractPdfText(bytes);
      if (!extracted) return { error: "Could not read text from that PDF. Try a photo of the flyer." };
      return toComposeResult(await draftFromSource(extracted));
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return { error: "Use a JPG, PNG, WebP, or PDF." };
    }
    return toComposeResult(await draftFromImage(bytes, file.type));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not read that file." };
  }
}

export async function draftFromNotesAction(formData: FormData): Promise<AiComposeResult> {
  assertCmsAllowed();
  if (!openaiConfigured()) return { error: "AI is not set up on this computer." };
  const notes = text(formData, "notes");
  if (notes.length < 8) return { error: "Add a few more notes so there is something to draft." };
  try {
    return toComposeResult(await draftFromSource(notes));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not draft from those notes." };
  }
}

export async function rewritePostAction(formData: FormData): Promise<AiComposeResult> {
  assertCmsAllowed();
  if (!openaiConfigured()) return { error: "AI is not set up on this computer." };
  try {
    const postType = text(formData, "postType") === "event" ? "event" : "update";
    return toComposeResult(
      await rewriteDraft({
        postType,
        title: text(formData, "title"),
        excerpt: text(formData, "excerpt"),
        body: text(formData, "body"),
        location: text(formData, "location"),
      }),
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not rewrite this draft." };
  }
}

export async function classifyArticleAction(formData: FormData): Promise<AiComposeResult> {
  assertCmsAllowed();
  if (!openaiConfigured()) return { error: "AI is not set up on this computer." };
  try {
    const kind = await classifyArticleKind({
      title: text(formData, "title"),
      excerpt: text(formData, "excerpt"),
      body: text(formData, "body"),
    });
    return { kind };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not suggest a category." };
  }
}

export async function generatePostImageAction(formData: FormData): Promise<AiComposeResult> {
  assertCmsAllowed();
  if (!openaiConfigured()) return { error: "AI is not set up on this computer." };
  const title = text(formData, "title");
  const excerpt = text(formData, "excerpt");
  if (title.length < 3) return { error: "Add a title before generating an image." };
  try {
    const png = await generateImagePng(title, excerpt);
    const imageUrl = await saveCmsImageBuffer(png, "png", title);
    return { imageUrl };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not generate an image." };
  }
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
    const imageUrl = await saveCmsImage(fileFrom(formData), imageFallback(formData, existing?.imageUrl));
    if (!imageUrl) return { error: "Upload or generate an image for this event." };

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

  redirect("/cms/posts?saved=1");
}

export async function deleteEventAction(id: number) {
  assertCmsAllowed();
  const existing = await getEventById(id);
  await deleteEvent(id);
  revalidateEvents(existing?.slug);
  redirect("/cms/posts?deleted=1");
}

export async function saveNewsAction(
  _prev: CmsActionState,
  formData: FormData,
): Promise<CmsActionState> {
  assertCmsAllowed();

  const idRaw = text(formData, "id");
  const id = idRaw ? Number(idRaw) : null;
  const title = text(formData, "title");
  const kind = parseNewsKind(text(formData, "kind"));
  const category = text(formData, "category") || "Community";
  const excerpt = text(formData, "excerpt");
  const body = text(formData, "body");
  const publishedAt = formDateTimeToMysql(text(formData, "published_at"));
  const requestedSlug = slugify(text(formData, "slug") || title);

  if (title.length < 3) return { error: "Add a title of at least 3 characters." };
  if (!["Health", "Community", "Culture"].includes(category)) {
    return { error: "Choose a topic." };
  }
  if (!publishedAt) return { error: "Choose a published date." };
  if (!excerpt) return { error: "Add a short excerpt." };
  if (!body) return { error: "Add the article body." };

  const existing = id ? await getNewsById(id) : null;
  if (id && !existing) return { error: "That article could not be found." };

  try {
    const imageUrl = await saveCmsImage(fileFrom(formData), imageFallback(formData, existing?.imageUrl));
    if (!imageUrl) return { error: "Upload or generate an image for this article." };

    const slug = await uniqueNewsSlug(requestedSlug, existing?.id);
    const input = {
      title,
      slug,
      kind,
      category,
      excerpt,
      body,
      imageUrl,
      publishedAt,
      status: statusFrom(formData),
    };

    if (existing) await updateNews(existing.id, input);
    else await createNews(input);

    revalidateNews(slug);
    if (existing && existing.slug !== slug) revalidateNews(existing.slug);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save the article." };
  }

  redirect("/cms/posts?saved=1");
}

export async function deleteNewsAction(id: number) {
  assertCmsAllowed();
  const existing = await getNewsById(id);
  await deleteNews(id);
  revalidateNews(existing?.slug);
  redirect("/cms/posts?deleted=1");
}
