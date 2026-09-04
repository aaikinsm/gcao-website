import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Logo } from "@/components/shared/Logo";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { siteContent } from "@/lib/content";

export default function CommunityHubPreview() {
  return (
    <div className="bg-white text-gray-900">
      <PreviewBanner option="B" />

      <header className="sticky top-0 z-50 bg-gcao-green text-white shadow-md transition-all duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo size={48} showText={false} className="brightness-110" />
          <nav className="hidden items-center gap-6 md:flex">
            {siteContent.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-wide transition-colors duration-300 hover:text-gcao-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#donate"
            className="btn-premium rounded bg-gcao-gold px-4 py-2 text-sm font-bold uppercase text-gcao-green hover:bg-yellow-300"
          >
            Get Involved
          </a>
        </div>
      </header>

      <AnimatedSection className="bg-gcao-green px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gcao-gold">
            {siteContent.orgShort}
          </p>
          <h1 className="mt-6 text-3xl font-black leading-tight md:text-5xl">
            How do we strengthen Ghanaian-Canadian communities?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">{siteContent.mission}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#programs"
              className="btn-premium rounded bg-white px-6 py-3 text-sm font-bold uppercase text-gcao-green"
            >
              Our Programs
            </a>
            <a
              href="#donate"
              className="btn-premium rounded border-2 border-gcao-gold px-6 py-3 text-sm font-bold uppercase text-gcao-gold"
            >
              Donate
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="programs" className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-sm font-black uppercase tracking-[0.3em] text-gcao-red">
            What We Do
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteContent.pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className={`rounded-xl border-t-4 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  i === 0
                    ? "border-gcao-green bg-gcao-warm"
                    : i === 1
                      ? "border-gcao-gold bg-white shadow-md"
                      : "border-gcao-red bg-gcao-warm"
                }`}
              >
                <h3 className="text-xl font-black uppercase">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">{pillar.description}</p>
                <a
                  href="#"
                  className="mt-6 inline-block text-sm font-bold uppercase text-gcao-green hover:underline"
                >
                  Learn More →
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-gcao-warm py-16" delay={100}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <PlaceholderImage label={siteContent.placeholders[2].label} aspect="square" />
          <div>
            <span className="rounded bg-gcao-red px-3 py-1 text-xs font-bold uppercase text-white">
              Featured Program
            </span>
            <h2 className="mt-4 text-3xl font-black">{siteContent.featuredProgram.title}</h2>
            <p className="mt-4 text-gray-700">{siteContent.featuredProgram.description}</p>
            <a
              href="#"
              className="btn-premium mt-6 inline-block rounded bg-gcao-green px-6 py-3 text-sm font-bold uppercase text-white"
            >
              Register Now
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="events" className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gcao-green">
            Upcoming Events
          </h2>
          <article className="mt-8 flex flex-col gap-6 rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-md md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-gcao-green text-white">
              <span className="text-xs font-bold uppercase">Ongoing</span>
              <span className="text-2xl font-black">HC</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{siteContent.featuredEvent.title}</h3>
              <p className="mt-1 text-sm text-gcao-green">{siteContent.featuredEvent.location}</p>
              <p className="mt-2 text-sm text-gray-600">{siteContent.featuredEvent.description}</p>
            </div>
            <a
              href="#"
              className="btn-premium shrink-0 rounded bg-gcao-gold px-5 py-2.5 text-sm font-bold text-gcao-green"
            >
              Details
            </a>
          </article>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-y border-gray-200 bg-white py-12" delay={100}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {siteContent.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-gcao-green md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="news" className="py-16" delay={100}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gcao-green">
            Latest News
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {siteContent.news.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <PlaceholderImage
                  label={`News: ${item.tag}`}
                  aspect="wide"
                  className="rounded-none border-0 border-b-2 border-dashed"
                />
                <div className="p-5">
                  <span className="text-xs font-bold uppercase text-gcao-red">{item.tag}</span>
                  <h3 className="mt-2 font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact" className="bg-gcao-green py-16 text-white" delay={100}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black uppercase">Find Us</h2>
            <div className="mt-6 space-y-2 text-white/90">
              <p>{siteContent.contact.address}</p>
              <p>{siteContent.contact.hours}</p>
              <p>{siteContent.contact.phone}</p>
              <p>{siteContent.contact.email}</p>
            </div>
          </div>
          <PlaceholderImage
            label={siteContent.placeholders[0].label}
            aspect="wide"
            className="border-white/30"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection id="donate" className="bg-gcao-red py-16 text-white" delay={100}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-black uppercase">Donate to the Resource Center</h2>
          <p className="mt-4 text-white/90">
            Help us expand programs for youth, seniors, and families across Ontario.
          </p>
          <a
            href="#"
            className="btn-premium mt-8 inline-block rounded bg-gcao-gold px-8 py-3 text-sm font-black uppercase text-gcao-green"
          >
            Give Now
          </a>
        </div>
      </AnimatedSection>

      <footer className="bg-gray-900 py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <Logo size={36} showText={false} />
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} {siteContent.orgName}. Design preview only.
          </p>
        </div>
      </footer>
    </div>
  );
}
