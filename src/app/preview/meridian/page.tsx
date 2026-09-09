import { Instrument_Sans } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { RevealText } from "@/components/shared/RevealText";
import { SiteImage } from "@/components/shared/SiteImage";
import { siteContent } from "@/lib/content";
import { newsImages, siteImages } from "@/lib/images";

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-meridian",
});

const display = { fontFamily: "var(--font-meridian), sans-serif" };

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs font-medium tabular-nums text-[#0F1B14]/35">{index}</span>
      <span className="h-px w-8 bg-[#0F1B14]/20" />
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#006B3F]">
        {children}
      </span>
    </div>
  );
}

export default function MeridianPreview() {
  return (
    <div className={`${instrument.variable} bg-white text-[#0F1B14]`}>
      <PreviewBanner option="A — Meridian" />

      <div className="bg-[#0F1B14] text-[#F5F7F5]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-2 text-[11px] md:px-6">
          <p className="opacity-70">{siteContent.contact.hours}</p>
          <p className="opacity-70">
            {siteContent.contact.phone}
            <span className="mx-2 opacity-40">/</span>
            {siteContent.contact.email}
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#0F1B14]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-6">
          <Logo size={42} textClassName="hidden text-[#0F1B14] lg:block" />
          <nav className="hidden items-center gap-8 lg:flex">
            {siteContent.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0F1B14]/65 hover:text-[#0F1B14]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium bg-[#006B3F] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
          >
            Donate
          </a>
        </div>
      </header>

      <section className="border-b border-[#0F1B14]/10">
        <div className="mx-auto grid max-w-[100rem] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 lg:py-24 xl:px-20">
            <div className="animate-fade-in">
              <SectionLabel index="01">Ontario</SectionLabel>
            </div>
            <h1
              className="mt-8 max-w-xl text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.02em] text-balance md:text-5xl xl:text-[3.75rem]"
              style={display}
            >
              <RevealText text={siteContent.tagline} startDelay={150} />
            </h1>
            <p className="animate-fade-in-up delay-500 mt-7 max-w-md text-lg leading-relaxed text-[#0F1B14]/60">
              {siteContent.subtagline}
            </p>
            <div className="animate-fade-in-up delay-600 mt-9 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="link-arrow btn-premium inline-flex items-center gap-2 bg-[#0F1B14] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
              >
                Our programs <span aria-hidden>→</span>
              </a>
              <a
                href="#about"
                className="btn-premium border border-[#0F1B14]/20 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-[#006B3F] hover:text-[#006B3F]"
              >
                About GCAO
              </a>
            </div>
          </div>
          <div className="relative min-h-[380px] lg:min-h-[660px]">
            <SiteImage
              {...siteImages.heroCulture}
              className="absolute inset-0"
              imageClassName="animate-ken-burns"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <div className="border-b border-[#0F1B14]/10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#0F1B14]/10 px-5 md:grid-cols-4 md:px-6">
          {siteContent.stats.map((stat) => (
            <div key={stat.label} className="px-5 py-8 first:pl-0 last:pr-0">
              <p className="text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[#0F1B14]/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatedSection id="about" className="relative">
        <div className="relative min-h-[460px]">
          <SiteImage
            {...siteImages.heroWide}
            className="absolute inset-0"
            overlay="bg-gradient-to-b from-[#0F1B14]/90 via-[#0F1B14]/85 to-[#0F1B14]/90"
            sizes="100vw"
          />
          <div className="relative mx-auto flex min-h-[460px] max-w-4xl flex-col justify-center px-5 py-20 text-center md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FCD116]">
              Our mission
            </p>
            <p
              className="mt-6 text-2xl leading-snug tracking-tight text-white md:text-[2.1rem]"
              style={display}
            >
              {siteContent.mission}
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="border-b border-[#0F1B14]/10 py-20" delay={80}>
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <SectionLabel index="02">What we do</SectionLabel>
          <h2
            className="mt-6 max-w-2xl text-3xl font-semibold tracking-[-0.02em] md:text-5xl"
            style={display}
          >
            Programs built around real community needs
          </h2>
          <div className="mt-14 grid divide-y divide-[#0F1B14]/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {siteContent.pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className="group py-8 transition-colors md:px-8 md:py-0 md:first:pl-0 md:last:pr-0"
              >
                <p className="text-xs font-medium tabular-nums text-[#0F1B14]/30">0{i + 1}</p>
                <h3
                  className="mt-4 text-2xl font-semibold tracking-tight transition-colors group-hover:text-[#006B3F]"
                  style={display}
                >
                  {pillar.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#0F1B14]/60">
                  {pillar.description}
                </p>
                <a
                  href="#get-involved"
                  className="link-arrow mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#006B3F]"
                >
                  Learn more <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-b border-[#0F1B14]/10" delay={80}>
        <div className="group mx-auto grid max-w-[100rem] lg:grid-cols-2">
          <div className="relative min-h-[340px] overflow-hidden lg:min-h-[560px]">
            <SiteImage
              {...siteImages.heroGathering}
              className="absolute inset-0"
              imageClassName="img-zoom"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 lg:py-20 xl:px-20">
            <SectionLabel index="03">Featured</SectionLabel>
            <h2
              className="mt-6 max-w-md text-3xl font-semibold tracking-[-0.02em] md:text-4xl"
              style={display}
            >
              {siteContent.featuredProgram.title}
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-[#0F1B14]/65">
              {siteContent.featuredProgram.description}
            </p>
            <a
              href="#get-involved"
              className="link-arrow btn-premium mt-8 inline-flex w-fit items-center gap-2 bg-[#006B3F] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              {siteContent.featuredProgram.cta} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="border-b border-[#0F1B14]/10 py-20" delay={80}>
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <SectionLabel index="04">Events</SectionLabel>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-center">
            <div className="bg-[#0F1B14] px-8 py-10 text-center text-white md:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FCD116]">
                Now open
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {siteContent.featuredEvent.date}
              </p>
            </div>
            <div className="md:col-span-6">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl" style={display}>
                {siteContent.featuredEvent.title}
              </h2>
              <p className="mt-4 leading-relaxed text-[#0F1B14]/65">
                {siteContent.featuredEvent.description}
              </p>
              <p className="mt-4 text-sm text-[#0F1B14]/50">
                {siteContent.featuredEvent.location}
              </p>
            </div>
            <div className="md:col-span-3">
              <SiteImage
                {...siteImages.events}
                className="aspect-[4/3]"
                sizes="(min-width: 768px) 25vw, 100vw"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="border-b border-[#0F1B14]/10 py-20" delay={80}>
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <SectionLabel index="05">News</SectionLabel>
          <div className="mt-8 divide-y divide-[#0F1B14]/10 border-y border-[#0F1B14]/10">
            {siteContent.news.map((item, i) => (
              <article
                key={item.title}
                className="group relative grid gap-4 py-8 transition-colors hover:bg-[#F5F7F5] md:grid-cols-12 md:items-center md:gap-8 md:px-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#006B3F] md:col-span-2">
                  {item.tag}
                </p>
                <div className="md:col-span-7">
                  <h3
                    className="text-xl font-semibold leading-snug tracking-tight md:text-2xl"
                    style={display}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#0F1B14]/55">
                    {item.excerpt}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <SiteImage
                    {...newsImages[i]}
                    className="aspect-[16/10] transition-all duration-500 md:opacity-0 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0"
                    sizes="(min-width: 768px) 25vw, 100vw"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="get-involved" delay={80}>
        <div id="donate" className="bg-[#006B3F] py-20 text-white">
          <div className="mx-auto max-w-3xl px-5 text-center md:px-6">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] md:text-5xl" style={display}>
              Get involved
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/75">
              Volunteer, become a member, or donate to keep programs running at the Resource Hub.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#contact"
                className="btn-premium bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#006B3F]"
              >
                Donate now
              </a>
              <a
                href="#contact"
                className="btn-premium border border-white/40 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:bg-white/10"
              >
                Volunteer
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="py-20" delay={80}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-6">
          <div>
            <SectionLabel index="06">Visit</SectionLabel>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.02em] md:text-4xl" style={display}>
              Resource Hub
            </h2>
            <p className="mt-6 text-lg text-[#0F1B14]/75">{siteContent.contact.address}</p>
            <div className="mt-8 divide-y divide-[#0F1B14]/10 border-y border-[#0F1B14]/10 text-sm">
              <p className="flex justify-between py-3">
                <span className="text-[#0F1B14]/50">Hours</span>
                <span>{siteContent.contact.hours}</span>
              </p>
              <p className="flex justify-between py-3">
                <span className="text-[#0F1B14]/50">Phone</span>
                <a href={`tel:${siteContent.contact.phone}`} className="hover:text-[#006B3F]">
                  {siteContent.contact.phone}
                </a>
              </p>
              <p className="flex justify-between py-3">
                <span className="text-[#0F1B14]/50">Email</span>
                <a href={`mailto:${siteContent.contact.email}`} className="hover:text-[#006B3F]">
                  {siteContent.contact.email}
                </a>
              </p>
            </div>
          </div>
          <SiteImage
            {...siteImages.hub}
            className="aspect-[16/12]"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </AnimatedSection>
    </div>
  );
}
