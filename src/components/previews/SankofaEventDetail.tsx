import type { ReactNode } from "react";
import Link from "next/link";
import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { FormattedBody } from "@/components/shared/FormattedBody";
import { ShareRow } from "@/components/shared/ShareRow";
import { formatEventDateRange, type GcaoEvent } from "@/lib/events";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaEventDetailProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
  event: GcaoEvent;
  notice?: ReactNode;
  shareUrl?: string;
}

export function SankofaEventDetail({
  theme,
  optionLabel,
  basePath,
  event,
  notice,
  shareUrl,
}: SankofaEventDetailProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";

  return (
    <div className={`${sora.variable} ${t.page}`}>
      {notice ? (
        <div className="sticky top-0 z-[70] flex h-9 items-center justify-center bg-[#FCD116] px-4 text-center text-xs font-medium text-[#06110D] sm:text-sm">
          {notice}
        </div>
      ) : null}
      <PreviewBanner option={optionLabel} topClass={notice ? "top-9" : "top-0"} />

      <SankofaHeader
        theme={theme}
        basePath={basePath}
        headerClass={t.header}
        logoTextClass={t.logoText}
        navClass={t.nav}
        donateClass={t.donateOutline}
        menuBgClass={t.menuBg}
        topClass={notice ? "top-[72px]" : "top-[36px]"}
        menuTopClass={notice ? "top-[calc(72px+4.25rem)]" : "top-[calc(36px+4.25rem)]"}
      />

      <section
        className={`relative min-h-[52vh] overflow-hidden ${
          notice ? "pt-[calc(72px+4.25rem)]" : "pt-[calc(36px+4.25rem)]"
        }`}
      >
        <SiteImage
          src={event.imageUrl}
          alt={event.title}
          className="absolute inset-0"
          imageClassName="object-cover"
          overlay={t.eventOverlay}
          sizes="100vw"
          priority
        />
        <div className="relative mx-auto flex min-h-[52vh] max-w-4xl flex-col justify-end px-6 pb-16 pt-24 md:px-10 md:pb-20">
          <Link
            href={`${basePath}/events`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#FCD116]"
          >
            ← All events
          </Link>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
            Event
          </p>
          <h1
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance text-white md:text-6xl"
            style={display}
          >
            {event.title}
          </h1>
          <p className={`mt-5 text-sm ${t.eventMeta}`}>
            {formatEventDateRange(event.startsAt, event.endsAt)}
          </p>
          <p className={`mt-2 text-sm ${t.eventLoc}`}>{event.location}</p>
          {shareUrl ? <ShareRow url={shareUrl} title={event.title} /> : null}
        </div>
      </section>

      <article className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className={`text-lg leading-relaxed ${t.sectionMuted}`}>{event.excerpt}</p>
          <FormattedBody
            text={event.body}
            className={`mt-10 text-base leading-relaxed ${t.cardMuted}`}
          />
          <Link
            href={`${basePath}/events`}
            className={`link-arrow mt-14 inline-flex items-center gap-2 text-sm font-semibold ${
              isLight ? "text-[#006B3F]" : "text-[#FCD116]"
            }`}
          >
            Back to events <span aria-hidden>→</span>
          </Link>
        </div>
      </article>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
