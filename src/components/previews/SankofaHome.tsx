import { Sora } from "next/font/google";
import { AnimatedHeadline } from "@/components/shared/AnimatedHeadline";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { ScrollFillText } from "@/components/shared/ScrollFillText";
import { SiteImage } from "@/components/shared/SiteImage";
import { VideoHero } from "@/components/shared/VideoHero";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { ServePanels } from "@/components/previews/ServePanels";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteContent } from "@/lib/content";
import { newsImages, siteImages } from "@/lib/images";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const panels = [
  {
    title: siteContent.pillars[0].title,
    description: siteContent.pillars[0].description,
    video: "/videos/serve-programs.mp4",
    poster: "/videos/serve-programs-poster.jpg",
  },
  {
    title: siteContent.pillars[1].title,
    description: siteContent.pillars[1].description,
    video: "/videos/serve-advocacy.mp4",
    poster: "/videos/serve-advocacy-poster.jpg",
  },
  {
    title: siteContent.pillars[2].title,
    description: siteContent.pillars[2].description,
    video: "/videos/serve-volunteer.mp4",
    poster: "/videos/serve-volunteer-poster.jpg",
  },
];

interface SankofaHomeProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaHome({ theme, optionLabel, basePath }: SankofaHomeProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";

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

      <VideoHero
        src="/videos/gcao-sankofa-square.mp4"
        poster="/videos/gcao-sankofa-square-poster.jpg"
        youtubeId="Nw4i4UDQvPE"
        overlayClassName={t.videoOverlay}
      >
        <div className="mx-auto w-full max-w-4xl px-6 text-center md:px-10">
          <p
            className={`animate-fade-in text-[11px] font-semibold uppercase tracking-[0.32em] ${t.eyebrow}`}
          >
            {siteContent.orgShort}
          </p>
          <h1
            className="animate-blur-in mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-white md:text-6xl lg:text-[4.2rem]"
            style={display}
          >
            {siteContent.tagline}
          </h1>
          <p
            className={`animate-blur-in mx-auto mt-8 max-w-xl text-lg leading-relaxed md:text-xl ${t.heroSub}`}
          >
            <AnimatedHeadline
              before="Strengthening"
              words={["communities", "youth", "seniors", "families"]}
              after="across Ontario"
            />
          </p>
          <div
            className="animate-blur-in mt-12 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: "320ms" }}
          >
            <a
              href="#donate"
              className={`btn-premium rounded-full px-8 py-3.5 text-sm font-semibold ${t.ctaPrimary}`}
            >
              Support our work
            </a>
            <a
              href="#programs"
              className={`link-arrow btn-premium inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-colors ${t.ctaSecondary}`}
            >
              See programs <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </VideoHero>

      <div className={`border-y ${t.statsWrap}`}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 md:grid-cols-4 md:px-10">
          {siteContent.stats.map((stat) => (
            <div key={stat.label} className="px-4 py-14 text-center md:px-5">
              <p
                className={`text-3xl font-semibold md:text-4xl ${t.statsValue}`}
                style={display}
              >
                <CountUp value={stat.value} />
              </p>
              <p className={`mt-3 text-xs ${t.statsLabel}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatedSection
        id="about"
        className="relative overflow-hidden px-6 py-32 md:px-10 md:py-40"
      >
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-80 ${t.missionGlow}`} />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Our mission
          </p>
          <ScrollFillText
            text={siteContent.mission}
            className="mt-12 text-2xl leading-[1.5] tracking-tight md:text-[2.1rem] md:leading-[1.45]"
            mutedClassName={t.scrollMuted}
            filledClassName={t.scrollFilled}
          />
          <a
            href={`${basePath}/about`}
            className={`link-arrow btn-premium mt-10 inline-flex items-center gap-2 text-sm font-semibold ${
              isLight ? "text-[#006B3F]" : "text-[#FCD116]"
            }`}
          >
            Read more about GCAO <span aria-hidden>→</span>
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="px-6 pb-32 md:px-10 md:pb-40" delay={80}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
                Programs
              </p>
              <h2
                className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-5xl"
                style={display}
              >
                How we serve
              </h2>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <p className={`max-w-xs text-sm ${t.sectionMuted}`}>
                <AnimatedHeadline
                  before="Built for"
                  words={["youth", "seniors", "newcomers", "families"]}
                  after="across Ontario"
                  className="text-sm"
                />
              </p>
              <a
                href={`${basePath}/programs`}
                className={`link-arrow text-sm font-semibold ${
                  isLight ? "text-[#006B3F]" : "text-[#FCD116]"
                }`}
              >
                View all programs <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <ServePanels
            panels={panels}
            tokens={{
              panelBorder: t.panelBorder,
              panelOverlay: t.panelOverlay,
              panelHover: t.panelHover,
              panelDesc: t.panelDesc,
              panelPlus: t.panelPlus,
            }}
          />
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="px-6 pb-32 md:px-10 md:pb-40" delay={80}>
        <div
          className={`group relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border ${t.panelBorder}`}
        >
          <SiteImage
            {...siteImages.heroEvent}
            className="absolute inset-0"
            imageClassName="img-zoom"
            overlay={t.eventOverlay}
            sizes="100vw"
          />
          <div className="relative max-w-xl px-8 py-16 text-white md:px-14 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
              Upcoming
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              {siteContent.featuredEvent.title}
            </h2>
            <p className={`mt-3 text-sm ${t.eventMeta}`}>{siteContent.featuredEvent.date}</p>
            <p className={`mt-5 leading-relaxed ${t.eventBody}`}>
              {siteContent.featuredEvent.description}
            </p>
            <p className={`mt-4 text-sm ${t.eventLoc}`}>{siteContent.featuredEvent.location}</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="px-6 pb-32 md:px-10 md:pb-40" delay={80}>
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            News
          </p>
          <h2
            className="mt-4 text-3xl font-semibold tracking-[-0.02em] md:text-5xl"
            style={display}
          >
            From the community
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {siteContent.news.map((item, i) => (
              <article key={item.title} className="group">
                <SiteImage
                  {...newsImages[i]}
                  className="aspect-[16/10] overflow-hidden rounded-2xl"
                  imageClassName="img-zoom"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <p className={`mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] ${t.eyebrow}`}>
                  {item.tag}
                </p>
                <h3
                  className={`mt-3 text-lg font-semibold leading-snug tracking-tight transition-colors ${
                    isLight ? "group-hover:text-[#006B3F]" : "group-hover:text-[#FCD116]"
                  }`}
                  style={display}
                >
                  {item.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${t.newsExcerpt}`}>{item.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id="get-involved"
        className="relative overflow-hidden px-6 pb-32 md:px-10 md:pb-40"
        delay={80}
      >
        <div
          id="donate"
          className={`relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border px-8 py-20 text-center md:px-12 md:py-24 ${t.donateBox}`}
        >
          <div className={`pointer-events-none absolute inset-x-0 bottom-[-60%] h-[420px] ${t.donateGlow}`} />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl" style={display}>
              Get involved
            </h2>
            <p className={`mx-auto mt-6 max-w-lg leading-relaxed ${t.donateCopy}`}>
              Volunteer, become a member, or donate to keep programs running at the Resource Hub.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#contact"
                className={`btn-premium rounded-full px-8 py-3.5 text-sm font-semibold ${t.ctaPrimary}`}
              >
                Donate now
              </a>
              <a
                href="#contact"
                className={`btn-premium rounded-full px-8 py-3.5 text-sm font-semibold transition-colors ${t.donateSecondary}`}
              >
                Volunteer
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
