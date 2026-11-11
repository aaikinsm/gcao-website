"use client";

import { useEffect, useRef, useState } from "react";
import { CmsIcon } from "@/components/cms/CmsIcons";

type SpeechResult = { isFinal: boolean; 0: { transcript: string } };

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

export type DictationUpdate = { text: string; commit: boolean };

export type DictationPreview = { start: number; length: number };

export function insertPlainText(current: string, text: string, field: HTMLTextAreaElement | null) {
  const focused = Boolean(field && document.activeElement === field);
  const start = focused && field ? field.selectionStart : current.length;
  const end = focused && field ? field.selectionEnd : current.length;
  const next = current.slice(0, start) + text + current.slice(end);
  const cursor = start + text.length;
  if (field) {
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(cursor, cursor);
    });
  }
  return next;
}

export function applyDictation(
  current: string,
  text: string,
  commit: boolean,
  field: HTMLTextAreaElement | null,
  preview: { current: DictationPreview | null },
) {
  const mark = preview.current;
  const focused = Boolean(field && document.activeElement === field);
  const start = mark && mark.start <= current.length ? mark.start : focused && field ? field.selectionStart : current.length;
  const end =
    mark && mark.start <= current.length
      ? Math.min(current.length, mark.start + mark.length)
      : focused && field
        ? field.selectionEnd
        : current.length;
  const next = current.slice(0, start) + text + current.slice(end);
  const cursor = start + text.length;
  // #region agent log
  fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "C", location: "DictationButton.tsx:applyDictation", message: "html dictation apply", data: { commit, textLen: text.length, beforeLen: current.length, afterLen: next.length, usedMark: Boolean(mark && mark.start <= current.length) }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion
  preview.current = { start: commit ? cursor : start, length: commit ? 0 : text.length };
  if (field) {
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(cursor, cursor);
    });
  }
  return next;
}

export function DictationButton({
  onText,
  activeKey,
}: {
  onText: (update: DictationUpdate) => void;
  activeKey?: string;
}) {
  const [supported] = useState(() => Boolean(recognitionCtor()));
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const onTextRef = useRef(onText);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const keepListening = useRef(false);
  const pendingGuess = useRef("");

  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  const stop = (reason = "click") => {
    const pending = pendingGuess.current.trim();
    keepListening.current = false;
    pendingGuess.current = "";
    const recognition = recognitionRef.current;
    if (recognition) recognition.onresult = null;
    // #region agent log
    fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "DictationButton.tsx:stop", message: "stop dictation", data: { reason, pendingLen: pending.length, hadRecognition: Boolean(recognition) }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    if (pending) onTextRef.current({ text: `${pending} `, commit: true });
    recognition?.stop();
    setListening(false);
  };

  useEffect(() => {
    stop("activeKey");
    // Restarting after a mode change would keep the old field focused.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  useEffect(() => () => stop("unmount"), []);

  const start = () => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    onTextRef.current({ text: "", commit: true });
    setMessage("");
    const recognition = new Ctor();
    recognition.lang = "en-CA";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const listeningNow = keepListening.current;
      let finalPhrase = "";
      let interimPhrase = "";
      let empty = 0;
      if (listeningNow) {
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          const phrase = result[0]?.transcript.trim() ?? "";
          if (!phrase) {
            empty += 1;
            continue;
          }
          if (result.isFinal) finalPhrase += `${phrase} `;
          else interimPhrase = phrase;
        }
      }
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "B", location: "DictationButton.tsx:onresult", message: "speech result", data: { listeningNow, resultIndex: event.resultIndex, resultCount: event.results.length, empty, finalLen: finalPhrase.length, interimLen: interimPhrase.length }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
      if (!listeningNow) return;
      if (finalPhrase || interimPhrase) setMessage("");
      if (finalPhrase) {
        pendingGuess.current = "";
        onTextRef.current({ text: finalPhrase, commit: true });
      }
      if (interimPhrase) {
        pendingGuess.current = interimPhrase;
        onTextRef.current({ text: interimPhrase, commit: false });
      }
    };
    recognition.onerror = (event) => {
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "DictationButton.tsx:onerror", message: "speech error", data: { error: event.error, keepListening: keepListening.current, lang: recognition.lang }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        keepListening.current = false;
        setListening(false);
        setMessage("Allow the microphone to dictate.");
      } else if (event.error === "audio-capture") {
        keepListening.current = false;
        setListening(false);
        setMessage("No microphone was found.");
      } else if (event.error === "no-speech") {
        setMessage("No speech was heard. Check the selected microphone and speak again.");
        if (navigator.mediaDevices?.enumerateDevices) {
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const inputs = devices
              .filter((device) => device.kind === "audioinput")
              .map((device) => device.label || "(unlabeled)");
            // #region agent log
            fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "F", location: "DictationButton.tsx:devices", message: "audio input labels", data: { inputs, language: navigator.language, secure: window.isSecureContext }, timestamp: Date.now() }) }).catch(() => {});
            // #endregion
          }).catch(() => {});
        }
      }
    };
    recognition.onend = () => {
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "E", location: "DictationButton.tsx:onend", message: "speech ended", data: { keepListening: keepListening.current }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
      if (!keepListening.current) {
        setListening(false);
        return;
      }
      try {
        recognition.start();
      } catch {
        keepListening.current = false;
        setListening(false);
      }
    };
    recognitionRef.current = recognition;
    keepListening.current = true;
    try {
      recognition.start();
      setListening(true);
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "DictationButton.tsx:start", message: "recognition started", data: { lang: recognition.lang, continuous: recognition.continuous, interimResults: recognition.interimResults }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
    } catch {
      keepListening.current = false;
      setListening(false);
      setMessage("Dictation could not start.");
      // #region agent log
      fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "DictationButton.tsx:start", message: "recognition start threw", data: {}, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
    }
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        aria-pressed={listening}
        disabled={!supported}
        title={supported ? (listening ? "Stop dictation" : "Dictate") : "Dictation needs Chrome or Safari"}
        onClick={() => (listening ? stop() : start())}
        className={`inline-flex items-center gap-2 text-sm font-medium ${
          supported ? "text-[#0F1B14]" : "cursor-not-allowed text-[#0F1B14]/35"
        } ${listening ? "text-[#006B3F]" : ""}`}
      >
        <CmsIcon name="mic" />
        {listening ? "Stop" : "Dictate"}
      </button>
      {message ? <p className="text-xs text-red-700">{message}</p> : null}
      {supported ? null : (
        <p className="sr-only">Dictation needs Chrome or Safari</p>
      )}
    </span>
  );
}
