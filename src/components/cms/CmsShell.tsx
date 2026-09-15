import type { ReactNode } from "react";
import Link from "next/link";
import { Sora } from "next/font/google";
import { Logo } from "@/components/shared/Logo";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const nav = [
  { label: "Overview", href: "/cms" },
  { label: "Events", href: "/cms/events" },
  { label: "News", href: "/cms/news" },
];

interface CmsShellProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  current: "overview" | "events" | "news";
}

export function CmsShell({ title, description, action, children, current }: CmsShellProps) {
  return (
    <div className={`${sora.variable} min-h-screen bg-[#FFFBF2] text-[#0F1B14]`}>
      <div className="bg-[#0F1B14] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-[#FCD116] md:text-sm">
        Public — anyone can post until login is added.
      </div>

      <header className="border-b border-black/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Logo href="/cms" size={40} textClassName="text-[#0F1B14]" />
          <nav className="flex flex-wrap items-center gap-1">
            {nav.map((item) => {
              const active =
                (current === "overview" && item.href === "/cms") ||
                (current === "events" && item.href === "/cms/events") ||
                (current === "news" && item.href === "/cms/news");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#006B3F] text-white"
                      : "text-[#0F1B14]/70 hover:bg-[#006B3F]/10 hover:text-[#006B3F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/preview/sankofa/events"
              className="ml-2 rounded-full border border-[#006B3F] px-4 py-2 text-sm font-semibold text-[#006B3F] hover:bg-[#006B3F] hover:text-white"
            >
              View site
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
              GCAO CMS
            </p>
            <h1
              className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl"
              style={display}
            >
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#0F1B14]/60">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-xs text-[#0F1B14]/45 md:px-10">
        Images save to this server’s disk. Uploads will not persist on Vercel serverless — MySQL
        rows still will.
      </footer>
    </div>
  );
}

export function CmsNotice({
  saved,
  deleted,
  noun,
}: {
  saved?: boolean;
  deleted?: boolean;
  noun: string;
}) {
  if (!saved && !deleted) return null;
  return (
    <p
      className="mb-8 rounded-2xl border border-[#006B3F]/20 bg-[#006B3F]/10 px-5 py-3 text-sm font-medium text-[#006B3F]"
      role="status"
    >
      {deleted ? `${noun} deleted.` : `${noun} saved.`}
    </p>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="btn-premium inline-flex rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D]"
    >
      {children}
    </Link>
  );
}
