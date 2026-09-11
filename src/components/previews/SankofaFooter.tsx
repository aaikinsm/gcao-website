import { siteContent } from "@/lib/content";
import { footerLinks } from "@/lib/navigation-ia";
import type { SankofaTheme, SankofaThemeTokens } from "@/components/previews/sankofaTheme";

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface SankofaFooterProps {
  theme: SankofaTheme;
  tokens: SankofaThemeTokens;
}

export function SankofaFooter({ theme, tokens: t }: SankofaFooterProps) {
  return (
    <footer id="contact" className={`border-t ${t.footer}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${t.eyebrow}`}>
              {siteContent.orgShort}
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={display}>
              {siteContent.orgName}
            </p>
            <p className={`mt-4 text-sm ${t.footerMuted}`}>{siteContent.contact.address}</p>
            <p className={`mt-1 text-sm ${t.footerMuted}`}>{siteContent.contact.hours}</p>
            <p className={`mt-4 text-sm ${t.footerMuted}`}>
              <a href={`tel:${siteContent.contact.phone}`} className={t.footerLink}>
                {siteContent.contact.phone}
              </a>
              <span className="mx-2 opacity-40">·</span>
              <a href={`mailto:${siteContent.contact.email}`} className={t.footerLink}>
                {siteContent.contact.email}
              </a>
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-3"
          >
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${t.footerLink}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p
          className={`mt-14 border-t pt-6 text-xs ${t.footerMuted} ${
            theme === "light" ? "border-black/10" : "border-white/10"
          }`}
        >
          © {new Date().getFullYear()} {siteContent.orgName}
        </p>
      </div>
    </footer>
  );
}
