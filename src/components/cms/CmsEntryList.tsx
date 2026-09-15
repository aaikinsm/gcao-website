"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type CmsListItem = {
  id: number;
  title: string;
  href: string;
  status: "draft" | "published";
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
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex gap-4 overflow-hidden rounded-3xl border border-black/10 bg-white p-3 transition-colors hover:border-[#006B3F]/40 md:p-4"
              >
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
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      item.status === "published"
                        ? "bg-[#006B3F]/10 text-[#006B3F]"
                        : "bg-black/5 text-[#0F1B14]/60"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
