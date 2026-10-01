import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { DonateCheckout } from "@/components/previews/DonateCheckout";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { stripeConfigured } from "@/lib/stripe";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaDonateProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaDonate({ theme, optionLabel, basePath }: SankofaDonateProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";

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
          Donate
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          Support GCAO
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Give once, or monthly. Your gift supports Ghanaian-Canadian communities across Ontario.
        </p>
      </SankofaKenteHero>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <DonateCheckout basePath={basePath} isLight={isLight} configured={stripeConfigured()} />
        </div>
      </section>

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
