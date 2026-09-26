"use client";

import { useActionState, useEffect, useState } from "react";
import {
  aiStatusAction,
  generatePostImageAction,
  rewritePostAction,
  saveEventAction,
  type CmsActionState,
} from "@/app/cms/actions";
import { FormattedField } from "@/components/cms/FormattedField";
import { ImagePicker } from "@/components/cms/ImagePicker";
import { DeleteButton } from "@/components/cms/DeleteButton";
import type { EventDraft } from "@/lib/cms-draft";
import type { GcaoEvent } from "@/lib/events";
import { slugify, toDatetimeLocalValue } from "@/lib/slug";

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";
const label = "text-sm font-medium text-[#0F1B14]";
const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function EventForm({ event, draft }: { event?: GcaoEvent; draft?: EventDraft }) {
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
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              aria-label="Short summary"
              placeholder="Short summary…"
              className="mt-5 w-full resize-none border-0 bg-transparent text-lg leading-relaxed text-[#0F1B14]/70 outline-none placeholder:text-[#0F1B14]/35"
            />
            <FormattedField
              id="body"
              name="body"
              label="Details"
              value={body}
              onChange={setBody}
              plain
            />
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

        <aside className="space-y-6 rounded-[1.5rem] border border-black/10 bg-white p-5 lg:sticky lg:top-6">
          <ImagePicker
            existingUrl={event?.imageUrl}
            existingAlt={title || event?.title}
            generatedUrl={imageUrl !== event?.imageUrl ? imageUrl : undefined}
            onGenerate={aiEnabled ? () => void runImage() : undefined}
            generatePending={aiBusy === "image"}
            generateEnabled={title.length >= 3}
          />

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
          <div>
            <label className={label} htmlFor="ends_at">
              Ends (optional)
            </label>
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
              placeholder="GCAO Resource Hub, 65 Mayall Avenue"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#0F1B14]/55" htmlFor="slug">
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className="mt-2 w-full border-0 border-b border-black/10 bg-transparent px-0 py-2 text-sm text-[#0F1B14]/70 outline-none focus:border-[#006B3F]"
            />
          </div>

          <fieldset>
            <legend className={label}>Status</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["draft", "published"] as const).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm capitalize"
                >
                  <input
                    type="radio"
                    name="status"
                    value={value}
                    defaultChecked={(event?.status ?? "draft") === value}
                  />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {event ? <DeleteButton id={event.id} kind="event" title={event.title} /> : <span />}
            <button
              type="submit"
              disabled={pending}
              className="btn-premium rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save event"}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
