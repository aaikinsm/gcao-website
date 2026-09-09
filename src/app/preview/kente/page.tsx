import { Bricolage_Grotesque } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SiteImage } from "@/components/shared/SiteImage";
import { siteContent } from "@/lib/content";
import { newsImages, siteImages } from "@/lib/images";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-kente",
});

const display = { fontFamily: "var(--font-kente), sans-serif" };

const accents = [
  { block: "bg-[#006B3F]", text: "text-[#006B3F]", chip: "bg-[#006B3F]/10" },
  { block: "bg-[#FCD116]", text: "text-[#8A6D00]", chip: "bg-[#FCD116]/25" },
  { block: "bg-[#CE1126]", text: "text-[#CE1126]", chip: "bg-[#CE1126]/10" },
];

// Draw the highlighter bar behind one word of the tagline.
const [taglineStart, taglineEnd = ""] = siteContent.tagline.split("communities");

export default function KentePreview() {
  return (
    <div className={`${bricolage.variable} bg-[#FFFBF2] text-[#14140F]`}>
      <PreviewBanner option="B — Kente" />

      <header className="sticky top-3 z-50 px-4 pt-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full border border-black/5 bg-white/85 py-2 pl-3 pr-2 shadow-[0_12px_40px_rgba(20,20,15,0.10)] backdrop-blur-xl">
          <Logo size={40} textClassName="hidden text-[#14140F] xl:block" />
          <nav className="hidden items-center gap-1 lg:flex">
            {siteContent.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-[13px] font-medium text-[#14140F]/65 transition-colors hover:bg-[#006B3F]/10 hover:text-[#006B3F]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded-full bg-[#006B3F] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Donate
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-6 pt-10 md:px-6 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="animate-fade-in inline-flex items-center gap-2 rounded-full bg-[#006B3F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#006B3F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006B3F]" />
              Serving Ontario since the 1970s
            </span>
            <h1
              className="animate-fade-in-up delay-100 mt-6 text-[2.6rem] font-semibold leading-[1.03] tracking-tight text-balance md:text-6xl lg:text-[4.2rem]"
              style={display}
            >
              {taglineStart}
              <span className="relative inline-block whitespace-nowrap">
                <span className="animate-marker absolute inset-x-[-0.1em] bottom-[0.06em] top-[0.52em] z-0 block rounded-md bg-[#FCD116]" />
                <span className="relative z-10">communities</span>
              </span>
              {taglineEnd}
            </h1>
            <p className="animate-fade-in-up delay-300 mt-6 max-w-lg text-lg leading-relaxed text-[#14140F]/65">
              {siteContent.subtagline}
            </p>
            <div className="animate-fade-in-up delay-400 mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#programs"
                className="link-arrow btn-premium inline-flex items-center gap-2 rounded-full bg-[#14140F] px-7 py-3.5 text-sm font-semibold text-white"
              >
                Explore programs <span aria-hidden>→</span>
              </a>
              <a
                href="#donate"
                className="btn-premium rounded-full border border-[#14140F]/15 bg-white px-7 py-3.5 text-sm font-semibold transition-colors hover:border-[#006B3F] hover:text-[#006B3F]"
              >
                Support the Hub
              </a>
            </div>
            <div className="animate-fade-in delay-500 mt-10 flex items-center gap-4">
              <div className="kente-stripe h-2 w-24 rounded-full" />
              <p className="text-xs font-medium uppercase tracking-wider text-[#14140F]/45">
                A community-run association
              </p>
            </div>
          </div>

          <div className="animate-fade-in-up delay-200 lg:col-span-5">
            <div className="relative mx-auto max-w-md pb-14 pl-10 lg:pb-16">
              <SiteImage
                {...siteImages.heroCulture}
                className="aspect-[4/5] rounded-[2.5rem]"
                priority
                sizes="(min-width: 1024px) 38vw, 90vw"
              />
              <div className="absolute bottom-0 left-0 w-40 overflow-hidden rounded-[1.5rem] ring-8 ring-[#FFFBF2] md:w-48">
                <SiteImage
                  {...siteImages.heroCommunity}
                  className="aspect-square"
                  sizes="200px"
                />
              </div>
              <div className="animate-float absolute -right-2 top-6 rotate-3 rounded-2xl bg-[#FCD116] px-5 py-3 shadow-[0_12px_30px_rgba(20,20,15,0.18)]">
                <p className="text-2xl font-semibold leading-none" style={display}>
                  50+
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#14140F]/70">
                  Years
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="px-5 py-10 md:px-6">
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[#05452A] px-6 py-10 text-[#FFFBF2] md:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-semibold text-[#FCD116] md:text-5xl" style={display}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[#FFFBF2]/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="about" className="px-5 py-16 md:px-6" delay={80}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#CE1126]">
              Our mission
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              Why we exist
            </h2>
          </div>
          <p className="text-xl leading-relaxed text-[#14140F]/75 lg:col-span-8 md:text-2xl">
            {siteContent.mission}
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="px-5 py-8 md:px-6" delay={80}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              How we serve
            </h2>
            <p className="max-w-xs text-sm text-[#14140F]/55">
              Programs, advocacy, and volunteer networks across Ontario.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {siteContent.pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className="hover-lift flex flex-col rounded-[1.75rem] border border-black/5 bg-white p-8 shadow-[0_2px_18px_rgba(20,20,15,0.05)] hover:shadow-[0_18px_45px_rgba(20,20,15,0.10)]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accents[i].block}`}
                >
                  <span className="text-sm font-bold text-white" style={display}>
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight" style={display}>
                  {pillar.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#14140F]/65">
                  {pillar.description}
                </p>
                <a
                  href="#get-involved"
                  className={`link-arrow mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accents[i].text}`}
                >
                  Learn more <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="px-5 py-12 md:px-6" delay={80}>
        <div className="group mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] md:grid-cols-2">
          <SiteImage
            {...siteImages.heroGathering}
            className="min-h-[320px]"
            imageClassName="img-zoom"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="flex flex-col justify-center bg-[#FCD116] p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#14140F]/60">
              Featured program
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              {siteContent.featuredProgram.title}
            </h2>
            <p className="mt-4 text-[#14140F]/75">{siteContent.featuredProgram.description}</p>
            <a
              href="#get-involved"
              className="link-arrow btn-premium mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[#14140F] px-6 py-3 text-sm font-semibold text-white"
            >
              {siteContent.featuredProgram.cta} <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="px-5 pb-4 md:px-6" delay={80}>
        <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem]">
          <SiteImage
            {...siteImages.heroEvent}
            className="absolute inset-0"
            imageClassName="img-zoom"
            overlay="bg-gradient-to-r from-[#05452A] via-[#05452A]/85 to-[#05452A]/20"
            sizes="100vw"
          />
          <div className="relative max-w-xl px-8 py-14 text-[#FFFBF2] md:px-12">
            <span className="inline-flex rounded-full bg-[#FCD116] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#14140F]">
              Upcoming
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              {siteContent.featuredEvent.title}
            </h2>
            <p className="mt-3 text-sm font-medium text-[#FCD116]">
              {siteContent.featuredEvent.date}
            </p>
            <p className="mt-4 text-[#FFFBF2]/75">{siteContent.featuredEvent.description}</p>
            <p className="mt-4 text-sm text-[#FFFBF2]/60">{siteContent.featuredEvent.location}</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="px-5 py-16 md:px-6" delay={80}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              Community news
            </h2>
            <a
              href="#news"
              className="link-arrow inline-flex items-center gap-2 text-sm font-semibold text-[#006B3F]"
            >
              All stories <span aria-hidden>→</span>
            </a>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {siteContent.news.map((item, i) => (
              <article
                key={item.title}
                className="group hover-lift overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_2px_18px_rgba(20,20,15,0.05)] hover:shadow-[0_18px_45px_rgba(20,20,15,0.10)]"
              >
                <div className="relative">
                  <SiteImage
                    {...newsImages[i]}
                    className="aspect-[16/11]"
                    imageClassName="img-zoom"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <span
                    className={`absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${accents[i].text}`}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight" style={display}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#14140F]/60">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="get-involved" className="px-5 pb-6 md:px-6" delay={80}>
        <div
          id="donate"
          className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#CE1126] text-[#FFFBF2]"
        >
          <div className="flex flex-col items-start justify-between gap-8 px-8 py-12 md:flex-row md:items-center md:px-12">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
                Get involved
              </h2>
              <p className="mt-3 max-w-lg text-[#FFFBF2]/80">
                Volunteer, become a member, or donate to keep programs running at the Resource Hub
                on Mayall Avenue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="btn-premium rounded-full bg-[#FFFBF2] px-7 py-3.5 text-sm font-semibold text-[#CE1126]"
              >
                Donate now
              </a>
              <a
                href="#contact"
                className="btn-premium rounded-full border border-[#FFFBF2]/40 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                Volunteer
              </a>
            </div>
          </div>
          <div className="kente-stripe h-2 w-full" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="px-5 py-16 md:px-6" delay={80}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <SiteImage
            {...siteImages.hub}
            className="aspect-[16/11] rounded-[2.5rem]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_2px_18px_rgba(20,20,15,0.05)] md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#006B3F]">
              Visit us
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
              Resource Hub
            </h2>
            <p className="mt-5 text-[#14140F]/75">{siteContent.contact.address}</p>
            <p className="mt-1 text-[#14140F]/55">{siteContent.contact.hours}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              <a
                href={`tel:${siteContent.contact.phone}`}
                className="rounded-full bg-[#006B3F]/10 px-4 py-2 text-[#006B3F] transition-colors hover:bg-[#006B3F]/20"
              >
                {siteContent.contact.phone}
              </a>
              <a
                href={`mailto:${siteContent.contact.email}`}
                className="rounded-full bg-[#006B3F]/10 px-4 py-2 text-[#006B3F] transition-colors hover:bg-[#006B3F]/20"
              >
                {siteContent.contact.email}
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
