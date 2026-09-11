"use client";

import { useState } from "react";
import { SiteImage } from "@/components/shared/SiteImage";
import type { SankofaThemeTokens } from "@/components/previews/sankofaTheme";

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

export type ServePanel = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};

interface ServePanelsProps {
  panels: ServePanel[];
  tokens: Pick<
    SankofaThemeTokens,
    "panelBorder" | "panelOverlay" | "panelHover" | "panelDesc" | "panelPlus"
  >;
}

export function ServePanels({ panels, tokens: t }: ServePanelsProps) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (title: string) => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    setOpen((current) => (current === title ? null : title));
  };

  return (
    <div className="mt-14 flex flex-col gap-4 md:h-[460px] md:flex-row">
      {panels.map((panel) => {
        const expanded = open === panel.title;

        return (
          <button
            key={panel.title}
            type="button"
            aria-expanded={expanded}
            onClick={() => toggle(panel.title)}
            className={`group relative flex-1 overflow-hidden rounded-3xl border text-left transition-all duration-700 ease-out md:h-full md:hover:flex-[2.4] ${
              expanded ? "h-80" : "h-52"
            } ${t.panelBorder}`}
          >
            <SiteImage
              {...panel.image}
              className="absolute inset-0"
              imageClassName="img-zoom"
              overlay={t.panelOverlay}
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
              <h3
                className={`text-xl font-semibold tracking-tight transition-colors md:text-2xl ${t.panelHover}`}
                style={display}
              >
                {panel.title}
              </h3>
              <p
                className={`mt-3 max-w-sm text-sm leading-relaxed transition-all duration-500 md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100 ${
                  expanded ? "max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                } ${t.panelDesc}`}
              >
                {panel.description}
              </p>
            </div>
            <span
              className={`absolute right-6 top-6 h-8 w-8 rounded-full border text-center text-sm leading-7 transition-transform duration-500 md:group-hover:rotate-45 ${
                expanded ? "rotate-45" : ""
              } ${t.panelPlus}`}
            >
              +
            </span>
          </button>
        );
      })}
    </div>
  );
}
