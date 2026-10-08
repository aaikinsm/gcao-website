"use client";

import { useState } from "react";

const pill =
  "rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#FCD116] hover:text-[#FCD116]";

export function ShareRow({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`${pill} inline-flex items-center gap-2`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="17" cy="7" r="2.2" />
          <circle cx="17" cy="17" r="2.2" />
          <path d="M8 11.2 14.8 8.2M8 12.8l6.8 3" />
        </svg>
        Share
      </button>
      {open ? (
        <>
          <button type="button" onClick={copy} className={pill}>
            {copied ? "Copied" : "Copy link"}
          </button>
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              {item.label}
            </a>
          ))}
        </>
      ) : null}
    </div>
  );
}
