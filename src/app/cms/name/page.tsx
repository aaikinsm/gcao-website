import { Sora } from "next/font/google";
import { redirect } from "next/navigation";
import { saveMemberName } from "@/app/cms/auth-actions";
import { Logo } from "@/components/shared/Logo";
import { getCmsUser } from "@/lib/cms";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";

export default async function MemberNamePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCmsUser();
  if (!user) redirect("/cms/login");
  if (user.name) redirect("/cms");

  const query = await searchParams;

  return (
    <div className={`${sora.variable} min-h-screen bg-[#FFFBF2] text-[#0F1B14]`}>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <Logo href="/preview/sankofa" size={48} textClassName="text-[#0F1B14]" />
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
          GCAO members
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]" style={display}>
          What should we call you?
        </h1>

        {query.error === "name" && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            Enter your name, up to 120 characters.
          </p>
        )}

        <form action={saveMemberName} className="mt-8 space-y-3 rounded-[2rem] border border-black/10 bg-white p-6">
          <label className="block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            autoFocus
            placeholder="Your name"
            className={field}
          />
          <button
            type="submit"
            className="btn-premium w-full rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D]"
          >
            Continue
          </button>
        </form>
      </main>
    </div>
  );
}
