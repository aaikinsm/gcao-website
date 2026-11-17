"use client";

import { Sora } from "next/font/google";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaDonateReturnProps {
  paid: boolean;
  amount: string | null;
  monthly: boolean;
}

export function SankofaDonateReturn({ paid, amount, monthly }: SankofaDonateReturnProps) {
  const { theme, t, basePath } = useSankofaAppearance();

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
          {paid ? "Thank you" : "Gift not completed"}
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.heroBody}`}>
          {paid
            ? `${amount ? `${amount} ` : ""}${monthly ? "will be given each month." : "was received."} It supports programs at the Resource Hub.`
            : "This payment was not completed. You can return to the donate page and try again."}
        </p>
        {!paid && (
          <a
            href={`${basePath}/donate`}
            className="mt-10 inline-flex rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D]"
          >
            Back to donate
          </a>
        )}
      </SankofaKenteHero>

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
