import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const programsNav = [
  { label: "Homework Club", href: "#homework" },
  { label: "Youth · Seniors · Women · Men", href: "#community" },
  { label: "Health & wellness", href: "#health" },
  { label: "DETT", href: "#dett" },
];

interface SankofaProgramsProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaPrograms({ theme, optionLabel, basePath }: SankofaProgramsProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const p = siteContent.programsPage;
  const donateHref = `${basePath}#donate`;
  const inquireHref = `mailto:${siteContent.contact.email}`;
  const chipHover = isLight
    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
    : "hover:border-[#FCD116] hover:text-[#FCD116]";
  const hoverOverlay = isLight
    ? "bg-gradient-to-t from-[#006B3F]/55 via-[#006B3F]/15 to-transparent"
    : "bg-gradient-to-t from-black/70 via-[#FCD116]/15 to-transparent";

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

      <section className={`border-b px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-40 ${t.aboutHero}`}>
        <div className="mx-auto max-w-4xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Programs
          </p>
          <h1
            className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance md:text-6xl"
            style={display}
          >
            Programs at {siteContent.orgShort}
          </h1>
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.sectionMuted}`}>{p.intro}</p>
        </div>
      </section>

      <nav
        aria-label="Program sections"
        className={`sticky top-[calc(36px+4.25rem)] z-40 border-b backdrop-blur-xl ${
          isLight ? "border-black/10 bg-[#FFFBF2]/90" : "border-white/[0.08] bg-[#06110D]/90"
        }`}
      >
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-3 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {programsNav.map((item) => (
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

      <AnimatedSection id="homework" className={`border-b px-6 py-24 md:px-10 md:py-32 ${t.statsWrap}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
          <div className="group relative overflow-hidden rounded-3xl lg:col-span-6">
            <SiteImage
              src={p.homework.image}
              alt={p.homework.alt}
              className="aspect-[4/3]"
              imageClassName="img-zoom"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
              aria-hidden
            />
          </div>
          <div className="lg:col-span-6">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {p.homework.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              {p.homework.title}
            </h2>
            <p className={`mt-6 text-base leading-relaxed ${t.cardMuted}`}>{p.homework.summary}</p>
            <p className={`mt-4 text-base leading-relaxed ${t.cardMuted}`}>{p.homework.context}</p>
            <p className="mt-8 text-lg leading-relaxed md:text-xl" style={display}>
              {p.homework.mission}
            </p>
            <ul className={`mt-8 grid gap-3 sm:grid-cols-2 ${t.cardMuted}`}>
              {p.homework.offers.map((offer) => (
                <li key={offer} className="flex gap-3 text-sm">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isLight ? "bg-[#006B3F]" : "bg-[#FCD116]"
                    }`}
                    aria-hidden
                  />
                  {offer}
                </li>
              ))}
            </ul>
            <p className={`mt-8 text-sm ${t.sectionMuted}`}>
              <span className="font-semibold">Schedule:</span> {p.homework.schedule}
            </p>
            <p className={`mt-2 text-sm ${t.sectionMuted}`}>
              Sign up via {p.homework.contactLabel} at{" "}
              <a className="underline underline-offset-4" href={`mailto:${p.homework.contact}`}>
                {p.homework.contact}
              </a>
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="community" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            {p.community.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            {p.community.title}
          </h2>
          <p className={`mt-6 max-w-2xl text-base leading-relaxed ${t.sectionMuted}`}>
            {p.community.summary}
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {p.community.groups.map((group) => (
              <article
                key={group.id}
                id={group.id}
                className={`group overflow-hidden rounded-3xl border ${t.card} ${t.panelBorder}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SiteImage
                    src={group.image}
                    alt={group.alt}
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
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl" style={display}>
                    {group.title}
                  </h3>
                  <p className={`mt-3 text-sm leading-relaxed ${t.cardMuted}`}>{group.summary}</p>
                  <ul className={`mt-6 space-y-2 text-sm ${t.cardMuted}`}>
                    {group.highlights.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isLight ? "bg-[#006B3F]" : "bg-[#FCD116]"
                          }`}
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="health" className={`border-y px-6 py-24 md:px-10 md:py-32 ${t.statsWrap}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {p.health.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              {p.health.title}
            </h2>
            <p className={`mt-6 text-base leading-relaxed ${t.cardMuted}`}>{p.health.summary}</p>
            <p className={`mt-4 text-base leading-relaxed ${t.cardMuted}`}>{p.health.context}</p>
            <ul className={`mt-8 space-y-3 ${t.cardMuted}`}>
              {p.health.highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isLight ? "bg-[#006B3F]" : "bg-[#FCD116]"
                    }`}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="group relative order-1 overflow-hidden rounded-3xl lg:order-2 lg:col-span-6">
            <SiteImage
              src={p.health.image}
              alt={p.health.alt}
              className="aspect-[4/3]"
              imageClassName="img-zoom"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
              aria-hidden
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="dett" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
          <div className="group relative overflow-hidden rounded-3xl lg:col-span-6">
            <SiteImage
              src={p.dett.image}
              alt={p.dett.alt}
              className="aspect-[4/3]"
              imageClassName="img-zoom"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
              aria-hidden
            />
          </div>
          <div className="lg:col-span-6">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {p.dett.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              {p.dett.title}
            </h2>
            <p className={`mt-6 text-base leading-relaxed ${t.cardMuted}`}>{p.dett.summary}</p>
            <div className="mt-8">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>
                Mission
              </p>
              <p className="mt-3 text-lg leading-relaxed" style={display}>
                {p.dett.mission}
              </p>
            </div>
            <div className="mt-6">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>
                Vision
              </p>
              <p className={`mt-3 text-base leading-relaxed ${t.cardMuted}`}>{p.dett.vision}</p>
            </div>
            <div className="mt-6">
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>
                Membership
              </p>
              <p className={`mt-3 text-base leading-relaxed ${t.cardMuted}`}>{p.dett.membership}</p>
            </div>
            <ul className={`mt-8 space-y-3 ${t.cardMuted}`}>
              {p.dett.benefits.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isLight ? "bg-[#006B3F]" : "bg-[#FCD116]"
                    }`}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="relative overflow-hidden px-6 pb-32 md:px-10 md:pb-40">
        <div
          className={`relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border px-8 py-20 text-center md:px-12 md:py-24 ${t.donateBox}`}
        >
          <div className={`pointer-events-none absolute inset-x-0 bottom-[-60%] h-[420px] ${t.donateGlow}`} />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl" style={display}>
              Want to join or support a program?
            </h2>
            <p className={`mx-auto mt-6 max-w-lg leading-relaxed ${t.donateCopy}`}>
              Inquire about a program or donate to keep them running at the Resource Hub.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={donateHref}
                className={`btn-premium rounded-full px-8 py-3.5 text-sm font-semibold ${t.ctaPrimary}`}
              >
                Donate
              </a>
              <a
                href={inquireHref}
                className={`btn-premium rounded-full px-8 py-3.5 text-sm font-semibold transition-colors ${t.donateSecondary}`}
              >
                Inquire
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
