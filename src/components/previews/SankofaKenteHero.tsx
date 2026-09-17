import type { ReactNode } from "react";
import { SiteImage } from "@/components/shared/SiteImage";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteImages } from "@/lib/images";

interface SankofaKenteHeroProps {
  theme: SankofaTheme;
  children: ReactNode;
}

export function SankofaKenteHero({ theme, children }: SankofaKenteHeroProps) {
  const t = sankofaThemes[theme];

  return (
    <section
      className={`relative overflow-hidden border-b px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-40 ${t.aboutHero}`}
    >
      <SiteImage
        src={siteImages.aboutKente.src}
        alt=""
        className="absolute inset-0"
        overlay={t.kenteOverlay}
        sizes="100vw"
        priority
      />
      <div className="relative z-10 mx-auto max-w-4xl">{children}</div>
    </section>
  );
}
