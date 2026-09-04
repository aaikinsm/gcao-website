import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { siteContent } from "@/lib/content";

export default function BridgePreview() {
  return (
    <div className="bg-white text-gray-900">
      <PreviewBanner option="C" />

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur transition-all duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size={50} textClassName="text-gcao-navy hidden lg:block" />
          <nav className="hidden items-center gap-8 md:flex">
            {siteContent.nav.map((item) => (
              <a key={item.label} href={item.href} className="nav-link text-sm font-medium text-gray-600">
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded-full bg-gcao-gold px-5 py-2.5 text-sm font-bold text-gcao-navy hover:bg-yellow-300"
          >
            Donate
          </a>
        </div>
      </header>

      <AnimatedSection className="bg-gcao-warm">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
              Since the 1970s
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gcao-navy md:text-5xl">
              {siteContent.tagline}
            </h1>
            <p className="mt-5 text-lg text-gray-600">{siteContent.subtagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#donate"
                className="btn-premium rounded-full bg-gcao-green px-6 py-3 text-sm font-semibold text-white hover:bg-gcao-green/90"
              >
                Donate to Resource Center
              </a>
              <a
                href="#programs"
                className="btn-premium rounded-full border-2 border-gcao-green px-6 py-3 text-sm font-semibold text-gcao-green hover:bg-gcao-green/5"
              >
                View Programs
              </a>
            </div>
          </div>
          <PlaceholderImage label={siteContent.placeholders[1].label} aspect="square" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="about" className="py-16" delay={100}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
            Our Mission
          </h2>
          <p className="mt-4 text-xl leading-relaxed text-gray-700">{siteContent.mission}</p>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="bg-gcao-warm py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-gcao-navy">How We Serve</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteContent.pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gcao-green/10 text-lg font-bold text-gcao-green">
                  {pillar.title[0]}
                </div>
                <h3 className="mt-5 text-xl font-bold text-gcao-navy">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16" delay={100}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-gcao-green/10 px-3 py-1 text-xs font-semibold text-gcao-green">
              Featured Program
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gcao-navy">
              {siteContent.featuredProgram.title}
            </h2>
            <p className="mt-4 text-gray-600">{siteContent.featuredProgram.description}</p>
            <a href="#" className="mt-6 inline-block font-semibold text-gcao-green hover:underline">
              Learn more about Homework Club →
            </a>
          </div>
          <PlaceholderImage label={siteContent.placeholders[2].label} aspect="wide" />
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="bg-gcao-green py-16 text-white" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gcao-gold">
                Upcoming Event
              </p>
              <h2 className="mt-3 text-3xl font-bold">{siteContent.featuredEvent.title}</h2>
              <p className="mt-2 text-white/80">{siteContent.featuredEvent.date}</p>
              <p className="mt-1 text-sm text-white/70">{siteContent.featuredEvent.location}</p>
            </div>
            <a
              href="#"
              className="btn-premium shrink-0 rounded-full bg-gcao-gold px-6 py-3 text-sm font-bold text-gcao-navy"
            >
              View Event Details
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gcao-navy">Latest News</h2>
              <p className="mt-1 text-gray-500">Stories from our community</p>
            </div>
            <a href="#" className="hidden text-sm font-semibold text-gcao-green md:inline-block">
              View all →
            </a>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {siteContent.news.map((item, i) => (
              <article
                key={item.title}
                className={`flex gap-5 transition-all duration-300 hover:-translate-y-0.5 ${i === 0 ? "md:col-span-2 md:items-center" : ""}`}
              >
                <PlaceholderImage
                  label={`News: ${item.tag}`}
                  aspect={i === 0 ? "wide" : "square"}
                  className={`shrink-0 ${i === 0 ? "md:w-1/2" : "w-28"}`}
                />
                <div className={i === 0 ? "md:w-1/2" : ""}>
                  <span className="text-xs font-semibold uppercase text-gcao-green">{item.tag}</span>
                  <h3 className={`mt-1 font-bold text-gcao-navy ${i === 0 ? "text-xl" : "text-base"}`}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="bg-gcao-warm py-16" delay={100}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <PlaceholderImage label={siteContent.placeholders[0].label} aspect="wide" />
          <div>
            <h2 className="text-2xl font-bold text-gcao-navy">Visit the Resource Hub</h2>
            <div className="mt-6 space-y-3 text-gray-700">
              <p className="font-medium">{siteContent.contact.address}</p>
              <p>{siteContent.contact.hours}</p>
              <p>
                <a href={`tel:${siteContent.contact.phone}`} className="text-gcao-green hover:underline">
                  {siteContent.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteContent.contact.email}`}
                  className="text-gcao-green hover:underline"
                >
                  {siteContent.contact.email}
                </a>
              </p>
            </div>
            <a
              href="#"
              className="btn-premium mt-6 inline-block rounded-full bg-gcao-navy px-6 py-3 text-sm font-semibold text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="donate" className="py-16" delay={100}>
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-gcao-green to-gcao-green/90 px-8 py-12 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold">Support Our Community</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Donations sustain the Resource Hub and programs that strengthen families, celebrate
            culture, and assist seniors across Ontario.
          </p>
          <a
            href="#"
            className="btn-premium mt-8 inline-block rounded-full bg-gcao-gold px-8 py-3 text-sm font-bold text-gcao-navy"
          >
            Donate Today
          </a>
        </div>
      </AnimatedSection>

      <footer className="border-t border-gray-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <Logo size={44} textClassName="text-gcao-navy" />
          <div className="text-center text-sm text-gray-500 md:text-right">
            <p>{siteContent.contact.address}</p>
            <p className="mt-1">
              © {new Date().getFullYear()} {siteContent.orgName}. Design preview only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
