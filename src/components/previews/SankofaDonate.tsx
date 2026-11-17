"use client";

import { Sora } from "next/font/google";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";
import { DonateCheckout } from "@/components/previews/DonateCheckout";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaDonateProps {
  configured: boolean;
}

export function SankofaDonate({ configured }: SankofaDonateProps) {
  const { theme, t, isLight, basePath } = useSankofaAppearance();

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
        <p className={`text-[13px] uppercase tracking-[0.28em] ${t.heroEyebrow}`}>
          Donate
        </p>
        <h1
          className={`mt-5 text-4xl tracking-[-0.03em] text-balance md:text-6xl ${t.heroTitle}`}
          style={display}
        >
          Support GCAO
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.heroBody}`}>
          Give once, or monthly. Your gift supports Ghanaian-Canadian communities across Ontario.
        </p>
      </SankofaKenteHero>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <DonateCheckout basePath={basePath} isLight={isLight} configured={configured} />
        </div>
      </section>

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
