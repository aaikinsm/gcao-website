"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  aiStatusAction,
  duplicateEventAction,
  generatePostImageAction,
  rewritePostAction,
  saveEventAction,
  type CmsActionState,
} from "@/app/cms/actions";
import { AttachmentPicker } from "@/components/cms/AttachmentPicker";
import { CmsIcon, IconLabel } from "@/components/cms/CmsIcons";
import { applyDictation, DictationButton, type DictationPreview, type DictationUpdate } from "@/components/cms/DictationButton";
import { HtmlModeToggle } from "@/components/cms/HtmlModeToggle";
import { MoreOptions } from "@/components/cms/MoreOptions";
import { SidebarSection } from "@/components/cms/SidebarSection";
import { FormattedField, type FormattedFieldHandle } from "@/components/cms/FormattedField";
import { ImagePicker } from "@/components/cms/ImagePicker";
import { DeleteButton } from "@/components/cms/DeleteButton";
import { StatusField } from "@/components/cms/StatusField";
import type { EventDraft } from "@/lib/cms-draft";
import type { GcaoEvent } from "@/lib/events";
import { youtubeWatchUrl, type BodyMode } from "@/lib/post-fields";
import { slugify, toDatetimeLocalValue } from "@/lib/slug";

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";
const label = "text-sm font-medium text-[#0F1B14]";
const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function EventForm({
  event,
  draft,
  canPublish = false,
}: {
  event?: GcaoEvent;
  draft?: EventDraft;
  canPublish?: boolean;
}) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    saveEventAction,
    null,
  );
  const [title, setTitle] = useState(event?.title ?? draft?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event));
  const [location, setLocation] = useState(event?.location ?? draft?.location ?? "");
  const [excerpt, setExcerpt] = useState(event?.excerpt ?? draft?.excerpt ?? "");
  const [body, setBody] = useState(event?.body ?? draft?.body ?? "");
  const [bodyMode, setBodyMode] = useState<BodyMode>(
    canPublish && event?.bodyMode === "html" ? "html" : "formatted",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(youtubeWatchUrl(event?.youtubeId));
  const [duplicating, startDuplicate] = useTransition();
  const [startsAt, setStartsAt] = useState(
    event ? toDatetimeLocalValue(event.startsAt) : (draft?.startsAt ?? ""),
  );
  const [endsAt, setEndsAt] = useState(
    event?.endsAt ? toDatetimeLocalValue(event.endsAt) : (draft?.endsAt ?? ""),
  );
  const [imageUrl, setImageUrl] = useState(draft?.imageUrl ?? event?.imageUrl ?? "");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiBusy, setAiBusy] = useState<"rewrite" | "image" | null>(null);
  const [aiError, setAiError] = useState("");
  const lockedHtml = Boolean(event?.bodyMode === "html" && !canPublish);
  const editorRef = useRef<FormattedFieldHandle>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const htmlMirror = useRef(body);
  const htmlPreview = useRef<DictationPreview | null>(null);
  const editorPreview = useRef(false);
  htmlMirror.current = body;
  const insertDictation = (update: DictationUpdate) => {
    if (!update.text.trim()) {
      htmlPreview.current = null;
      editorPreview.current = false;
      return;
    }
    if (bodyMode === "html") {
      if (update.commit && editorPreview.current) {
        editorPreview.current = false;
        return;
      }
      const next = applyDictation(htmlMirror.current, update.text, update.commit, bodyRef.current, htmlPreview);
      htmlMirror.current = next;
      setBody(next);
      return;
    }
    if (update.commit) {
      editorPreview.current = false;
      editorRef.current?.commitDictation(update.text);
      return;
    }
    editorPreview.current = true;
    editorRef.current?.previewDictation(update.text);
  };
  const moreOpen = Boolean(
    (event?.attachments.length ?? 0) > 0 ||
      event?.youtubeId ||
      event?.featured ||
      event?.endsAt ||
      draft?.endsAt ||
      (event ? event.slug !== slugify(event.title) : false),
  );

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    void aiStatusAction().then((status) => setAiEnabled(status.enabled));
  }, []);

  const runRewrite = async () => {
    setAiBusy("rewrite");
    setAiError("");
    const data = new FormData();
    data.set("postType", "event");
    data.set("title", title);
    data.set("excerpt", excerpt);
    data.set("body", body);
    data.set("location", location);
    const result = await rewritePostAction(data);
    setAiBusy(null);
    if (result.error) {
      setAiError(result.error);
      return;
    }
    if (result.title) setTitle(result.title);
    if (result.excerpt) setExcerpt(result.excerpt);
    if (result.body) setBody(result.body);
    if (result.location) setLocation(result.location);
    if (result.startsAt) setStartsAt(result.startsAt);
    if (result.endsAt) setEndsAt(result.endsAt);
  };

  const runImage = async () => {
    setAiBusy("image");
    setAiError("");
    const data = new FormData();
    data.set("title", title);
    data.set("excerpt", excerpt);
    const result = await generatePostImageAction(data);
    setAiBusy(null);
    if (result.error) {
      setAiError(result.error);
      return;
    }
    if (result.imageUrl) setImageUrl(result.imageUrl);
  };

  return (
    <form action={formAction}>
      {event && <input type="hidden" name="id" value={event.id} />}
      {state?.error && (
        <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}
      {aiError && (
        <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {aiError}
        </p>
      )}

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,42rem)_20rem]">
        <div className="min-w-0 max-w-2xl">
          <div className="rounded-[1.75rem] border border-black/[0.08] bg-white px-8 py-10 shadow-[0_24px_60px_rgba(15,27,20,0.06)] md:px-12 md:py-12">
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Title"
              placeholder="Title"
              className="w-full border-0 border-b border-black/[0.08] bg-transparent pb-4 text-4xl font-semibold tracking-[-0.03em] text-[#0F1B14] outline-none placeholder:text-[#0F1B14]/25"
              style={display}
            />
            <label className="mt-8 block text-xs font-semibold uppercase tracking-[0.16em] text-[#0F1B14]/45" htmlFor="excerpt">
              Summary
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A sentence or two for the card"
              className="mt-2 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-[#0F1B14]/70 outline-none placeholder:text-[#0F1B14]/35"
            />
            <div className="mt-8 border-t border-black/10 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F1B14]/45" htmlFor="body">
                  Details
                </label>
                <div className="flex flex-wrap items-center justify-end gap-4">
                  {lockedHtml ? null : <DictationButton activeKey={bodyMode} onText={insertDictation} />}
                  {canPublish ? (
                    <HtmlModeToggle
                      html={bodyMode === "html"}
                      onChange={(html) => setBodyMode(html ? "html" : "formatted")}
                    />
                  ) : null}
                </div>
              </div>
              <input type="hidden" name="body_mode" value={lockedHtml ? "html" : bodyMode} />
              {lockedHtml ? (
                <p className="mt-6 text-sm text-[#0F1B14]/55">
                  This event uses custom HTML. An admin can edit that.
                </p>
              ) : bodyMode === "html" ? (
                <textarea
                  id="body"
                  name="body"
                  ref={bodyRef}
                  value={body}
                  onChange={(change) => setBody(change.target.value)}
                  className="mt-3 min-h-[16rem] w-full border-0 bg-transparent font-mono text-sm leading-relaxed text-[#0F1B14] outline-none"
                />
              ) : (
                <FormattedField
                  ref={editorRef}
                  id="body"
                  name="body"
                  label="Details"
                  value={body}
                  onChange={setBody}
                  plain
                />
              )}
            </div>
          </div>
          {aiEnabled && (
            <div className="mt-4 px-2">
              <button
                type="button"
                onClick={() => void runRewrite()}
                disabled={Boolean(aiBusy)}
                className="text-sm font-medium text-[#006B3F] disabled:opacity-50"
              >
                {aiBusy === "rewrite" ? "Rewriting…" : "Rewrite with AI"}
              </button>
              <p className="mt-1 text-sm text-[#0F1B14]/45">
                Rough notes in the body are enough. Rewrite will polish them.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-[1.5rem] border border-black/10 bg-white px-5 lg:sticky lg:top-6">
          <SidebarSection>
          <ImagePicker
            existingUrl={event?.imageUrl}
            existingAlt={title || event?.title}
            generatedUrl={imageUrl !== event?.imageUrl ? imageUrl : undefined}
            onGenerate={aiEnabled ? () => void runImage() : undefined}
            generatePending={aiBusy === "image"}
            generateEnabled={title.length >= 3}
          />
          </SidebarSection>

          <SidebarSection>
          <div>
            <label className={label} htmlFor="starts_at">
              Starts
            </label>
            <input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className={field}
            />
          </div>
          </SidebarSection>

          <SidebarSection>
          <div>
            <label className={label} htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={field}
              placeholder="GCAO Resource Hub, 10 Belfield Rd, Toronto"
            />
          </div>
          </SidebarSection>

          <SidebarSection>
          <MoreOptions open={moreOpen}>
            <AttachmentPicker initial={event?.attachments} />
            <div>
              <IconLabel icon="video" htmlFor="youtube_url" className={label}>
                Video
              </IconLabel>
              <input
                id="youtube_url"
                name="youtube_url"
                value={youtubeUrl}
                onChange={(change) => setYoutubeUrl(change.target.value)}
                placeholder="Paste a YouTube link"
                className={field}
              />
              <p className="mt-1 text-xs text-[#0F1B14]/50">It plays on the page.</p>
            </div>
            {canPublish ? (
              <label className="flex items-center gap-3 text-sm font-medium text-[#0F1B14]">
                <input
                  type="checkbox"
                  name="featured"
                  value="1"
                  defaultChecked={event?.featured}
                  className="h-4 w-4 accent-[#006B3F]"
                />
                <CmsIcon name="star" className="h-4 w-4 opacity-70" />
                Feature on the homepage
              </label>
            ) : null}
            <div>
              <IconLabel icon="clock" htmlFor="ends_at" className={label}>
                Ends (optional)
              </IconLabel>
              <input
                id="ends_at"
                name="ends_at"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <IconLabel icon="link" htmlFor="slug" className="text-xs font-medium text-[#0F1B14]/55">
                URL slug
              </IconLabel>
              <div className="relative mt-2">
                <CmsIcon
                  name="link"
                  className="pointer-events-none absolute left-0 top-2.5 h-4 w-4 text-[#0F1B14]/35"
                />
                <input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="w-full border-0 border-b border-black/10 bg-transparent py-2 pl-6 text-sm text-[#0F1B14]/70 outline-none focus:border-[#006B3F]"
                />
              </div>
            </div>
          </MoreOptions>
          </SidebarSection>

          <SidebarSection>
          <StatusField canPublish={canPublish} status={event?.status} />
          </SidebarSection>
          {event?.authorName ? (
            <SidebarSection>
            <p className="text-sm text-[#0F1B14]/55">Written by {event.authorName}</p>
            </SidebarSection>
          ) : null}

          <SidebarSection>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {event && (canPublish || event.status !== "published") ? (
              <DeleteButton id={event.id} kind="event" title={event.title} />
            ) : (
              <span />
            )}
            <div className="flex flex-wrap items-center gap-3">
              {event ? (
                <>
                  <button
                    type="button"
                    disabled={duplicating}
                    onClick={() => startDuplicate(() => duplicateEventAction(event.id))}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-[#0F1B14] hover:border-[#006B3F]/40 disabled:opacity-60"
                  >
                    <CmsIcon name="copy" />
                    {duplicating ? "Copying…" : "Duplicate"}
                  </button>
                  <a
                    href={`/cms/events/${event.id}/preview`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-[#0F1B14] hover:border-[#006B3F]/40"
                  >
                    <CmsIcon name="eye" />
                    Preview
                  </a>
                </>
              ) : null}
              <button
                type="submit"
                disabled={pending}
                className="btn-premium inline-flex items-center gap-2 rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
              >
                <CmsIcon name="check" />
                {pending ? "Saving…" : "Save event"}
              </button>
            </div>
          </div>
          </SidebarSection>
        </aside>
      </div>
    </form>
  );
}
