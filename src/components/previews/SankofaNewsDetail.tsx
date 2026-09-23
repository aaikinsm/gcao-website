import Link from "next/link";
import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { newsKindLabel, type GcaoNews } from "@/lib/news-types";

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
}

export function SankofaNewsDetail({
  theme,
  optionLabel,
  basePath,
  article,
}: SankofaNewsDetailProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const paragraphs = article.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

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

      <section className="relative min-h-[52vh] overflow-hidden pt-[calc(36px+4.25rem)]">
        <SiteImage
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0"
          imageClassName="object-cover"
          overlay={t.eventOverlay}
          sizes="100vw"
          priority
        />
        <div className="relative mx-auto flex min-h-[52vh] max-w-4xl flex-col justify-end px-6 pb-16 pt-24 md:px-10 md:pb-20">
          <Link
            href={`${basePath}/news`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#FCD116]"
          >
            ← All updates
          </Link>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
            {newsKindLabel(article.kind)}
          </p>
          <h1
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance text-white md:text-6xl"
            style={display}
          >
            {article.title}
          </h1>
          <p className={`mt-5 text-sm ${t.eventMeta}`}>{dateFmt.format(article.publishedAt)}</p>
        </div>
      </section>

      <article className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className={`text-lg leading-relaxed ${t.sectionMuted}`}>{article.excerpt}</p>
          <div className={`mt-10 space-y-6 text-base leading-relaxed ${t.cardMuted}`}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
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

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
