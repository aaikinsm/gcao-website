"use client";

import { useState } from "react";
import Link from "next/link";
import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { NEWS_KINDS, newsKindLabel, type GcaoNews, type NewsKind } from "@/lib/news-types";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  month: "short",
  day: "numeric",
  year: "numeric",
});

interface SankofaNewsProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
  articles: GcaoNews[];
}

export function SankofaNews({ theme, optionLabel, basePath, articles }: SankofaNewsProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const [filter, setFilter] = useState<"all" | NewsKind>("all");
  const chipHover = isLight
    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
    : "hover:border-[#FCD116] hover:text-[#FCD116]";
  const hoverOverlay = isLight
    ? "bg-gradient-to-t from-[#006B3F]/55 via-[#006B3F]/15 to-transparent"
    : "bg-gradient-to-t from-black/70 via-[#FCD116]/15 to-transparent";
  const titleHover = isLight ? "group-hover:text-[#006B3F]" : "group-hover:text-[#FCD116]";
  const visible = filter === "all" ? articles : articles.filter((item) => item.kind === filter);

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
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>Updates</p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          News from {siteContent.orgShort}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Community reports, short notices, and stories from the Ghanaian-Canadian Association of
          Ontario.
        </p>
      </SankofaKenteHero>

      <nav
        aria-label="Update types"
        className={`sticky top-[calc(36px+4.25rem)] z-40 border-b backdrop-blur-xl ${
          isLight ? "border-black/10 bg-[#FFFBF2]/90" : "border-white/[0.08] bg-[#06110D]/90"
        }`}
      >
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-3 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["all", ...NEWS_KINDS] as const).map((item) => {
            const active = filter === item;
            const label = item === "all" ? "All" : newsKindLabel(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? isLight
                      ? "border-[#006B3F] bg-[#006B3F] text-white"
                      : "border-[#FCD116] bg-[#FCD116] text-[#06110D]"
                    : `${t.panelBorder} ${chipHover}`
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          {visible.length === 0 ? (
            <p className={`text-base ${t.sectionMuted}`}>
              No published updates in this category right now.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {visible.map((article) => (
                <article
                  key={article.slug}
                  className={`group overflow-hidden rounded-3xl border ${t.card} ${t.panelBorder}`}
                >
                  <Link href={`${basePath}/news/${article.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <SiteImage
                        src={article.imageUrl}
                        alt={article.title}
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
                        {newsKindLabel(article.kind)} · {dateFmt.format(article.publishedAt)}
                      </p>
                      <h2
                        className={`mt-3 text-xl font-semibold tracking-tight transition-colors md:text-2xl ${titleHover}`}
                        style={display}
                      >
                        {article.title}
                      </h2>
                      <p className={`mt-3 text-sm leading-relaxed ${t.cardMuted}`}>{article.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
