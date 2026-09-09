import { Logo } from "@/components/shared/Logo";
import {
  droppedPages,
  footerLinks,
  lowValuePages,
  navComparison,
  pageMap,
  proposedNav,
  todayProblems,
  type NavItem,
} from "@/lib/navigation-ia";

function ProposedMenuMockup({ items }: { items: NavItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div className="border-b border-black/5 bg-gray-50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Logo size={36} textClassName="hidden sm:block text-gcao-navy text-xs" />
          <div className="flex flex-1 flex-wrap gap-1">
            {items.map((item) => (
              <span
                key={item.label}
                className="rounded-full bg-gcao-green/10 px-2.5 py-1 text-xs font-medium text-gcao-green"
              >
                {item.label}
              </span>
            ))}
          </div>
          <span className="rounded-full bg-gcao-gold px-3 py-1 text-xs font-bold text-gcao-navy">
            Donate
          </span>
        </div>
      </div>
      <div className="divide-y divide-black/5 p-4">
        {items.map((item) => (
          <div key={item.label} className="py-3 first:pt-0 last:pb-0">
            <p className="font-semibold text-gcao-navy">{item.label}</p>
            {item.children && (
              <ul className="mt-2 space-y-1">
                {item.children.map((child) => (
                  <li key={child.label} className="text-sm text-gray-600">
                    <span className="text-gray-400">↳ </span>
                    {child.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NavigationPreviewPage() {
  return (
    <div className="min-h-screen bg-gcao-cream text-gcao-navy">
      <div className="bg-gcao-navy px-4 py-2.5 text-center text-sm font-semibold text-white">
        GCAO Navigation Proposal
      </div>

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Proposed Site Navigation
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Simplify the menu from{" "}
            <strong>{navComparison.before.totalLinks} links</strong> to{" "}
            <strong>{navComparison.after.topLevelCount} items + Donate</strong>.
            All existing content is preserved — old URLs redirect automatically.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-12 px-6 py-10">
        <section>
          <h2 className="font-display text-xl font-bold">The New Menu</h2>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {todayProblems.map((problem) => (
              <li key={problem}>
                <span className="text-red-600">✕ </span>
                Today: {problem}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <ProposedMenuMockup items={proposedNav} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">Where Pages Go</h2>
          <p className="mt-1 text-sm text-gray-600">
            Every current page maps to a new location. Nothing is deleted.
          </p>
          <div className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-gray-50 text-left">
                  <th className="px-4 py-2.5 font-semibold">Section</th>
                  <th className="px-4 py-2.5 font-semibold">Current page</th>
                  <th className="px-4 py-2.5 font-semibold">New location</th>
                </tr>
              </thead>
              <tbody>
                {pageMap.map((row) => (
                  <tr key={`${row.section}-${row.oldPath}`} className="border-t border-black/5">
                    <td className="px-4 py-2 text-gcao-green">{row.section}</td>
                    <td className="px-4 py-2 text-gray-500">{row.oldPath}</td>
                    <td className="px-4 py-2 font-medium">{row.newLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold">For Review</h2>
          <div className="mt-4 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-800">
                Needs a decision
              </h3>
              <ul className="mt-2 space-y-2">
                {lowValuePages.map((page) => (
                  <li
                    key={page.name}
                    className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-sm"
                  >
                    <span className="font-semibold text-amber-900">{page.name}</span>
                    <span className="text-amber-950/80"> — {page.summary}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Safe to drop
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                WordPress template/plugin pages — not real GCAO content.
              </p>
              <ul className="mt-2 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
                {droppedPages.map((page) => (
                  <li key={page.slug}>
                    <code className="text-xs">{page.slug}</code>
                    <span className="text-gray-400"> — {page.reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Footer links
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Accessible on every page, but not in the main menu.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {footerLinks.map((link) => (
                  <span
                    key={link.label}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm"
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
