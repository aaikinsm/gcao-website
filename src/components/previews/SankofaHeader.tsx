"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/shared/Logo";
import { getSankofaNav } from "@/components/previews/sankofaTheme";
import { useSankofaTheme } from "@/components/previews/sankofaThemeContext";

interface SankofaHeaderProps {
  theme: "light" | "dark";
  basePath: string;
  headerClass: string;
  logoTextClass: string;
  navClass: string;
  donateClass: string;
  menuBgClass: string;
  topClass?: string;
  menuTopClass?: string;
}

export function SankofaHeader({
  theme,
  basePath,
  headerClass,
  logoTextClass,
  navClass,
  donateClass,
  menuBgClass,
  topClass = "top-0",
  menuTopClass = "top-[4.25rem]",
}: SankofaHeaderProps) {
  const { toggleTheme } = useSankofaTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLight = theme === "light";
  const nav = getSankofaNav(basePath);
  const donateHref = `${basePath}/donate`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const links = [
    ...nav,
    { label: "Editors", href: "/cms/login" },
    { label: "Donate", href: donateHref },
  ];

  const mobileMenu =
    open && mounted
      ? createPortal(
          <div
            id="sankofa-mobile-menu"
            className={`fixed inset-x-0 bottom-0 z-[60] overflow-y-auto border-t px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:hidden ${menuTopClass} ${menuBgClass} ${
              isLight ? "border-black/10" : "border-white/10"
            }`}
          >
            <nav className="mx-auto flex max-w-lg flex-col gap-1">
              {links.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  className={`rounded-xl px-4 py-3.5 text-lg font-medium transition-colors ${
                    item.label === "Donate"
                      ? isLight
                        ? "mt-4 bg-[#006B3F] text-center text-white"
                        : "mt-4 bg-[#FCD116] text-center text-[#06110D]"
                      : navClass
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className={`fixed left-0 right-0 z-50 border-b backdrop-blur-xl ${topClass} ${headerClass}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Logo size={42} textClassName={logoTextClass} href={basePath || "/"} />

          <nav className="hidden items-center gap-5 md:flex lg:gap-6">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`nav-link text-[14px] font-medium lg:text-[15px] ${navClass}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/cms/login"
              className={`nav-link hidden text-[12px] font-medium md:inline lg:text-[13px] ${navClass}`}
            >
              Editors
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isLight ? "Switch to dark" : "Switch to light"}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                isLight ? "border-black/15 text-[#0F1B14]" : "border-white/20 text-[#EFEDE4]"
              }`}
            >
              {isLight ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              )}
            </button>
            <a
              href={donateHref}
              className={`btn-premium hidden rounded-full px-5 py-2 text-xs font-semibold transition-colors sm:inline-flex ${donateClass}`}
            >
              Donate
            </a>
            <button
              type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${
                isLight ? "border-black/15" : "border-white/20"
              }`}
              aria-expanded={open}
              aria-controls="sankofa-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-full transition-transform ${
                    isLight ? "bg-[#0F1B14]" : "bg-[#EFEDE4]"
                  } ${open ? "translate-y-[6px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[6px] block h-0.5 w-full transition-opacity ${
                    isLight ? "bg-[#0F1B14]" : "bg-[#EFEDE4]"
                  } ${open ? "opacity-0" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[12px] block h-0.5 w-full transition-transform ${
                    isLight ? "bg-[#0F1B14]" : "bg-[#EFEDE4]"
                  } ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
