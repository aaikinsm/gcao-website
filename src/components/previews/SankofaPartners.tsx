"use client";

import { Sora } from "next/font/google";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { siteContent } from "@/lib/content";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function SankofaPartners() {
  const { theme, t, isLight, basePath } = useSankofaAppearance();
  const link = isLight ? "text-[#006B3F] hover:underline" : "text-[#FCD116] hover:underline";
  const { partners } = siteContent;

  return (
    <div className={`${sora.variable} ${t.page}`}>
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
        <p className={`text-[13px] uppercase tracking-[0.28em] ${t.heroEyebrow}`}>Community</p>
        <h1
          className={`mt-5 text-4xl tracking-[-0.03em] text-balance md:text-6xl ${t.heroTitle}`}
          style={display}
        >
          {partners.title}
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.heroBody}`}>{partners.intro}</p>
        <nav
          aria-label="Partner groups"
          className={`mt-10 flex flex-wrap gap-3 text-sm font-medium ${t.heroTitle}`}
        >
          {partners.groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className={`rounded-full border px-4 py-2 ${t.heroChip}`}
            >
              {group.label}
            </a>
          ))}
        </nav>
      </SankofaKenteHero>

      {partners.groups.map((group, index) => (
        <AnimatedSection
          key={group.id}
          id={group.id}
          className={`scroll-mt-28 px-6 py-24 md:px-10 md:py-32 ${
            index === 0 ? "" : `border-t ${t.panelBorder}`
          } ${index % 2 === 1 ? t.band : ""}`}
        >
          <div className="mx-auto max-w-6xl">
            <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {group.label}
            </p>
            <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className={`rounded-3xl border p-6 ${isLight ? "border-black/10" : "border-white/10"}`}
                >
                  {item.logo ? (
                    <div className="mb-5 flex h-24 items-center justify-center rounded-2xl bg-[#FFFBF2] px-4">
                      <img src={item.logo} alt="" className="max-h-14 w-auto max-w-full object-contain" />
                    </div>
                  ) : null}
                  <h2 className="text-xl font-semibold tracking-tight" style={display}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </h2>
                  <p className={`mt-3 text-base leading-relaxed ${t.sectionMuted}`}>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      ))}

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
