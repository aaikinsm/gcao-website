import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { CountUp } from "@/components/shared/CountUp";
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

const aboutNav = [
  { label: "Mission & vision", href: "#mission" },
  { label: "History", href: "#history" },
  { label: "Team", href: "#team" },
  { label: "Objectives", href: "#objectives" },
  { label: "Impact", href: "#impact" },
  { label: "Projects", href: "#projects" },
];

interface SankofaAboutProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaAbout({ theme, optionLabel, basePath }: SankofaAboutProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const donateHref = `${basePath}#donate`;
  const historyParagraphs = siteContent.about.history.split("\n\n");
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
            About
          </p>
          <h1
            className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance md:text-6xl"
            style={display}
          >
            About {siteContent.orgShort}
          </h1>
          <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.sectionMuted}`}>
            Mission, people, impact, and the projects that keep Ghanaian-Canadian communities
            thriving across Ontario.
          </p>
          <nav
            aria-label="About sections"
            className="mt-10 flex flex-wrap gap-3 text-sm font-medium"
          >
            {aboutNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full border px-4 py-2 transition-colors ${t.panelBorder} ${
                  isLight
                    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
                    : "hover:border-[#FCD116] hover:text-[#FCD116]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <AnimatedSection id="mission" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Mission & vision
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            Why we exist
          </h2>
          <p className="mt-10 max-w-3xl text-xl leading-relaxed md:text-2xl" style={display}>
            {siteContent.mission}
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>
                Our Vision
              </p>
              <p className={`mt-3 text-base leading-relaxed ${t.cardMuted}`}>
                {siteContent.about.vision}
              </p>
            </div>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>
                What We Do
              </p>
              <p className={`mt-3 text-base leading-relaxed ${t.cardMuted}`}>
                {siteContent.about.whatWeDo}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="history" className={`border-y px-6 py-24 md:px-10 md:py-32 ${t.statsWrap}`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              History
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              From the 1970s to today
            </h2>
          </div>
          <div className="space-y-6 lg:col-span-8">
            {historyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={`text-base leading-relaxed md:text-lg ${t.cardMuted}`}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="team" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Team
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            Leadership & stewards
          </h2>
          <p className={`mt-4 max-w-xl text-sm ${t.sectionMuted}`}>
            Executives and group leaders serving the GTA community.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {siteContent.about.team.map((member) => (
              <article
                key={member.name}
                className={`group overflow-hidden rounded-3xl border ${t.card} ${t.panelBorder}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <SiteImage
                    src={member.image}
                    alt={member.alt}
                    className="absolute inset-0 h-full w-full"
                    imageClassName="img-zoom"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
                    aria-hidden
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold tracking-tight" style={display}>
                    {member.name}
                  </h3>
                  <p className={`mt-2 text-sm ${t.cardMuted}`}>{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="objectives" className={`border-y px-6 py-24 md:px-10 md:py-32 ${t.statsWrap}`}>
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Objectives
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            What we work toward
          </h2>
          <ul className={`mt-14 grid gap-x-10 gap-y-5 md:grid-cols-2 ${t.cardMuted}`}>
            {siteContent.about.objectives.map((objective) => (
              <li key={objective} className="flex gap-3 text-sm leading-relaxed md:text-[15px]">
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                    isLight ? "bg-[#006B3F]" : "bg-[#FCD116]"
                  }`}
                  aria-hidden
                />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </AnimatedSection>

      <AnimatedSection id="impact" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Impact stats
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            By the numbers
          </h2>
          <div className={`mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border md:grid-cols-4 ${t.panelBorder} ${t.statsWrap}`}>
            {siteContent.stats.map((stat) => (
              <div key={stat.label} className="px-5 py-12 text-center">
                <p className={`text-3xl font-semibold md:text-5xl ${t.statsValue}`} style={display}>
                  <CountUp value={stat.value} />
                </p>
                <p className={`mt-3 text-xs ${t.statsLabel}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="projects" className="px-6 pb-32 md:px-10 md:pb-40">
        <div className="mx-auto max-w-6xl">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
            Projects & fundraising
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
            Where support goes
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {siteContent.about.projects.map((project) => (
              <article
                key={project.title}
                className={`flex flex-col rounded-3xl border p-8 ${t.card} ${t.panelBorder}`}
              >
                <h3 className="text-xl font-semibold tracking-tight" style={display}>
                  {project.title}
                </h3>
                <p className={`mt-4 flex-1 text-sm leading-relaxed ${t.cardMuted}`}>
                  {project.description}
                </p>
                <a
                  href={donateHref}
                  className={`link-arrow btn-premium mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${t.ctaPrimary}`}
                >
                  {project.cta} <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
