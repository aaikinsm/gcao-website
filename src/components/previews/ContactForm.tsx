"use client";

import type { FormEvent } from "react";

interface ContactFormProps {
  email: string;
  isLight: boolean;
}

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function ContactForm({ email, isLight }: ContactFormProps) {
  const field =
    "mt-2 w-full bg-transparent px-0 py-3 text-base outline-none border-b transition-colors " +
    (isLight
      ? "border-black/15 placeholder:text-[#0F1B14]/30 focus:border-[#006B3F]"
      : "border-white/20 placeholder:text-[#EFEDE4]/30 focus:border-[#FCD116]");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const lines = [`Name: ${name}`, `Email: ${from}`];
    if (phone) lines.push(`Phone: ${phone}`);
    lines.push("", message);
    const body = lines.join("\n");
    const href = `mailto:${email}?subject=${encodeURIComponent(`GCAO website message from ${name}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  return (
    <form onSubmit={onSubmit} className="mt-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm">
          <span className={isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55"}>Name</span>
          <input name="name" type="text" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          <span className={isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55"}>Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="mt-6 block text-sm">
        <span className={isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55"}>
          Phone <span className="opacity-60">(optional)</span>
        </span>
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="mt-6 block text-sm">
        <span className={isLight ? "text-[#0F1B14]/55" : "text-[#EFEDE4]/55"}>Message</span>
        <textarea name="message" required rows={6} className={`${field} resize-y`} />
      </label>
      <button
        type="submit"
        className={`btn-premium mt-10 rounded-full px-8 py-3.5 text-sm font-semibold ${
          isLight ? "bg-[#006B3F] text-white" : "bg-[#FCD116] text-[#06110D]"
        }`}
        style={display}
      >
        Write the email
      </button>
      <p className={`mt-4 text-sm leading-relaxed ${isLight ? "text-[#0F1B14]/50" : "text-[#EFEDE4]/50"}`}>
        This opens your email app with the message ready to send.
      </p>
    </form>
  );
}
