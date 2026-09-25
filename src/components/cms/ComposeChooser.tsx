"use client";

import { useEffect, useState } from "react";
import { aiStatusAction, extractFromUploadAction } from "@/app/cms/actions";
import { EventForm } from "@/components/cms/EventForm";
import { NewsForm } from "@/components/cms/NewsForm";
import type { AiComposeResult, ArticleDraft, EventDraft } from "@/lib/cms-draft";

type StartMethod = "write" | "flyer";
type WriteType = "event" | "update";
type Screen = "start" | "write-type" | "flyer" | "form";

const card =
  "rounded-[2rem] border border-black/10 bg-white p-6 text-left transition-colors hover:border-[#006B3F]/40 md:p-8";

export function ComposeChooser() {
  const [screen, setScreen] = useState<Screen>("start");
  const [writeType, setWriteType] = useState<WriteType>("update");
  const [eventDraft, setEventDraft] = useState<EventDraft>({});
  const [articleDraft, setArticleDraft] = useState<ArticleDraft>({ kind: "news" });
  const [aiEnabled, setAiEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void aiStatusAction().then((status) => setAiEnabled(status.enabled));
  }, []);

  const applyResult = (result: AiComposeResult) => {
    if (result.error) {
      setError(result.error);
      return false;
    }
    if (result.postType === "event") {
      setWriteType("event");
      setEventDraft({
        title: result.title,
        excerpt: result.excerpt,
        body: result.body,
        location: result.location,
        startsAt: result.startsAt,
        endsAt: result.endsAt,
        imageUrl: result.imageUrl,
      });
    } else {
      setWriteType("update");
      setArticleDraft({
        title: result.title,
        excerpt: result.excerpt,
        body: result.body,
        kind: result.kind ?? "news",
        category: result.category,
        imageUrl: result.imageUrl,
      });
    }
    setScreen("form");
    return true;
  };

  const pickStart = (method: StartMethod) => {
    setError("");
    if (method === "write") setScreen("write-type");
    if (method === "flyer") setScreen("flyer");
  };

  const readFile = async (form: HTMLFormElement) => {
    setBusy(true);
    setError("");
    const data = new FormData(form);
    try {
      const result = await extractFromUploadAction(data);
      setBusy(false);
      applyResult(result);
    } catch (error) {
      setBusy(false);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  if (screen === "form") {
    return writeType === "event" ? <EventForm draft={eventDraft} /> : <NewsForm draft={articleDraft} />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {screen === "start" && (
        <div className="grid gap-4 md:grid-cols-2">
          <button type="button" className={card} onClick={() => pickStart("write")}>
            <IconPencil />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">Write it</p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Fill the form, or jot notes</p>
            <p className="mt-2 text-sm text-[#0F1B14]/55">
              Use the fields yourself, or drop rough notes and use Rewrite with AI.
            </p>
          </button>
          <button
            type="button"
            className={card}
            onClick={() => pickStart("flyer")}
            disabled={!aiEnabled}
          >
            <IconImage />
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
              Upload a flyer
            </p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Read a photo or PDF</p>
            <p className="mt-2 text-sm text-[#0F1B14]/55">
              {aiEnabled
                ? "We’ll draft the post from the flyer. You still review and publish."
                : "Add an OpenAI key on this computer to use this."}
            </p>
          </button>
        </div>
      )}

      {screen === "write-type" && (
        <div>
          <button
            type="button"
            onClick={() => setScreen("start")}
            className="mb-6 text-sm font-semibold text-[#006B3F]"
          >
            ← Back
          </button>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              className={card}
              onClick={() => {
                setWriteType("event");
                setEventDraft({});
                setScreen("form");
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">Event</p>
              <p className="mt-3 text-xl font-semibold tracking-tight">A gathering with a date and place</p>
            </button>
            <button
              type="button"
              className={card}
              onClick={() => {
                setWriteType("update");
                setArticleDraft({ kind: "news" });
                setScreen("form");
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">Update</p>
              <p className="mt-3 text-xl font-semibold tracking-tight">News, a notice, or a story</p>
            </button>
          </div>
        </div>
      )}

      {screen === "flyer" && (
        <form
          className="rounded-[2rem] border border-black/10 bg-white p-6 md:p-10"
          onSubmit={(event) => {
            event.preventDefault();
            void readFile(event.currentTarget);
          }}
        >
          <button
            type="button"
            onClick={() => setScreen("start")}
            className="mb-6 text-sm font-semibold text-[#006B3F]"
          >
            ← Back
          </button>
          <label className="block text-sm font-medium">
            Flyer or document
            <input
              type="file"
              name="source"
              required
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#006B3F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="btn-premium mt-8 rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
          >
            {busy ? "Reading…" : "Read this file"}
          </button>
        </form>
      )}
    </div>
  );
}

function IconPencil() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006B3F]/10 text-[#006B3F]" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
        <path d="M13.5 6.5l3 3" />
      </svg>
    </span>
  );
}

function IconImage() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006B3F]/10 text-[#006B3F]" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="M21 16l-5.5-5.5L7 19" />
      </svg>
    </span>
  );
}
