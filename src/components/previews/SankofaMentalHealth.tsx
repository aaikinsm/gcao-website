"use client";

import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SiteImage } from "@/components/shared/SiteImage";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { PostVideo } from "@/components/previews/PostMedia";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function SankofaMentalHealth() {
  const { theme, t, isLight, basePath } = useSankofaAppearance();
  const page = siteContent.mentalHealth;
  const link = isLight ? "text-[#006B3F] underline" : "text-[#FCD116] underline";
  const dot = isLight ? "bg-[#006B3F]" : "bg-[#FCD116]";
  const sections = [page.overview, page.training, page.reasons, page.resources, page.contact];

  return (
    <div className={`${sora.variable} ${t.page}`}>
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
        <p className={`text-[13px] uppercase tracking-[0.28em] ${t.heroEyebrow}`}>{page.eyebrow}</p>
        <h1
          className={`mt-5 max-w-4xl text-4xl tracking-[-0.03em] text-balance md:text-6xl ${t.heroTitle}`}
          style={display}
        >
          {page.title}
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.heroBody}`}>{page.intro}</p>
        <a
          href={`mailto:${page.inquiry.email}`}
          className={`btn-premium mt-8 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold ${t.ctaPrimary}`}
        >
          {page.inquiry.label}
        </a>
        <nav
          aria-label="Mental health sections"
          className={`mt-10 flex flex-wrap gap-3 text-sm font-medium ${t.heroTitle}`}
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`rounded-full border px-4 py-2 ${t.heroChip}`}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </SankofaKenteHero>

      <AnimatedSection id={page.overview.id} className="scroll-mt-28 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {page.overview.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              Program overview
            </h2>
            <div className={`mt-6 space-y-4 text-base leading-relaxed ${t.sectionMuted}`}>
              {page.overview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl lg:col-span-5">
            <SiteImage
              src={page.image}
              alt={page.alt}
              className="aspect-[4/3]"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className={`border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder}`}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            {page.video.heading}
          </h2>
          <PostVideo youtubeId={page.video.youtubeId} title={page.video.title} />
        </div>
      </AnimatedSection>

      <AnimatedSection
        id={page.training.id}
        className={`scroll-mt-28 border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder} ${t.band}`}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            {page.training.label}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            What Mental Health First Aid covers
          </h2>
          <p className={`mt-6 text-base leading-relaxed ${t.sectionMuted}`}>{page.training.definition}</p>
          <ul className={`mt-8 space-y-3 ${t.sectionMuted}`}>
            {page.training.topics.map((topic) => (
              <li key={topic} className="flex gap-3 text-base">
                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id={page.reasons.id}
        className={`scroll-mt-28 border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder}`}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            {page.reasons.label}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            Why you or your organization should take part
          </h2>
          <ul className={`mt-8 space-y-5 ${t.sectionMuted}`}>
            {page.reasons.items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-relaxed">
                <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id={page.resources.id}
        className={`scroll-mt-28 border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder} ${t.band}`}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            {page.resources.label}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            {page.resources.title}
          </h2>
          <p className={`mt-6 text-base leading-relaxed ${t.sectionMuted}`}>{page.resources.body}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection
        id={page.contact.id}
        className={`scroll-mt-28 border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder}`}
      >
        <div className="mx-auto max-w-3xl">
          <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            {page.contact.label}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            Get in touch
          </h2>
          <p className={`mt-6 text-base leading-relaxed ${t.sectionMuted}`}>{page.contact.intro}</p>
          <ul className="mt-8 space-y-4">
            {page.contact.people.map((person) => (
              <li key={person.email} className="text-base">
                <p className="font-semibold" style={display}>
                  {person.name}
                </p>
                <a href={`mailto:${person.email}`} className={link}>
                  {person.email}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10">
            <a href={`${basePath}/programs#health`} className={`text-sm ${link}`}>
              Back to Health & wellness
            </a>
          </p>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
