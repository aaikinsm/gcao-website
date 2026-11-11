import type { ReactNode } from "react";
import Link from "next/link";
import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { FormattedBody } from "@/components/shared/FormattedBody";
import { PostAttachmentsView, PostVideo } from "@/components/previews/PostMedia";
import { ShareRow } from "@/components/shared/ShareRow";
import { newsCover, newsTypeLabel, type GcaoNews } from "@/lib/news-types";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  month: "long",
  day: "numeric",
  year: "numeric",
});

interface SankofaNewsDetailProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
  article: GcaoNews;
  notice?: ReactNode;
  shareUrl?: string;
}

export function SankofaNewsDetail({
  theme,
  optionLabel,
  basePath,
  article,
  notice,
  shareUrl,
}: SankofaNewsDetailProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const cover = newsCover(article.kind, article.imageUrl);

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
        className={`relative overflow-hidden ${cover ? "min-h-[52vh]" : "bg-[#06110D]"} ${
          notice ? "pt-[calc(72px+4.25rem)]" : "pt-[calc(36px+4.25rem)]"
        }`}
      >
        {cover ? (
          <SiteImage
            src={cover}
            alt={article.title}
            className="absolute inset-0"
            imageClassName="object-cover"
            overlay={t.eventOverlay}
            sizes="100vw"
            priority
          />
        ) : null}
        <div
          className={`relative mx-auto flex max-w-4xl flex-col justify-end px-6 pb-16 pt-24 md:px-10 md:pb-20 ${
            cover ? "min-h-[52vh]" : ""
          }`}
        >
          <Link
            href={`${basePath}/news`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#FCD116]"
          >
            ← All updates
          </Link>
          <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
            {newsTypeLabel(article.kind, article.category)}
          </p>
          <h1
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance text-white md:text-6xl"
            style={display}
          >
            {article.title}
          </h1>
          <p className={`mt-5 text-sm ${t.eventMeta}`}>{dateFmt.format(article.publishedAt)}</p>
          {shareUrl ? <ShareRow url={shareUrl} title={article.title} /> : null}
        </div>
      </section>

      <article className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          {article.kind === "publication" ? null : (
            <p className={`text-lg leading-relaxed ${t.sectionMuted}`}>{article.excerpt}</p>
          )}
          <PostVideo youtubeId={article.youtubeId} />
          <FormattedBody
            text={article.body}
            html={article.bodyMode === "html"}
            className={`mt-10 text-base leading-relaxed ${t.cardMuted} [&_a]:font-semibold [&_a]:underline ${
              isLight ? "[&_a]:text-[#006B3F]" : "[&_a]:text-[#FCD116]"
            }`}
          />
          <PostAttachmentsView
            attachments={article.attachments}
            linkClass={isLight ? "text-[#006B3F]" : "text-[#FCD116]"}
          />
          <Link
            href={`${basePath}/news`}
            className={`link-arrow mt-14 inline-flex items-center gap-2 text-sm font-semibold ${
              isLight ? "text-[#006B3F]" : "text-[#FCD116]"
            }`}
          >
            Back to updates <span aria-hidden>→</span>
          </Link>
        </div>
      </article>

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
