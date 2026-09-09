import Link from "next/link";
import { previewMeta } from "@/lib/content";

const delayClasses = ["delay-100", "delay-200", "delay-300"];
const barClasses = [
  "bg-white ring-1 ring-black/10",
  "bg-gradient-to-r from-[#006B3F] via-[#FCD116] to-[#CE1126]",
  "bg-[#06110D]",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gcao-cream">
      <header className="animate-fade-in border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
              GCAO Website Redesign
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-gcao-navy md:text-4xl">
              Design Preview Options
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="animate-fade-in-up max-w-2xl text-lg text-gray-700">
          Three new homepage directions — modern, professional, and built with real GCAO photography.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {previewMeta.map((preview, index) => (
            <article
              key={preview.id}
              className={`animate-fade-in-up ${delayClasses[index]} flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`h-3 ${barClasses[index]}`} />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl font-bold text-gcao-navy">
                  Option {preview.option}
                </h2>
                <p className="mt-1 text-sm font-medium capitalize text-gcao-green">{preview.id}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {preview.description}
                </p>
                <p className="mt-4 text-xs font-medium text-gcao-green">
                  Best for: {preview.bestFor}
                </p>
                <Link
                  href={preview.href}
                  className="btn-premium mt-6 inline-flex items-center justify-center rounded-full bg-gcao-navy px-5 py-3 text-sm font-semibold text-white hover:bg-gcao-navy/90"
                >
                  View Preview →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="animate-fade-in-up delay-400 mt-16 overflow-hidden rounded-2xl border border-gcao-green/30 bg-gradient-to-br from-gcao-green/5 to-white">
          <div className="p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gcao-green">
                Site Structure
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-gcao-navy">
                Navigation & Page Organization
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                Separate from the homepage designs — review how we simplify the menu from
                ~30 links to 6 (+ Donate), where every current page goes, and which pages
                can be merged or dropped.
              </p>
            </div>
            <Link
              href="/preview/navigation"
              className="btn-premium mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-gcao-green px-6 py-3 text-sm font-semibold text-white hover:bg-gcao-green/90 md:mt-0"
            >
              View Navigation Proposal →
            </Link>
          </div>
        </section>

        <section className="animate-fade-in-up delay-400 mt-10 rounded-2xl border border-black/10 bg-white p-8">
          <h2 className="font-display text-2xl font-bold text-gcao-navy">
            Client Review Checklist
          </h2>
          <ul className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-2">
            <li>✓ Does the homepage feel modern and trustworthy?</li>
            <li>✓ Is it easy to find Programs, Events, and Contact?</li>
            <li>✓ Does the design reflect Ghanaian-Canadian identity?</li>
            <li>✓ Does it work well on mobile? (resize your browser)</li>
            <li>✓ Which direction feels right for donors vs. families?</li>
            <li>✓ Pick A, B, or C</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
