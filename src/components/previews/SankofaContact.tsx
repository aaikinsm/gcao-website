import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { ContactForm } from "@/components/previews/ContactForm";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

type MarkName = "pin" | "clock" | "phone" | "envelope" | "pencil";

function Mark({ name, className = "h-4 w-4" }: { name: MarkName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      {name === "pin" ? (
        <>
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.2" />
        </>
      ) : null}
      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l2.8 1.8" />
        </>
      ) : null}
      {name === "phone" ? (
        <path d="M7 3.8h3l1.2 3-1.7 1a12 12 0 0 0 5.5 5.5l1-1.7 3 1.2v3A1.8 1.8 0 0 1 17.2 18 14.2 14.2 0 0 1 5 6.8 1.8 1.8 0 0 1 7 3.8z" />
      ) : null}
      {name === "envelope" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      ) : null}
      {name === "pencil" ? (
        <>
          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
          <path d="M13.5 6.5 16.5 9.5" />
        </>
      ) : null}
    </svg>
  );
}

const marks: Record<string, string> = {
  Facebook: "Fb",
  Instagram: "Ig",
  YouTube: "Yt",
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

interface SankofaContactProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaContact({ theme, optionLabel, basePath }: SankofaContactProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const { contact } = siteContent;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  const label = isLight ? "text-[#0F1B14]/45" : "text-[#EFEDE4]/45";
  const link = isLight ? "hover:text-[#006B3F]" : "hover:text-[#FCD116]";
  const iconBox = isLight
    ? "bg-[#006B3F]/10 text-[#006B3F]"
    : "bg-[#FCD116]/10 text-[#FCD116]";
  const shortcuts: { label: string; href: string; icon: MarkName }[] = [
    { label: "Visit the Hub", href: "#visit", icon: "pin" },
    { label: "Write a message", href: "#write", icon: "pencil" },
  ];

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

      <SankofaKenteHero theme={theme}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
          Contact
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          Get in touch
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Write to the Resource Hub, or visit us on weekday afternoons at 10 Belfield Rd.
        </p>
        <nav
          aria-label="Contact sections"
          className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-[#EFEDE4]"
        >
          {shortcuts.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 transition-colors hover:border-[#FCD116] hover:text-[#FCD116]"
            >
              <Mark name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>
      </SankofaKenteHero>

      <AnimatedSection id="visit" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-start gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              Resource Hub
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              Visit us
            </h2>
            <p className={`mt-6 max-w-md text-base leading-relaxed ${t.sectionMuted}`}>
              The Resource Hub is open Monday to Friday.
            </p>

            <dl className="mt-12 space-y-8">
              <div className="flex gap-4">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBox}`}>
                  <Mark name="pin" className="h-5 w-5" />
                </span>
                <div>
                  <dt className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${label}`}>
                    Address
                  </dt>
                  <dd className="mt-2 text-lg leading-relaxed" style={display}>
                    {contact.address}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBox}`}>
                  <Mark name="clock" className="h-5 w-5" />
                </span>
                <div>
                  <dt className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${label}`}>
                    Hours
                  </dt>
                  <dd className="mt-2 text-lg leading-relaxed" style={display}>
                    {contact.hours}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBox}`}>
                  <Mark name="phone" className="h-5 w-5" />
                </span>
                <div>
                  <dt className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${label}`}>
                    Phone
                  </dt>
                  <dd className="mt-2 space-y-1 text-lg" style={display}>
                    <a className={`block transition-colors ${link}`} href={telHref(contact.phone)}>
                      {contact.phone}
                    </a>
                    <a className={`block transition-colors ${link}`} href={telHref(contact.phoneAlt)}>
                      {contact.phoneAlt}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBox}`}>
                  <Mark name="envelope" className="h-5 w-5" />
                </span>
                <div>
                  <dt className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${label}`}>
                    Email
                  </dt>
                  <dd className="mt-2 text-lg" style={display}>
                    <a className={`transition-colors ${link}`} href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className={`mt-10 inline-flex text-sm font-semibold underline decoration-1 underline-offset-4 ${link}`}
            >
              Get directions
            </a>

            <ul className="mt-12 flex flex-wrap gap-3">
              {contact.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition-colors ${t.panelBorder} ${link}`}
                  >
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${t.eyebrow}`}
                      aria-hidden
                    >
                      {marks[item.label] ?? item.label.slice(0, 2)}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            id="write"
            className={`rounded-[1.75rem] border px-8 py-10 md:px-12 md:py-14 ${
              isLight
                ? "border-black/[0.08] bg-white shadow-[0_24px_60px_rgba(15,27,20,0.06)]"
                : t.card
            }`}
          >
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              Message
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBox}`}>
                <Mark name="pencil" className="h-6 w-6" />
              </span>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
                Write to us
              </h2>
            </div>
            <p className={`mt-4 max-w-md text-sm leading-relaxed ${t.cardMuted}`}>
              Tell us what you need. Programs, membership, and general questions all come to the
              same desk.
            </p>
            <ContactForm email={contact.email} isLight={isLight} />
          </div>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
