import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { siteContent } from "@/lib/content";
import { newsImages, siteImages } from "@/lib/images";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const marqueePhotos = [
  siteImages.heroCulture,
  siteImages.heroGathering,
  siteImages.events,
  siteImages.heroEvent,
  siteImages.volunteer,
  siteImages.heroCommunity,
];

const panels = [
  { ...siteContent.pillars[0], image: siteImages.programs },
  { ...siteContent.pillars[1], image: siteImages.heroGathering },
  { ...siteContent.pillars[2], image: siteImages.volunteer },
  {
    title: siteContent.featuredProgram.title,
    description: siteContent.featuredProgram.description,
    image: siteImages.heroCommunity,
  },
];

export default function SankofaPreview() {
  return (
    <div className={`${sora.variable} bg-[#06110D] text-[#EFEDE4]`}>
      <PreviewBanner option="C — Sankofa" />

      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#06110D]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-6">
          <Logo size={42} textClassName="hidden text-[#EFEDE4] lg:block" />
          <nav className="hidden items-center gap-7 lg:flex">
            {siteContent.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] text-[#EFEDE4]/60 transition-colors hover:text-[#FCD116]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded-full border border-[#FCD116]/60 px-5 py-2 text-xs font-semibold text-[#FCD116] transition-colors hover:bg-[#FCD116] hover:text-[#06110D]"
          >
            Donate
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden pt-20 md:pt-28">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(11,107,69,0.55),transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[#FCD116]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-6">
          <p className="animate-fade-in text-[11px] font-semibold uppercase tracking-[0.3em]">
            <span className="text-shimmer">{siteContent.orgName}</span>
          </p>
          <h1
            className="animate-blur-in mt-7 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance md:text-6xl lg:text-[4.4rem]"
            style={display}
          >
            {siteContent.tagline}
          </h1>
          <p
            className="animate-blur-in mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[#EFEDE4]/60"
            style={{ animationDelay: "260ms" }}
          >
            {siteContent.subtagline}
          </p>
          <div
            className="animate-blur-in mt-10 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "420ms" }}
          >
            <a
              href="#donate"
              className="btn-premium rounded-full bg-[#FCD116] px-8 py-3.5 text-sm font-semibold text-[#06110D]"
            >
              Support our work
            </a>
            <a
              href="#programs"
              className="link-arrow btn-premium inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold transition-colors hover:border-[#FCD116]/60"
            >
              See programs <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden pb-4 md:mt-20">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                {marqueePhotos.map((photo) => (
                  <SiteImage
                    key={`${copy}-${photo.src}`}
                    {...photo}
                    className="h-56 w-44 shrink-0 rounded-2xl md:h-72 md:w-56"
                    overlay="bg-gradient-to-t from-[#06110D]/60 to-transparent"
                    sizes="240px"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-y border-white/[0.08]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-5 md:grid-cols-4 md:px-6">
          {siteContent.stats.map((stat) => (
            <div key={stat.label} className="px-4 py-8 text-center">
              <p className="text-3xl font-semibold text-[#FCD116] md:text-4xl" style={display}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-[#EFEDE4]/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatedSection id="about" className="relative overflow-hidden px-5 py-24 md:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_40%_60%_at_50%_0%,rgba(252,209,22,0.10),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mx-auto block h-px w-16 bg-[#FCD116]/60" />
          <p className="mt-8 text-xl leading-relaxed text-[#EFEDE4]/80 md:text-[1.6rem]" style={display}>
            {siteContent.mission}
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="px-5 pb-20 md:px-6" delay={80}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl" style={display}>
              How we serve
            </h2>
            <p className="max-w-xs text-sm text-[#EFEDE4]/45">
              Hover a panel to open it. Programs, advocacy, and volunteering across Ontario.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 md:h-[460px] md:flex-row">
            {panels.map((panel) => (
              <article
                key={panel.title}
                className="group relative h-52 flex-1 overflow-hidden rounded-3xl border border-white/10 transition-all duration-700 ease-out md:h-full md:hover:flex-[2.4]"
              >
                <SiteImage
                  {...panel.image}
                  className="absolute inset-0"
                  imageClassName="img-zoom"
                  overlay="bg-gradient-to-t from-[#06110D] via-[#06110D]/55 to-[#06110D]/10"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3
                    className="text-xl font-semibold tracking-tight md:text-2xl"
                    style={display}
                  >
                    {panel.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#EFEDE4]/70 transition-all duration-500 md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100">
                    {panel.description}
                  </p>
                </div>
                <span className="absolute right-6 top-6 h-8 w-8 rounded-full border border-[#FCD116]/50 text-center text-sm leading-7 text-[#FCD116] transition-transform duration-500 group-hover:rotate-45">
                  +
                </span>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="px-5 pb-20 md:px-6" delay={80}>
        <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10">
          <SiteImage
            {...siteImages.heroEvent}
            className="absolute inset-0"
            imageClassName="img-zoom"
            overlay="bg-gradient-to-r from-[#06110D] via-[#06110D]/80 to-[#06110D]/20"
            sizes="100vw"
          />
          <div className="relative max-w-xl px-8 py-14 md:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
              Upcoming
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              {siteContent.featuredEvent.title}
            </h2>
            <p className="mt-3 text-sm text-[#EFEDE4]/50">{siteContent.featuredEvent.date}</p>
            <p className="mt-5 leading-relaxed text-[#EFEDE4]/70">
              {siteContent.featuredEvent.description}
            </p>
            <p className="mt-4 text-sm text-[#EFEDE4]/45">{siteContent.featuredEvent.location}</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="px-5 pb-20 md:px-6" delay={80}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl" style={display}>
            Community news
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {siteContent.news.map((item, i) => (
              <article
                key={item.title}
                className="group hover-lift overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] hover:border-[#FCD116]/40"
              >
                <SiteImage
                  {...newsImages[i]}
                  className="aspect-[16/10]"
                  imageClassName="img-zoom"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FCD116]">
                    {item.tag}
                  </p>
                  <h3
                    className="mt-3 text-lg font-semibold leading-snug tracking-tight"
                    style={display}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#EFEDE4]/50">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="get-involved" className="relative overflow-hidden px-5 pb-20 md:px-6" delay={80}>
        <div
          id="donate"
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 px-8 py-16 text-center"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-[-60%] h-[420px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(11,107,69,0.65),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl" style={display}>
              Get involved
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[#EFEDE4]/65">
              Volunteer, become a member, or donate to keep programs running at the Resource Hub.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#contact"
                className="btn-premium rounded-full bg-[#FCD116] px-8 py-3.5 text-sm font-semibold text-[#06110D]"
              >
                Donate now
              </a>
              <a
                href="#contact"
                className="btn-premium rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold transition-colors hover:border-[#FCD116]/60"
              >
                Volunteer
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="px-5 pb-24 md:px-6" delay={80}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <SiteImage
            {...siteImages.hub}
            className="aspect-[16/11] rounded-[2rem]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FCD116]">
              Visit us
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              Resource Hub
            </h2>
            <p className="mt-5 text-[#EFEDE4]/70">{siteContent.contact.address}</p>
            <p className="mt-1 text-[#EFEDE4]/45">{siteContent.contact.hours}</p>
            <p className="mt-6 text-sm">
              <a href={`tel:${siteContent.contact.phone}`} className="hover:text-[#FCD116]">
                {siteContent.contact.phone}
              </a>
              <span className="mx-3 text-white/20">·</span>
              <a href={`mailto:${siteContent.contact.email}`} className="hover:text-[#FCD116]">
                {siteContent.contact.email}
              </a>
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
