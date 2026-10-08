import { Sora } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from "@/app/cms/auth-actions";
import { Logo } from "@/components/shared/Logo";
import { getCmsUser } from "@/lib/cms";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sankofa",
});

const display = { fontFamily: "var(--font-sankofa), sans-serif" };

const field =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#0F1B14] outline-none ring-[#006B3F]/30 focus:ring-2";

export default async function CmsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const user = await getCmsUser();
  if (user?.name) redirect("/cms");
  if (user) redirect("/cms/name");

  const query = await searchParams;
  const signInHint = (await cookies()).get("gcao-signin-error")?.value;
  // #region agent log
  fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "src/app/cms/login/page.tsx", message: "Login page error", data: { error: query.error ?? null, sent: query.sent ?? null, signInHint: signInHint ?? null, emailReady: Boolean(process.env.AUTH_RESEND_KEY && process.env.AUTH_EMAIL_FROM), secretReady: Boolean(process.env.AUTH_SECRET) }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion
  const googleReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const emailReady = Boolean(process.env.AUTH_RESEND_KEY && process.env.AUTH_EMAIL_FROM);
  const secretReady = Boolean(process.env.AUTH_SECRET);
  const missing = [
    !secretReady ? "AUTH_SECRET" : "",
    !process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET
      ? "AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET"
      : "",
    !process.env.AUTH_RESEND_KEY || !process.env.AUTH_EMAIL_FROM
      ? "AUTH_RESEND_KEY and AUTH_EMAIL_FROM"
      : "",
    !process.env.ADMIN_EMAILS ? "ADMIN_EMAILS" : "",
  ].filter(Boolean);

  return (
    <div className={`${sora.variable} min-h-screen bg-[#FFFBF2] text-[#0F1B14]`}>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <Logo href="/preview/sankofa" size={48} textClassName="text-[#0F1B14]" />
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#006B3F]">
          GCAO CMS
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]" style={display}>
          Member sign-in
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#0F1B14]/60">
          Sign in to draft posts. An admin publishes them before they appear on the site.
        </p>

        {query.sent === "1" && (
          <p className="mt-6 rounded-2xl border border-[#006B3F]/20 bg-[#006B3F]/10 px-5 py-3 text-sm text-[#006B3F]">
            Check your email for a sign-in link.
          </p>
        )}
        {query.error && query.sent !== "1" && (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {loginError(query.error, signInHint)}
          </p>
        )}

        {secretReady && (googleReady || emailReady) ? (
          <div className="mt-8 space-y-4 rounded-[2rem] border border-black/10 bg-white p-6">
            {googleReady && (
              <form action={signInWithGoogle}>
                <button
                  type="submit"
                  className="btn-premium w-full rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#0F1B14] hover:border-[#006B3F]/40"
                >
                  Continue with Google
                </button>
              </form>
            )}
            {googleReady && emailReady && (
              <p className="text-center text-xs uppercase tracking-[0.2em] text-[#0F1B14]/40">or</p>
            )}
            {emailReady && (
              <form action={signInWithEmail} className="space-y-3">
                <label className="block text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={field}
                />
                <button
                  type="submit"
                  className="btn-premium w-full rounded-full bg-[#FCD116] px-6 py-3 text-sm font-semibold text-[#06110D]"
                >
                  Email me a sign-in link
                </button>
              </form>
            )}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm leading-relaxed text-[#0F1B14]/70">
            Sign-in is not configured yet. Add the missing keys to .env.local and restart the site.
          </p>
        )}

        {missing.length > 0 && (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-sm text-[#0F1B14]/70">
            <p className="font-medium text-[#0F1B14]">Still needed in .env.local</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {!process.env.ADMIN_EMAILS && (
              <p className="mt-3">
                Put your email in ADMIN_EMAILS so that account becomes an admin the next time you sign
                in. Until then, nobody can publish.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function loginError(code: string, hint?: string) {
  if (code === "email") return "Enter a valid email address.";
  if (code === "Verification") return "That sign-in link has expired. Request a new one.";
  if (code === "AccessDenied") return "That account cannot sign in.";
  if (code === "Configuration" && hint === "resend-unverified") {
    return "Resend is still in test mode. It will only email the address on your Resend account until you verify gcaocanada.org and set AUTH_EMAIL_FROM to an address on that domain. For a test, set AUTH_EMAIL_FROM to GCAO <onboarding@resend.dev> and request the link with your Resend account email.";
  }
  if (code === "Configuration" && hint === "resend-failed") {
    return "The sign-in email could not be sent. Check the Resend from-address and API key, then try again.";
  }
  if (code === "Configuration") return "Sign-in is not set up yet.";
  if (code === "OAuthAccountNotLinked") {
    return "That email is already used with the other sign-in method.";
  }
  return "Sign-in could not be completed. Try again.";
}
