import { Sora } from "next/font/google";
import { PreviewBanner } from "@/components/shared/PreviewBanner";
import { SankofaFooter } from "@/components/previews/SankofaFooter";
import { SankofaHeader } from "@/components/previews/SankofaHeader";
import { SankofaKenteHero } from "@/components/previews/SankofaKenteHero";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { getCheckoutSession } from "@/lib/stripe";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaDonateReturnProps {
  theme: SankofaTheme;
  optionLabel: string;
  basePath: string;
  sessionId?: string;
}

function formatAmount(cents: number | null, currency: string | null) {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency ?? "cad").toUpperCase(),
  }).format(cents / 100);
}

export async function SankofaDonateReturn({
  theme,
  optionLabel,
  basePath,
  sessionId,
}: SankofaDonateReturnProps) {
  const t = sankofaThemes[theme];
  const session = sessionId ? await getCheckoutSession(sessionId) : null;
  const paid = session?.status === "complete" || session?.payment_status === "paid";
  const amount = formatAmount(session?.amount_total ?? null, session?.currency ?? null);
  const monthly = session?.mode === "subscription";

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
          {paid ? "Thank you" : "Gift not completed"}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#EFEDE4]/75">
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

      <SankofaFooter theme={theme} tokens={t} />
    </div>
  );
}
