import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
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

interface SankofaFaqProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaFaq({ theme, optionLabel, basePath }: SankofaFaqProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const link = isLight ? "text-[#006B3F] hover:underline" : "text-[#FCD116] hover:underline";
  const { faq } = siteContent;

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
        <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
          FAQ
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          Questions we hear often
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">{faq.intro}</p>
        <nav
          aria-label="FAQ sections"
          className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-[#EFEDE4]"
        >
          {faq.groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="rounded-full border border-white/25 px-4 py-2 transition-colors hover:border-[#FCD116] hover:text-[#FCD116]"
            >
              {group.label}
            </a>
          ))}
        </nav>
      </SankofaKenteHero>

      {faq.groups.map((group, index) => (
        <AnimatedSection
          key={group.id}
          id={group.id}
          className={`px-6 py-24 md:px-10 md:py-32 ${index === 0 ? "" : `border-t ${t.panelBorder}`} ${
            index % 2 === 1 ? t.band : ""
          }`}
        >
          <div className="mx-auto max-w-3xl">
            <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {group.label}
            </p>
            <dl className="mt-10 space-y-10">
              {group.items.map((item) => (
                <div key={item.question}>
                  <dt className="text-2xl font-semibold tracking-tight" style={display}>
                    {item.question}
                  </dt>
                  <dd className={`mt-3 text-base leading-relaxed ${t.sectionMuted}`}>
                    <p>{item.answer}</p>
                    {item.links?.length ? (
                      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {item.links.map((itemLink) => (
                          <a key={itemLink.href} className={link} href={`${basePath}${itemLink.href}`}>
                            {itemLink.label}
                          </a>
                        ))}
                      </p>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedSection>
      ))}

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
