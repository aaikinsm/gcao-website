"use client";

import { useActionState, useEffect, useState } from "react";
import { saveNewsAction, type CmsActionState } from "@/app/cms/actions";
import { ImagePicker } from "@/components/cms/ImagePicker";
import { DeleteButton } from "@/components/cms/DeleteButton";
import { slugify, toDatetimeLocalValue } from "@/lib/slug";
import type { GcaoNews } from "@/lib/news";

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";
const label = "text-sm font-medium text-[#0F1B14]";
const categories = ["Health", "Community", "Culture"] as const;

export function NewsForm({ article }: { article?: GcaoNews }) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    saveNewsAction,
    null,
  );
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  return (
    <form action={formAction} className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_8px_40px_rgba(15,27,20,0.06)] md:p-10">
      {article && <input type="hidden" name="id" value={article.id} />}
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
          <label className={label} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? "Community"}
            className={field}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="published_at">
            Published
          </label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            required
            defaultValue={
              article ? toDatetimeLocalValue(article.publishedAt) : toDatetimeLocalValue(new Date())
            }
            className={field}
          />
        </div>
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
          defaultValue={article?.excerpt ?? ""}
          className={field}
        />
      </div>

      <div>
        <label className={label} htmlFor="body">
          Article
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          defaultValue={article?.body ?? ""}
          className={field}
        />
      </div>

      <ImagePicker existingUrl={article?.imageUrl} existingAlt={article?.title} />

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
                defaultChecked={(article?.status ?? "published") === value}
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {article ? <DeleteButton id={article.id} kind="news" title={article.title} /> : <span />}
        <button
          type="submit"
          disabled={pending}
          className="btn-premium rounded-full bg-[#FCD116] px-8 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
        >
          {pending ? "Saving…" : article ? "Save article" : "Publish article"}
        </button>
      </div>
    </form>
  );
}
