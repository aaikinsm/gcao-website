"use client";

import { Sora } from "next/font/google";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";
import { GalleryBrowser } from "@/components/previews/GalleryBrowser";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { firstGallerySectionId } from "@/lib/gallery";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export function SankofaGallery() {
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
          Gallery
        </p>
        <h1
          className={`mt-5 text-4xl tracking-[-0.03em] text-balance md:text-6xl ${t.heroTitle}`}
          style={display}
        >
          Pictures from our gatherings
        </h1>
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${t.heroBody}`}>
          Dinners, flag raisings, seniors’ days, training, and Black History — moments GCAO keeps
          from the year.
        </p>
        <a
          href={`#${firstGallerySectionId}`}
          className={`mt-8 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-[#06110D] ${
            theme === "light" ? "bg-[#C8960C]" : "bg-[#FCD116]"
          }`}
        >
          See the pictures
        </a>
      </SankofaKenteHero>

      <GalleryBrowser theme={theme} />

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
