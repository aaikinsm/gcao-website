"use client";

import { useEffect, useState } from "react";
import {
  aiStatusAction,
  draftFromNotesAction,
  extractFromUploadAction,
} from "@/app/cms/actions";
import { EventForm } from "@/components/cms/EventForm";
import { NewsForm } from "@/components/cms/NewsForm";
import type { AiComposeResult, ArticleDraft, EventDraft } from "@/lib/cms-draft";

type StartMethod = "write" | "flyer" | "notes";
type WriteType = "event" | "update";
type Screen = "start" | "write-type" | "flyer" | "notes" | "form";

const card =
  "rounded-[2rem] border border-black/10 bg-white p-6 text-left transition-colors hover:border-[#006B3F]/40 md:p-8";

export function ComposeChooser() {
  const [screen, setScreen] = useState<Screen>("start");
  const [writeType, setWriteType] = useState<WriteType>("update");
  const [eventDraft, setEventDraft] = useState<EventDraft>({});
  const [articleDraft, setArticleDraft] = useState<ArticleDraft>({ kind: "news" });
  const [notes, setNotes] = useState("");
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
    if (method === "notes") setScreen("notes");
  };

  const readFile = async (form: HTMLFormElement) => {
    setBusy(true);
    setError("");
    const data = new FormData(form);
    const file = data.get("source");
    const fileMeta =
      file instanceof File
        ? { name: file.name, type: file.type, size: file.size, over1mb: file.size > 1_000_000 }
        : { name: "", type: typeof file, size: 0, over1mb: false };
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" },
      body: JSON.stringify({
        sessionId: "92ff33",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "ComposeChooser.tsx:readFile",
        message: "flyer selected before server action",
        data: fileMeta,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    try {
      const result = await extractFromUploadAction(data);
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" },
        body: JSON.stringify({
          sessionId: "92ff33",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "ComposeChooser.tsx:readFile:success",
          message: "server action returned",
          data: { hasError: Boolean(result.error), postType: result.postType ?? null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setBusy(false);
      applyResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" },
        body: JSON.stringify({
          sessionId: "92ff33",
          runId: "pre-fix",
          hypothesisId: "E",
          location: "ComposeChooser.tsx:readFile:catch",
          message: "server action threw before handler",
          data: { message: message.slice(0, 240) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setBusy(false);
      setError(message);
    }
  };

  const draftNotes = async () => {
    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("notes", notes);
    const result = await draftFromNotesAction(data);
    setBusy(false);
    applyResult(result);
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
        <div className="grid gap-4 md:grid-cols-3">
          <button type="button" className={card} onClick={() => pickStart("write")}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">Write it</p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Fill in the form yourself</p>
            <p className="mt-2 text-sm text-[#0F1B14]/55">Use the current fields. No AI required.</p>
          </button>
          <button
            type="button"
            className={card}
            onClick={() => pickStart("flyer")}
            disabled={!aiEnabled}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
              Upload a flyer
            </p>
            <p className="mt-3 text-xl font-semibold tracking-tight">Read a photo or PDF</p>
            <p className="mt-2 text-sm text-[#0F1B14]/55">
              {aiEnabled
                ? "We’ll draft the post from the flyer. You still review and publish."
                : "Add an OpenAI key on this computer to use this."}
            </p>
          </button>
          <button
            type="button"
            className={card}
            onClick={() => pickStart("notes")}
            disabled={!aiEnabled}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
              Describe it
            </p>
            <p className="mt-3 text-xl font-semibold tracking-tight">A few notes, then a draft</p>
            <p className="mt-2 text-sm text-[#0F1B14]/55">
              {aiEnabled
                ? "We’ll write polished copy and suggest News, Notice, or Story."
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

      {screen === "notes" && (
        <div className="rounded-[2rem] border border-black/10 bg-white p-6 md:p-10">
          <button
            type="button"
            onClick={() => setScreen("start")}
            className="mb-6 text-sm font-semibold text-[#006B3F]"
          >
            ← Back
          </button>
          <label className="block text-sm font-medium" htmlFor="notes">
            What should this post say?
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="mt-3 w-full rounded-2xl border border-black/10 px-4 py-3 outline-none ring-[#006B3F]/30 focus:ring-2"
              placeholder="Seniors picnic at the Resource Hub, Saturday afternoon, bring a dish…"
            />
          </label>
          <button
            type="button"
            onClick={() => void draftNotes()}
            disabled={busy}
            className="btn-premium mt-8 rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D] disabled:opacity-60"
          >
            {busy ? "Drafting…" : "Draft this"}
          </button>
        </div>
      )}
    </div>
  );
}
