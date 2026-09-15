"use client";

import { useActionState, useEffect, useState } from "react";
import { saveEventAction, type CmsActionState } from "@/app/cms/actions";
import { ImagePicker } from "@/components/cms/ImagePicker";
import { DeleteButton } from "@/components/cms/DeleteButton";
import { slugify, toDatetimeLocalValue } from "@/lib/slug";
import type { GcaoEvent } from "@/lib/events";

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";
const label = "text-sm font-medium text-[#0F1B14]";

export function EventForm({ event }: { event?: GcaoEvent }) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    saveEventAction,
    null,
  );
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(event));

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  return (
    <form action={formAction} className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_8px_40px_rgba(15,27,20,0.06)] md:p-10">
      {event && <input type="hidden" name="id" value={event.id} />}
      {state?.error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}

      <div>
        <label className={label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
          placeholder="Seniors Annual Picnic"
        />
      </div>

      <div>
        <label className={label} htmlFor="slug">
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
          className={field}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={label} htmlFor="starts_at">
            Starts
          </label>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={event ? toDatetimeLocalValue(event.startsAt) : ""}
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
            defaultValue={event?.endsAt ? toDatetimeLocalValue(event.endsAt) : ""}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          name="location"
          required
          defaultValue={event?.location ?? ""}
          className={field}
          placeholder="GCAO Resource Hub, 65 Mayall Avenue"
        />
      </div>

      <div>
        <label className={label} htmlFor="excerpt">
          Short excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          defaultValue={event?.excerpt ?? ""}
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="body">
          Details
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={event?.body ?? ""}
          className={field}
        />
      </div>

      <ImagePicker existingUrl={event?.imageUrl} existingAlt={event?.title} />

      <fieldset>
        <legend className={label}>Status</legend>
        <div className="mt-3 flex gap-3">
          {(["published", "draft"] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm capitalize"
            >
              <input
                type="radio"
                name="status"
                value={value}
                defaultChecked={(event?.status ?? "published") === value}
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
          className="btn-premium rounded-full bg-[#FCD116] px-8 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
        >
          {pending ? "Saving…" : event ? "Save event" : "Publish event"}
        </button>
      </div>
    </form>
  );
}
