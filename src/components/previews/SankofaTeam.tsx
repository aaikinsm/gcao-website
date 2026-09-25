"use client";

import { useState } from "react";
import { SiteImage } from "@/components/shared/SiteImage";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";
import { siteContent } from "@/lib/content";
import { siteImages } from "@/lib/images";

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

type TeamMember = {
  name: string;
  role: string;
  image?: string;
  alt?: string;
};

function hasPhoto(member: TeamMember): member is TeamMember & { image: string } {
  return Boolean(member.image);
}

interface SankofaTeamProps {
  theme: SankofaTheme;
}

const TITLE_SKIP = new Set(["dr", "mr", "mrs", "ms", "alhaji"]);

function memberInitials(name: string) {
  const parts = name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter((part) => part && !TITLE_SKIP.has(part.toLowerCase()));
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function KentePlaceholder({
  name,
  overlay,
  className,
  initialsClassName,
  showInitials = true,
}: {
  name: string;
  overlay: string;
  className?: string;
  initialsClassName?: string;
  showInitials?: boolean;
}) {
  const positioned = /(?:^|\s)(?:absolute|fixed|sticky)(?:\s|$)/.test(className ?? "");
  return (
    <div className={`${positioned ? "" : "relative"} overflow-hidden ${className ?? ""}`}>
      <SiteImage
        src={siteImages.aboutKente.src}
        alt=""
        className="absolute inset-0"
        overlay={overlay}
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      {showInitials && (
        <span
          className={`absolute inset-0 z-10 flex items-center justify-center font-semibold tracking-wide text-[#EFEDE4] ${initialsClassName ?? "text-2xl md:text-3xl"}`}
          style={display}
          aria-hidden
        >
          {memberInitials(name)}
        </span>
      )}
    </div>
  );
}

export function SankofaTeam({ theme }: SankofaTeamProps) {
  const t = sankofaThemes[theme];
  const isLight = theme === "light";
  const groups = siteContent.about.teamGroups;
  const [activeId, setActiveId] = useState(groups[0].id);
  const active = groups.find((group) => group.id === activeId) ?? groups[0];
  const chipHover = isLight
    ? "hover:border-[#006B3F] hover:text-[#006B3F]"
    : "hover:border-[#FCD116] hover:text-[#FCD116]";
  const chipActive = isLight
    ? "border-[#006B3F] bg-[#006B3F] text-white"
    : "border-[#FCD116] bg-[#FCD116] text-[#06110D]";
  const hoverOverlay = isLight
    ? "bg-gradient-to-t from-[#006B3F]/55 via-[#006B3F]/15 to-transparent"
    : "bg-gradient-to-t from-black/70 via-[#FCD116]/15 to-transparent";

  return (
    <div>
      <div role="tablist" aria-label="Leadership groups" className="mt-10 flex flex-wrap gap-3">
        {groups.map((group) => {
          const selected = group.id === active.id;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              id={`team-tab-${group.id}`}
              aria-selected={selected}
              aria-controls={`team-panel-${group.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(group.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected ? chipActive : `${t.panelBorder} ${chipHover}`
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {groups.map((group) => (
        <div
          key={group.id}
          role="tabpanel"
          id={`team-panel-${group.id}`}
          aria-labelledby={`team-tab-${group.id}`}
          hidden={group.id !== active.id}
          className="mt-10"
        >
          {group.layout === "list" ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.members.map((raw) => {
                const member: TeamMember = raw;
                return (
                <li
                  key={member.name}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-3 ${t.card} ${t.panelBorder}`}
                >
                  <MemberAvatar member={member} overlay={t.kenteOverlay} />
                  <div className="min-w-0">
                    <p className="font-semibold tracking-tight" style={display}>
                      {member.name}
                    </p>
                    <p className={`mt-0.5 text-sm ${t.cardMuted}`}>{member.role}</p>
                  </div>
                </li>
                );
              })}
            </ul>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.members.map((raw) => {
                const member: TeamMember = raw;
                return (
                <article
                  key={member.name}
                  className={`group overflow-hidden rounded-3xl border ${t.card} ${t.panelBorder}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {hasPhoto(member) ? (
                      <>
                        <SiteImage
                          src={member.image}
                          alt={member.alt ?? member.name}
                          className="absolute inset-0 h-full w-full"
                          imageClassName="img-zoom"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                        <div
                          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${hoverOverlay}`}
                          aria-hidden
                        />
                      </>
                    ) : (
                      <KentePlaceholder
                        name={member.name}
                        overlay={t.kenteOverlay}
                        className="absolute inset-0"
                        showInitials={false}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold tracking-tight" style={display}>
                      {member.name}
                    </h3>
                    <p className={`mt-2 text-sm ${t.cardMuted}`}>{member.role}</p>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MemberAvatar({ member, overlay }: { member: TeamMember; overlay: string }) {
  if (hasPhoto(member)) {
    return (
      <SiteImage
        src={member.image}
        alt={member.alt ?? member.name}
        className="h-14 w-14 shrink-0 rounded-full"
        sizes="56px"
      />
    );
  }

  return (
    <KentePlaceholder
      name={member.name}
      overlay={overlay}
      className="h-14 w-14 shrink-0 rounded-full"
      initialsClassName="text-sm"
    />
  );
}
