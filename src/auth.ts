import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";
import { authConfig } from "@/auth.config";
import { createAuthAdapter } from "@/lib/auth-adapter";
import { ensureAuthTables, isAdminEmail, setUserRole } from "@/lib/members";

function providers(): NextAuthConfig["providers"] {
  const list: NextAuthConfig["providers"] = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    list.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }
  if (process.env.AUTH_RESEND_KEY && process.env.AUTH_EMAIL_FROM) {
    const resend = Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM,
    });
    const send = resend.sendVerificationRequest.bind(resend);
    resend.sendVerificationRequest = async (params) => {
      try {
        await send(params);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const unverified =
          message.includes("testing emails") || message.includes("verify a domain");
        // #region agent log
        fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "A", location: "src/auth.ts:sendVerificationRequest", message: "Resend send failed", data: { unverified, mentionsTesting: message.includes("testing emails"), mentionsDomain: message.includes("verify a domain") }, timestamp: Date.now() }) }).catch(() => {});
        // #endregion
        const jar = await cookies();
        jar.set("gcao-signin-error", unverified ? "resend-unverified" : "resend-failed", {
          path: "/",
          maxAge: 120,
          httpOnly: true,
          sameSite: "lax",
        });
        throw error;
      }
    };
    list.push(resend);
  }
  return list;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: createAuthAdapter(),
  providers: providers(),
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user.id && user.email && isAdminEmail(user.email)) {
        await ensureAuthTables();
        await setUserRole(user.id, "admin");
      }
      return true;
    },
  },
});
