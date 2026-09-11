export type SankofaTheme = "light" | "dark";

export const sankofaThemes = {
  dark: {
    page: "bg-[#06110D] text-[#EFEDE4]",
    header: "border-white/[0.08] bg-[#06110D]/55 text-[#EFEDE4]",
    logoText: "hidden text-[#EFEDE4] lg:block",
    nav: "text-[#EFEDE4]/70 hover:text-[#FCD116]",
    donateOutline:
      "border border-[#FCD116]/60 text-[#FCD116] hover:bg-[#FCD116] hover:text-[#06110D]",
    menuBg: "bg-[#06110D]",
    eyebrow: "text-[#FCD116]",
    heroSub: "text-[#EFEDE4]/75",
    ctaPrimary: "bg-[#FCD116] text-[#06110D]",
    ctaSecondary:
      "border border-white/25 hover:border-[#FCD116]/70 hover:text-[#FCD116]",
    statsWrap: "border-white/[0.08]",
    statsValue: "text-[#FCD116]",
    statsLabel: "text-[#EFEDE4]/45",
    missionGlow:
      "bg-[radial-gradient(ellipse_40%_60%_at_50%_0%,rgba(252,209,22,0.08),transparent_70%)]",
    sectionMuted: "text-[#EFEDE4]/45",
    panelBorder: "border-white/10",
    panelOverlay:
      "bg-gradient-to-t from-[#06110D] via-[#06110D]/55 to-[#06110D]/10",
    panelDesc: "text-[#EFEDE4]/70",
    panelHover: "group-hover:text-[#FCD116]",
    panelPlus: "border-[#FCD116]/50 text-[#FCD116]",
    eventOverlay:
      "bg-gradient-to-r from-[#06110D] via-[#06110D]/80 to-[#06110D]/25",
    eventMeta: "text-[#EFEDE4]/50",
    eventBody: "text-[#EFEDE4]/70",
    eventLoc: "text-[#EFEDE4]/45",
    newsExcerpt: "text-[#EFEDE4]/50",
    donateBox: "border-white/10",
    donateGlow:
      "bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(11,107,69,0.55),transparent_70%)]",
    donateCopy: "text-[#EFEDE4]/65",
    donateSecondary:
      "border border-white/20 hover:border-[#FCD116]/60 hover:text-[#FCD116]",
    footer: "border-white/[0.08] bg-black/30",
    footerMuted: "text-[#EFEDE4]/45",
    footerLink: "text-[#EFEDE4]/65 hover:text-[#FCD116]",
    scrollMuted: "text-white/25",
    scrollFilled: "text-[#EFEDE4]",
    videoOverlay:
      "bg-gradient-to-t from-[#06110D] via-[#06110D]/70 to-[#06110D]/45",
    aboutHero: "bg-[#0A1611]",
    card: "border-white/10 bg-white/[0.03]",
    cardMuted: "text-[#EFEDE4]/60",
  },
  light: {
    page: "bg-[#FFFBF2] text-[#0F1B14]",
    header: "border-black/10 bg-white/80 text-[#0F1B14]",
    logoText: "hidden text-[#0F1B14] lg:block",
    nav: "text-[#0F1B14]/65 hover:text-[#006B3F]",
    donateOutline:
      "border border-[#006B3F] text-[#006B3F] hover:bg-[#006B3F] hover:text-white",
    menuBg: "bg-[#FFFBF2]",
    eyebrow: "text-[#FCD116]",
    heroSub: "text-white/80",
    ctaPrimary: "bg-[#FCD116] text-[#06110D]",
    ctaSecondary:
      "border border-white/40 text-white hover:border-[#FCD116] hover:text-[#FCD116]",
    statsWrap: "border-black/10 bg-white",
    statsValue: "text-[#006B3F]",
    statsLabel: "text-[#0F1B14]/50",
    missionGlow:
      "bg-[radial-gradient(ellipse_40%_60%_at_50%_0%,rgba(0,107,63,0.08),transparent_70%)]",
    sectionMuted: "text-[#0F1B14]/50",
    panelBorder: "border-black/10",
    panelOverlay:
      "bg-gradient-to-t from-[#0F1B14] via-[#0F1B14]/50 to-transparent",
    panelDesc: "text-white/75",
    panelHover: "group-hover:text-[#FCD116]",
    panelPlus: "border-[#FCD116]/60 text-[#FCD116]",
    eventOverlay:
      "bg-gradient-to-r from-[#0F1B14] via-[#0F1B14]/75 to-[#0F1B14]/20",
    eventMeta: "text-white/55",
    eventBody: "text-white/75",
    eventLoc: "text-white/50",
    newsExcerpt: "text-[#0F1B14]/55",
    donateBox: "border-black/10 bg-white shadow-[0_8px_40px_rgba(15,27,20,0.08)]",
    donateGlow:
      "bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(0,107,63,0.12),transparent_70%)]",
    donateCopy: "text-[#0F1B14]/65",
    donateSecondary:
      "border border-[#0F1B14]/20 hover:border-[#006B3F] hover:text-[#006B3F]",
    footer: "border-black/10 bg-white",
    footerMuted: "text-[#0F1B14]/45",
    footerLink: "text-[#0F1B14]/65 hover:text-[#006B3F]",
    scrollMuted: "text-[#0F1B14]/25",
    scrollFilled: "text-[#0F1B14]",
    videoOverlay:
      "bg-gradient-to-t from-[#0F1B14]/90 via-[#0F1B14]/55 to-[#0F1B14]/40",
    aboutHero: "bg-[#F3EEE3]",
    card: "border-black/10 bg-white",
    cardMuted: "text-[#0F1B14]/60",
  },
} as const;

export type SankofaThemeTokens = (typeof sankofaThemes)[SankofaTheme];

/** Build preview nav links scoped to a Sankofa theme base path. */
export function getSankofaNav(basePath: string) {
  return [
    { label: "About", href: `${basePath}/about` },
    { label: "Programs", href: `${basePath}/programs` },
    { label: "Events", href: `${basePath}#events` },
    { label: "News", href: `${basePath}#news` },
    { label: "Get Involved", href: `${basePath}#get-involved` },
    { label: "Contact", href: `${basePath}#contact` },
  ];
}
