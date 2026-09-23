"use client";

import { useActionState, useEffect, useState } from "react";
import {
  aiStatusAction,
  classifyArticleAction,
  generatePostImageAction,
  rewritePostAction,
  saveNewsAction,
  type CmsActionState,
} from "@/app/cms/actions";
import { ImagePicker } from "@/components/cms/ImagePicker";
import { DeleteButton } from "@/components/cms/DeleteButton";
import type { ArticleDraft } from "@/lib/cms-draft";
import { NEWS_KINDS, newsKindLabel, type GcaoNews, type NewsKind } from "@/lib/news-types";
import { slugify, toDatetimeLocalValue } from "@/lib/slug";

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";
const label = "text-sm font-medium text-[#0F1B14]";
const topics = ["Health", "Community", "Culture"] as const;

export function NewsForm({ article, draft }: { article?: GcaoNews; draft?: ArticleDraft }) {
  const [state, formAction, pending] = useActionState<CmsActionState, FormData>(
    saveNewsAction,
    null,
  );
  const [title, setTitle] = useState(article?.title ?? draft?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [kind, setKind] = useState<NewsKind>(article?.kind ?? draft?.kind ?? "news");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? draft?.excerpt ?? "");
  const [body, setBody] = useState(article?.body ?? draft?.body ?? "");
  const [imageUrl, setImageUrl] = useState(draft?.imageUrl ?? article?.imageUrl ?? "");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiBusy, setAiBusy] = useState<"rewrite" | "kind" | "image" | null>(null);
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
    data.set("postType", "update");
    data.set("title", title);
    data.set("excerpt", excerpt);
    data.set("body", body);
    const result = await rewritePostAction(data);
    setAiBusy(null);
    if (result.error) {
      setAiError(result.error);
      return;
    }
    if (result.title) setTitle(result.title);
    if (result.excerpt) setExcerpt(result.excerpt);
    if (result.body) setBody(result.body);
    if (result.kind) setKind(result.kind);
  };

  const runClassify = async () => {
    setAiBusy("kind");
    setAiError("");
    const data = new FormData();
    data.set("title", title);
    data.set("excerpt", excerpt);
    data.set("body", body);
    const result = await classifyArticleAction(data);
    setAiBusy(null);
    if (result.error) {
      setAiError(result.error);
      return;
    }
    if (result.kind) setKind(result.kind);
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
    <form action={formAction} className="space-y-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_8px_40px_rgba(15,27,20,0.06)] md:p-10">
      {article && <input type="hidden" name="id" value={article.id} />}
      <input type="hidden" name="kind" value={kind} />
      {state?.error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      )}
      {aiError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {aiError}
        </p>
      )}

      {aiEnabled && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runRewrite()}
            disabled={Boolean(aiBusy)}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#006B3F]/40 disabled:opacity-50"
          >
            {aiBusy === "rewrite" ? "Rewriting…" : "Rewrite with AI"}
          </button>
          <button
            type="button"
            onClick={() => void runClassify()}
            disabled={Boolean(aiBusy)}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:border-[#006B3F]/40 disabled:opacity-50"
          >
            {aiBusy === "kind" ? "Suggesting…" : "Suggest category"}
          </button>
        </div>
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

      <fieldset>
        <legend className={label}>Type</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {NEWS_KINDS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                kind === value
                  ? "border-[#006B3F] bg-[#006B3F] text-white"
                  : "border-black/10 hover:border-[#006B3F]/40"
              }`}
            >
              {newsKindLabel(value)}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={label} htmlFor="category">
            Topic
          </label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? draft?.category ?? "Community"}
            className={field}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
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
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
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
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={field}
        />
      </div>

      <ImagePicker
        existingUrl={article?.imageUrl}
        existingAlt={title || article?.title}
        generatedUrl={imageUrl !== article?.imageUrl ? imageUrl : undefined}
        onGenerate={aiEnabled ? () => void runImage() : undefined}
        generatePending={aiBusy === "image"}
        generateEnabled={title.length >= 3}
      />

      <fieldset>
        <legend className={label}>Status</legend>
        <div className="mt-3 flex gap-3">
          {(["draft", "published"] as const).map((value) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-[#FFFBF2] px-4 py-2 text-sm capitalize"
            >
              <input
                type="radio"
                name="status"
                value={value}
                defaultChecked={(article?.status ?? "draft") === value}
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
          {pending ? "Saving…" : "Save article"}
        </button>
      </div>
    </form>
  );
}
