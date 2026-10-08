"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { PostStatus } from "@/lib/post-status";

export type CmsListItem = {
  id: number;
  title: string;
  href: string;
  previewHref: string;
  status: PostStatus;
  meta: string;
  imageUrl: string;
};

export function CmsEntryList({
  items,
  empty,
}: {
  items: CmsListItem[];
  empty: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title…"
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none ring-[#006B3F]/30 focus:ring-2 md:max-w-md"
      />
      {filtered.length === 0 ? (
        <p className="mt-10 text-[#0F1B14]/50">{empty}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="flex items-stretch overflow-hidden rounded-3xl border border-black/10 bg-white transition-colors hover:border-[#006B3F]/40"
            >
              <Link href={item.href} className="flex min-w-0 flex-1 gap-4 p-3 md:p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-20 w-28 shrink-0 rounded-2xl object-cover md:h-24 md:w-36"
                />
                <div className="min-w-0 py-1">
                  <p className="truncate text-lg font-semibold tracking-tight">{item.title}</p>
                  <p className="mt-1 text-sm text-[#0F1B14]/50">{item.meta}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === "published"
                        ? "bg-[#006B3F]/10 text-[#006B3F]"
                        : item.status === "pending"
                          ? "bg-[#FCD116]/40 text-[#0F1B14]"
                          : "bg-black/5 text-[#0F1B14]/60"
                    }`}
                  >
                    {item.status === "pending" ? "Pending approval" : item.status}
                  </span>
                </div>
              </Link>
              <a
                href={item.previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center border-l border-black/10 px-4 text-sm font-semibold text-[#006B3F] hover:bg-[#006B3F]/5"
              >
                Preview
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
