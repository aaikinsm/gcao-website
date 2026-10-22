import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { GalleryBrowser } from "@/components/previews/GalleryBrowser";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { firstGallerySectionId } from "@/lib/gallery";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaGalleryProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
}

export function SankofaGallery({ theme, optionLabel, basePath }: SankofaGalleryProps) {
  const t = sankofaThemes[theme];

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
          Gallery
        </p>
        <h1
          className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance text-[#EFEDE4] md:text-6xl"
          style={display}
        >
          Pictures from our gatherings
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
          Dinners, flag raisings, seniors’ days, training, and Black History — moments GCAO keeps
          from the year.
        </p>
        <a
          href={`#${firstGallerySectionId}`}
          className="mt-8 inline-flex rounded-full bg-[#FCD116] px-5 py-2.5 text-sm font-semibold text-[#06110D]"
        >
          See the pictures
        </a>
      </SankofaKenteHero>

      <GalleryBrowser theme={theme} />

      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
