import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { siteContent } from "@/lib/content";

export default function FoundationPreview() {
  return (
    <div className="bg-gcao-cream text-gcao-navy">
      <PreviewBanner option="A" />

      <header className="sticky top-0 z-50 border-b border-black/5 bg-gcao-cream/95 backdrop-blur transition-all duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size={52} textClassName="hidden sm:block text-gcao-navy" />
          <nav className="hidden items-center gap-8 md:flex">
            {siteContent.nav.map((item) => (
              <a key={item.label} href={item.href} className="nav-link text-sm font-medium">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded-full bg-gcao-gold px-5 py-2.5 text-sm font-bold text-gcao-navy hover:bg-yellow-400"
          >
            Donate
          </a>
        </div>
      </header>

      <AnimatedSection className="relative overflow-hidden">
        <PlaceholderImage
          label={siteContent.placeholders[0].label}
          aspect="hero"
          className="rounded-none border-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gcao-navy/80 via-gcao-navy/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gcao-gold">
              Ghanaian-Canadian Association of Ontario
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
              Programs that bring community home
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">{siteContent.subtagline}</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-6 py-20" delay={100}>
        <blockquote className="border-l-4 border-gcao-gold pl-8 font-display text-2xl leading-relaxed md:text-3xl">
          &ldquo;{siteContent.mission}&rdquo;
        </blockquote>
      </AnimatedSection>

      <AnimatedSection id="programs" className="bg-white py-20" delay={150}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
              Our Programs
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Building opportunity across generations
            </h2>
            <p className="mt-4 text-gray-600">{siteContent.featuredProgram.description}</p>
            <a
              href="#"
              className="btn-premium mt-6 inline-block border-b-2 border-gcao-navy pb-1 text-sm font-bold uppercase tracking-wider"
            >
              Explore {siteContent.featuredProgram.title} →
            </a>
          </div>
          <PlaceholderImage label={siteContent.placeholders[2].label} aspect="square" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="about" className="py-20" delay={100}>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-3">
          {siteContent.pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="bg-gcao-navy py-20 text-white" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gcao-gold">
            Latest Stories
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">Inspiration from our community</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteContent.news.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <PlaceholderImage
                  label={`News: ${item.tag}`}
                  aspect="wide"
                  className="rounded-none rounded-t-2xl border-0"
                />
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-gcao-gold">
                    {item.tag}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-gcao-gold">
                    Read more →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="py-20" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <PlaceholderImage label={siteContent.placeholders[1].label} aspect="wide" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
                Upcoming Event
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                {siteContent.featuredEvent.title}
              </h2>
              <p className="mt-2 font-medium text-gcao-green">{siteContent.featuredEvent.date}</p>
              <p className="mt-1 text-sm text-gray-500">{siteContent.featuredEvent.location}</p>
              <p className="mt-4 text-gray-600">{siteContent.featuredEvent.description}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="bg-white py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold">Visit the Resource Hub</h2>
              <p className="mt-4 text-gray-600">{siteContent.contact.address}</p>
              <p className="mt-2 text-gray-600">{siteContent.contact.hours}</p>
              <p className="mt-2 text-gray-600">{siteContent.contact.phone}</p>
              <p className="mt-2 text-gray-600">{siteContent.contact.email}</p>
            </div>
            <PlaceholderImage label={siteContent.placeholders[0].label} aspect="wide" />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="donate" className="bg-gcao-gold py-16" delay={100}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-gcao-navy">
            Support the Resource Center
          </h2>
          <p className="mt-4 text-gcao-navy/80">
            Your contribution sustains programs that strengthen families, celebrate culture, and
            build resilient neighbourhoods across Ontario.
          </p>
          <a
            href="#"
            className="btn-premium mt-8 inline-block rounded-full bg-gcao-navy px-8 py-3 text-sm font-bold text-white"
          >
            Donate Today
          </a>
        </div>
      </AnimatedSection>

      <footer className="border-t border-black/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <Logo size={40} showText={false} />
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {siteContent.orgName}. Design preview only.
          </p>
        </div>
      </footer>
    </div>
  );
}
