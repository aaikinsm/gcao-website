import Link from "next/link";
import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import {
  formatEventDateRange,
  splitEvents,
  type GcaoEvent,
} from "@/lib/events";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const eventsNav = [
  { label: "Upcoming", href: "#upcoming" },
  { label: "Past", href: "#past" },
];

interface SankofaEventsProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
  events: GcaoEvent[];
}

export function SankofaEvents({ theme, optionLabel, basePath, events }: SankofaEventsProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const { upcoming, past } = splitEvents(events);
  const chipHover = isLight
    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
    : "hover:border-[#FCD116] hover:text-[#FCD116]";
  const hoverOverlay = isLight
    ? "bg-gradient-to-t from-[#006B3F]/55 via-[#006B3F]/15 to-transparent"
    : "bg-gradient-to-t from-black/70 via-[#FCD116]/15 to-transparent";
  const titleHover = isLight ? "group-hover:text-[#006B3F]" : "group-hover:text-[#FCD116]";

  return (
    <div className={`${sora.variable} ${t.page}`}>
      <PreviewBanner option={optionLabel} />

      <SankofaHeader
        theme={theme}
        basePath={basePath}
        headerClass={t.header}
        logoTextClass={t.logoText}
        navClass={t.nav}
        donateClass={t.donateOutline}
        menuBgClass={t.menuBg}
      />

      <SankofaKenteHero theme={theme}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
          Events
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          Gather with {siteContent.orgShort}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Upcoming gatherings and past celebrations from the Ghanaian-Canadian community across
          Ontario — lectures, picnics, language classes, and cultural nights.
        </p>
      </SankofaKenteHero>

      <nav
        aria-label="Event sections"
        className={`sticky top-[calc(36px+4.25rem)] z-40 border-b backdrop-blur-xl ${
          isLight ? "border-black/10 bg-[#FFFBF2]/90" : "border-white/[0.08] bg-[#06110D]/90"
        }`}
      >
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-3 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {eventsNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${t.panelBorder} ${chipHover}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {events.length === 0 ? (
        <AnimatedSection className="px-6 py-24 md:px-10 md:py-32">
          <p className={`mx-auto max-w-6xl text-base ${t.sectionMuted}`}>
            No published events are available right now. Please check back soon.
          </p>
        </AnimatedSection>
      ) : (
        <>
          <EventGroup
            id="upcoming"
            eyebrow="Upcoming"
            title="What’s next"
            empty="No upcoming events are on the calendar right now."
            events={upcoming}
            basePath={basePath}
            theme={theme}
            hoverOverlay={hoverOverlay}
            titleHover={titleHover}
          />
          <EventGroup
            id="past"
            eyebrow="Past"
            title="From the archive"
            empty="Past events will appear here."
            events={past}
            basePath={basePath}
            theme={theme}
            hoverOverlay={hoverOverlay}
            titleHover={titleHover}
            muted
          />
        </>
      )}

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}

function EventGroup({
  id,
  eyebrow,
  title,
  empty,
  events,
  basePath,
  theme,
  hoverOverlay,
  titleHover,
  muted = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  empty: string;
  events: GcaoEvent[];
  basePath: string;
  theme: SankofaTheme;
  hoverOverlay: string;
  titleHover: string;
  muted?: boolean;
}) {
  const t = sankofaThemes[theme];

  return (
    <AnimatedSection
      id={id}
      className={`px-6 py-24 md:px-10 md:py-32 ${muted ? `border-t ${t.statsWrap}` : ""}`}
    >
      <div className="mx-auto max-w-6xl">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
          {title}
        </h2>
        {events.length === 0 ? (
          <p className={`mt-8 max-w-xl text-base ${t.sectionMuted}`}>{empty}</p>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {events.map((event) => (
              <article
                key={event.slug}
                className={`group overflow-hidden rounded-3xl border ${t.card} ${t.panelBorder}`}
              >
                <Link href={`${basePath}/events/${event.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <SiteImage
                      src={event.imageUrl}
                      alt={event.title}
                      className="absolute inset-0 h-full w-full"
                      imageClassName="img-zoom"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
                      aria-hidden
                    />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className={`text-sm ${t.sectionMuted}`}>
                      {formatEventDateRange(event.startsAt, event.endsAt)}
                    </p>
                    <h3
                      className={`mt-3 text-xl font-semibold tracking-tight transition-colors md:text-2xl ${titleHover}`}
                      style={display}
                    >
                      {event.title}
                    </h3>
                    <p className={`mt-3 text-sm leading-relaxed ${t.cardMuted}`}>{event.excerpt}</p>
                    <p className={`mt-4 text-sm ${t.sectionMuted}`}>{event.location}</p>
                    <p
                      className={`link-arrow mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                        theme === "light" ? "text-[#006B3F]" : "text-[#FCD116]"
                      }`}
                    >
                      Event details <span aria-hidden>→</span>
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
