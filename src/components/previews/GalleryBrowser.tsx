"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import { SiteImage } from "@/components/shared/SiteImage";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { gallerySections, type GalleryPhoto, type GallerySection } from "@/lib/gallery";

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

interface GalleryBrowserProps {
  theme: SankofaTheme;
}

export function GalleryBrowser({ theme }: GalleryBrowserProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const accent = isLight ? "text-[#006B3F]" : "text-[#FCD116]";
  const chipHover = isLight
    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
    : "hover:border-[#FCD116] hover:text-[#FCD116]";
  const field = isLight
    ? "border-black/15 bg-white text-[#0F1B14] placeholder:text-[#0F1B14]/40"
    : "border-white/15 bg-white/[0.04] text-[#EFEDE4] placeholder:text-[#EFEDE4]/40";
  const focusRing = isLight
    ? "focus:border-[#006B3F] focus:outline-none focus:ring-2 focus:ring-[#006B3F]/30"
    : "focus:border-[#FCD116] focus:outline-none focus:ring-2 focus:ring-[#FCD116]/30";

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return gallerySections
      .map((section) => {
        if (!needle) return section;
        const sectionMatches =
          section.name.toLowerCase().includes(needle) || section.blurb.toLowerCase().includes(needle);
        const photos = sectionMatches
          ? section.photos
          : section.photos.filter((photo) => photo.title.toLowerCase().includes(needle));
        return { ...section, photos };
      })
      .filter((section) => section.photos.length > 0);
  }, [query]);

  const active = gallerySections
    .flatMap((section) => section.photos)
    .find((photo) => photo.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <nav
        aria-label="Gatherings"
        className={`sticky top-[calc(36px+4.25rem)] z-40 border-b backdrop-blur-xl ${
          isLight ? "border-black/10 bg-[#FFFBF2]/90" : "border-white/[0.08] bg-[#06110D]/90"
        }`}
      >
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-3 md:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${t.panelBorder} ${chipHover}`}
            >
              {section.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <label className="block max-w-sm" htmlFor={searchId}>
            <span className={`text-sm font-medium ${t.cardMuted}`}>Find a picture</span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Dinner, seniors, flag…"
              className={`mt-2 w-full rounded-full border px-4 py-2.5 text-sm ${field} ${focusRing}`}
            />
          </label>

          {sections.length === 0 ? (
            <p className={`mt-12 text-base ${t.sectionMuted}`}>Nothing matches that.</p>
          ) : (
            <div className="mt-14 space-y-20">
              {sections.map((section) => (
                <GatheringSection
                  key={section.id}
                  section={section}
                  theme={theme}
                  onOpen={setActiveId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 md:p-8"
          onClick={() => setActiveId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-dialog-title"
            className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border p-4 md:p-6 ${t.card} ${
              isLight ? "bg-[#FFFBF2]" : "bg-[#06110D]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="gallery-dialog-title" className="text-xl font-semibold tracking-tight" style={display}>
                  {active.title}
                </h2>
                <p className={`mt-1 text-sm ${t.cardMuted}`}>{active.collection}</p>
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setActiveId(null)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${t.panelBorder} ${accent}`}
              >
                Close
              </button>
            </div>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-black/20">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(min-width: 768px) 896px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GatheringSection({
  section,
  theme,
  onOpen,
}: {
  section: GallerySection;
  theme: SankofaTheme;
  onOpen: (id: string) => void;
}) {
  const t = sankofaThemes[theme];

  return (
    <section id={section.id} className="scroll-mt-[calc(36px+8.5rem)]">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl" style={display}>
        {section.name}
      </h2>
      <p className={`mt-3 max-w-xl text-base ${t.sectionMuted}`}>{section.blurb}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} theme={theme} onOpen={() => onOpen(photo.id)} />
        ))}
      </div>
    </section>
  );
}

function PhotoCard({
  photo,
  theme,
  onOpen,
}: {
  photo: GalleryPhoto;
  theme: SankofaTheme;
  onOpen: () => void;
}) {
  const t = sankofaThemes[theme];
  const titleHover = theme === "light" ? "group-hover:text-[#006B3F]" : "group-hover:text-[#FCD116]";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${photo.title}`}
      className={`group overflow-hidden rounded-3xl border text-left ${t.card} ${t.panelBorder}`}
    >
      <span className="relative block aspect-[4/3] overflow-hidden">
        <SiteImage
          src={photo.src}
          alt=""
          className="absolute inset-0 h-full w-full"
          imageClassName="img-zoom"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </span>
      <span className="block p-5">
        <span
          className={`block text-base font-semibold tracking-tight transition-colors ${titleHover}`}
          style={display}
        >
          {photo.title}
        </span>
      </span>
    </button>
  );
}
