import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { siteContent } from "@/lib/content";

const pillarBorders = ["border-l-gcao-red", "border-l-gcao-gold", "border-l-gcao-green"];

export default function DiasporaPreview() {
  return (
    <div className="bg-gcao-cream text-gcao-navy">
      <PreviewBanner option="D" />

      <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size={50} textClassName="text-gcao-navy hidden sm:block" />
          <nav className="hidden items-center gap-6 md:flex">
            {siteContent.nav.map((item) => (
              <a key={item.label} href={item.href} className="nav-link text-sm font-medium text-gray-700">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded-full bg-gcao-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Donate
          </a>
        </div>
        <div className="kente-stripe h-1.5 w-full" />
      </header>

      <AnimatedSection className="relative overflow-hidden bg-gcao-cream">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #CE1126 0px, #CE1126 2px,
                transparent 2px, transparent 12px,
                #FCD116 12px, #FCD116 14px,
                transparent 14px, transparent 24px,
                #006B3F 24px, #006B3F 26px,
                transparent 26px, transparent 36px
              )`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gcao-green">
            Ghanaian-Canadian Association of Ontario
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Where Ghanaian roots meet Canadian community
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-700">{siteContent.subtagline}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#programs"
              className="btn-premium rounded-full bg-gcao-green px-6 py-3 text-sm font-semibold text-white hover:bg-gcao-green/90"
            >
              Explore Programs
            </a>
            <a
              href="#about"
              className="btn-premium rounded-full border-2 border-gcao-gold bg-gcao-gold/20 px-6 py-3 text-sm font-semibold text-gcao-navy hover:bg-gcao-gold/40"
            >
              Our Story
            </a>
          </div>
        </div>
      </AnimatedSection>

      <div className="kente-stripe h-1 w-full" />

      <AnimatedSection id="about" className="py-16" delay={100}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Two homes, one community</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">{siteContent.mission}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="bg-white py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-2xl font-bold md:text-3xl">
            How we serve our diaspora
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteContent.pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className={`rounded-r-xl border-l-4 bg-gcao-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${pillarBorders[i]}`}
              >
                <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">
            Our community in pictures
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <PlaceholderImage label={siteContent.placeholders[1].label} aspect="wide" />
            <PlaceholderImage label={siteContent.placeholders[3].label} aspect="wide" />
          </div>
        </div>
      </AnimatedSection>

      <div className="kente-stripe h-1 w-full" />

      <AnimatedSection className="bg-white py-16" delay={100}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <PlaceholderImage label={siteContent.placeholders[2].label} aspect="square" />
          <div>
            <span className="rounded-full bg-gcao-gold/30 px-3 py-1 text-xs font-semibold uppercase text-gcao-green">
              Featured Program
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">
              {siteContent.featuredProgram.title}
            </h2>
            <p className="mt-4 text-gray-600">{siteContent.featuredProgram.description}</p>
            <a
              href="#"
              className="mt-6 inline-block font-semibold text-gcao-green hover:underline"
            >
              {siteContent.featuredProgram.cta} →
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-bold">Upcoming Events</h2>
          <article className="mt-8 flex flex-col gap-6 rounded-2xl border border-gcao-green/20 bg-white p-6 transition-all duration-300 hover:shadow-md md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gcao-green font-display text-2xl font-bold text-white">
              HC
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold">{siteContent.featuredEvent.title}</h3>
              <p className="mt-1 text-sm font-medium text-gcao-green">{siteContent.featuredEvent.date}</p>
              <p className="mt-1 text-sm text-gray-500">{siteContent.featuredEvent.location}</p>
              <p className="mt-2 text-sm text-gray-600">{siteContent.featuredEvent.description}</p>
            </div>
          </article>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="bg-gcao-navy py-16 text-white" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gcao-gold">
            Community Stories
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">News & Culture</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteContent.news.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <PlaceholderImage
                  label={`News: ${item.tag}`}
                  aspect="wide"
                  className="rounded-none border-0 border-b border-white/10"
                />
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gcao-gold">
                    {item.tag}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70 line-clamp-3">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="py-16" delay={100}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">Visit the Resource Hub</h2>
            <p className="mt-2 text-gray-600">Our home in the Ghanaian-Canadian community</p>
            <div className="mt-6 space-y-2 text-gray-700">
              <p className="font-medium">{siteContent.contact.address}</p>
              <p>{siteContent.contact.hours}</p>
              <p>{siteContent.contact.phone}</p>
              <p>{siteContent.contact.email}</p>
            </div>
          </div>
          <PlaceholderImage label={siteContent.placeholders[0].label} aspect="wide" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="donate" className="pb-16" delay={100}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="kente-stripe h-2" />
            <div className="px-8 py-12 text-center md:px-16">
              <h2 className="font-display text-3xl font-bold text-gcao-navy">
                Support Our Diaspora Community
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-600">
                Your gift sustains programs that celebrate culture, strengthen families, and build
                belonging for Ghanaian-Canadians across Ontario.
              </p>
              <a
                href="#"
                className="btn-premium mt-8 inline-block rounded-full bg-gcao-red px-8 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                Donate to Resource Center
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <footer className="border-t border-black/10 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <Logo size={48} showText={false} />
          <p className="text-center text-sm text-gray-500 md:text-right">
            © {new Date().getFullYear()} {siteContent.orgName}. Design preview only.
          </p>
        </div>
      </footer>
    </div>
  );
}
