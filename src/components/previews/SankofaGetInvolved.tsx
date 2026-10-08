import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { GetInvolvedForm } from "@/components/previews/GetInvolvedForm";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { salesforceConfigured } from "@/lib/salesforce";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

type MarkName = "clock" | "people" | "briefcase" | "megaphone" | "calendar" | "pencil" | "book";

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
      {name === "clock" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4.5l2.8 1.8" />
        </>
      ) : null}
      {name === "people" ? (
        <>
          <circle cx="9" cy="8" r="2.2" />
          <circle cx="16" cy="9" r="1.7" />
          <path d="M4.5 18.2c.7-2.5 2.5-3.7 4.5-3.7s3.8 1.2 4.5 3.7" />
          <path d="M14.2 14.8c1.1-.4 2.2-.5 3.2-.1 1.3.5 2.1 1.6 2.4 3.5" />
        </>
      ) : null}
      {name === "briefcase" ? (
        <>
          <rect x="3" y="8" width="18" height="11" rx="2" />
          <path d="M8 8V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V8M3 13h18" />
        </>
      ) : null}
      {name === "megaphone" ? (
        <>
          <path d="M4 10.2v3.6h2.8L14 18V6L6.8 10.2H4z" />
          <path d="M16.5 9.2a3.2 3.2 0 0 1 0 5.6" />
          <path d="M7.6 14.2 8.4 18" />
        </>
      ) : null}
      {name === "calendar" ? (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3.5V7M16 3.5V7M4 10h16" />
        </>
      ) : null}
      {name === "pencil" ? (
        <>
          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
          <path d="M13.5 6.5 16.5 9.5" />
        </>
      ) : null}
      {name === "book" ? (
        <>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 4H19v14.5H7.5A2.5 2.5 0 0 0 5 21z" />
          <path d="M5 19.2A2.5 2.5 0 0 1 7.5 17H19" />
        </>
      ) : null}
    </svg>
  );
}

const roles: { title: string; copy: string; icon: MarkName }[] = [
  {
    title: "Communications and marketing",
    copy: "Brand, website, social media, and public messages.",
    icon: "megaphone",
  },
  {
    title: "Event planning",
    copy: "Venues, costs, and running GCAO events.",
    icon: "calendar",
  },
  {
    title: "Volunteer coordination",
    copy: "Help volunteers work well with the organization.",
    icon: "people",
  },
  {
    title: "Writing and editing",
    copy: "News, press releases, and articles for the site.",
    icon: "pencil",
  },
  {
    title: "Homework Club tutoring",
    copy: "Math and English support for students.",
    icon: "book",
  },
];

interface SankofaGetInvolvedProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaGetInvolved({ theme, optionLabel, basePath }: SankofaGetInvolvedProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const configured = salesforceConfigured();
  const iconBox = isLight
    ? "bg-[#006B3F]/10 text-[#006B3F]"
    : "bg-[#FCD116]/10 text-[#FCD116]";
  const sections: { label: string; href: string; icon: MarkName }[] = [
    { label: "Volunteer", href: "#volunteer", icon: "clock" },
    { label: "Membership", href: "#membership", icon: "people" },
    { label: "Jobs", href: "#jobs", icon: "briefcase" },
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
          Get involved
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          There is a place for you here
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Volunteer with GCAO, ask about membership, or leave your details for future roles. You can
          also{" "}
          <a href={`${basePath}/donate`} className="underline decoration-1 underline-offset-4">
            donate
          </a>{" "}
          to keep the Resource Hub open.
        </p>
        <nav aria-label="Get involved sections" className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-[#EFEDE4]">
          {sections.map((item) => (
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

      <AnimatedSection id="volunteer" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              Volunteer
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
              Your time keeps the Hub going
            </h2>
            <p className={`mt-6 max-w-md text-base leading-relaxed ${t.sectionMuted}`}>
              GCAO needs volunteers through the year for events, children’s programs, heritage programs,
              and communications.
            </p>
            <ul className="mt-10 space-y-6">
              {roles.map((role) => (
                <li key={role.title} className="flex gap-4">
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBox}`}
                  >
                    <Mark name={role.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold" style={display}>
                      {role.title}
                    </p>
                    <p className={`mt-1 text-sm leading-relaxed ${t.cardMuted}`}>{role.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className={`mt-8 max-w-md text-sm leading-relaxed ${t.cardMuted}`}>
              Volunteers who keep showing up are recognized, and that recognition sometimes goes further
              than a thank-you.
            </p>
          </div>
          <div className={`rounded-[2rem] border p-6 md:p-10 ${t.card}`}>
            <GetInvolvedForm kind="Volunteer" isLight={isLight} configured={configured} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="membership" className={`border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder}`}>
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              Membership
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBox}`}>
                <Mark name="people" className="h-6 w-6" />
              </span>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
                Become part of GCAO
              </h2>
            </div>
            <p className={`mt-6 max-w-md text-base leading-relaxed ${t.sectionMuted}`}>
              Association membership is separate from the Members sign-in used to draft posts. Leave
              your details and we will tell you how to join when membership opens.
            </p>
          </div>
          <div className={`rounded-[2rem] border p-6 md:p-10 ${t.card}`}>
            <GetInvolvedForm kind="Membership" isLight={isLight} configured={configured} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="jobs" className={`border-t px-6 py-24 md:px-10 md:py-32 ${t.panelBorder}`}>
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              Jobs
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBox}`}>
                <Mark name="briefcase" className="h-6 w-6" />
              </span>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl" style={display}>
                No openings are listed yet
              </h2>
            </div>
            <p className={`mt-6 max-w-md text-base leading-relaxed ${t.sectionMuted}`}>
              When a role is posted, we will contact people who have already told us what they do.
            </p>
          </div>
          <div className={`rounded-[2rem] border p-6 md:p-10 ${t.card}`}>
            <GetInvolvedForm kind="Jobs" isLight={isLight} configured={configured} />
          </div>
        </div>
      </AnimatedSection>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
