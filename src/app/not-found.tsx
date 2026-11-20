"use client";

import Link from "next/link";
import { Sora } from "next/font/google";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { useSankofaAppearance } from "@/components/previews/sankofaThemeContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export default function NotFound() {
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
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-36 md:px-10">
        <p className={`text-[13px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
          404
        </p>
        <h1 className={`mt-4 text-4xl tracking-tight md:text-6xl ${t.heroTitle}`} style={display}>
          Page not found
        </h1>
        <p className={`mt-6 text-lg leading-relaxed ${t.sectionMuted}`}>
          That address is not on this site.
        </p>
        <Link
          href="/"
          className={`mt-10 inline-flex rounded-full px-6 py-3 text-sm font-semibold ${t.ctaPrimary}`}
        >
          Back to the home page
        </Link>
      </main>
      <SankofaFooter theme={theme} tokens={t} basePath={basePath} />
    </div>
  );
}
