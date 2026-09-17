"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteImage } from "@/components/shared/SiteImage";
import type { UpcomingEventSlide } from "@/lib/events";

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

type Tokens = {
  panelBorder: string;
  eventOverlay: string;
  eventMeta: string;
  eventBody: string;
  eventLoc: string;
  sectionMuted: string;
};

interface UpcomingEventsSliderProps {
  events: UpcomingEventSlide[];
  basePath: string;
  tokens: Tokens;
}

export function UpcomingEventsSlider({ events, basePath, tokens }: UpcomingEventsSliderProps) {
  const [index, setIndex] = useState(0);
  const count = events.length;
  const allEventsHref = `${basePath}/events`;
  const showControls = count > 1;
  const current = events[index];

  const go = (next: number) => {
    if (!count) return;
    setIndex((next + count) % count);
  };

  if (count === 0) {
    return (
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border px-8 py-16 md:px-14 md:py-20 ${tokens.panelBorder}`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
          Upcoming
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
          No upcoming events right now
        </h2>
        <p className={`mt-5 max-w-xl leading-relaxed ${tokens.sectionMuted}`}>
          Check the events page for recent gatherings and new dates as they are posted.
        </p>
        <Link
          href={allEventsHref}
          className="link-arrow mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#FCD116]"
        >
          View all events <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      <div
        className={`relative overflow-hidden rounded-[2rem] border ${tokens.panelBorder}`}
        aria-roledescription="carousel"
        aria-label="Upcoming events"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {events.map((event) => (
            <article key={event.slug} className="relative min-h-[22rem] min-w-full">
              <SiteImage
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 h-full w-full"
                imageClassName="img-zoom"
                overlay={tokens.eventOverlay}
                sizes="100vw"
              />
              <div className="relative min-h-[22rem] max-w-xl px-8 py-16 text-white md:px-14 md:py-20">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
                  Upcoming
                </p>
                <h2
                  className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl"
                  style={display}
                >
                  <Link
                    href={`${basePath}/events/${event.slug}`}
                    className="hover:text-[#FCD116]"
                  >
                    {event.title}
                  </Link>
                </h2>
                <p className={`mt-3 text-sm ${tokens.eventMeta}`}>{event.dateLabel}</p>
                <p className={`mt-5 leading-relaxed ${tokens.eventBody}`}>{event.excerpt}</p>
                <p className={`mt-4 text-sm ${tokens.eventLoc}`}>{event.location}</p>
                <Link
                  href={allEventsHref}
                  className="link-arrow mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#FCD116]"
                >
                  View all events <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {showControls && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous event"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 md:left-5"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next event"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm hover:bg-black/55 md:right-5"
            >
              <span aria-hidden>→</span>
            </button>
          </>
        )}
      </div>

      {showControls && (
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Upcoming event slides">
          {events.map((event, i) => (
            <button
              key={event.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${event.title}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#FCD116]" : "w-2.5 bg-current opacity-25 hover:opacity-50"
              }`}
            />
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {current.title}
      </p>
    </div>
  );
}
