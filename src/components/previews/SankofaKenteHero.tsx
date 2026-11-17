import type { ReactNode } from "react";
import { SiteImage } from "@/components/shared/SiteImage";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteImages } from "@/lib/images";

interface SankofaKenteHeroProps {
  theme: SankofaTheme;
  children: ReactNode;
}

const lightKenteOverlay =
  "bg-[linear-gradient(to_bottom,rgba(255,251,242,0.5)_0%,rgba(255,251,242,0.9)_52%,rgba(255,251,242,0.96)_100%)]";

export function SankofaKenteHero({ theme, children }: SankofaKenteHeroProps) {
  const t = sankofaThemes[theme];
  const overlay = theme === "light" ? lightKenteOverlay : t.kenteOverlay;

  return (
    <section
      className={`relative overflow-hidden border-b px-6 pb-16 pt-36 md:px-10 md:pb-20 md:pt-40 ${t.aboutHero}`}
    >
      <SiteImage
        src={siteImages.aboutKente.src}
        alt=""
        className="absolute inset-0"
        imageClassName="animate-kente-drift"
        overlay={overlay}
        sizes="100vw"
        priority
      />
      <div className="relative z-10 mx-auto max-w-4xl">{children}</div>
    </section>
  );
}
