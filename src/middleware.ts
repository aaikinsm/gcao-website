import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";

const sessionMiddleware = NextAuth(authConfig).auth as unknown as (
  request: NextRequest,
) => Promise<Response>;

export default function middleware(request: NextRequest) {
  const secretReady = Boolean(process.env.AUTH_SECRET);
  // #region agent log
  fetch("http://127.0.0.1:7577/ingest/3cd8e77a-a5fb-4443-b01a-544eaa94c981", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "92ff33" }, body: JSON.stringify({ sessionId: "92ff33", runId: "post-fix", hypothesisId: "B", location: "src/middleware.ts", message: "CMS middleware", data: { path: request.nextUrl.pathname, secretReady }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion
  // The edge bundle can be compiled before AUTH_SECRET exists. Redirecting in
  // that state fights the Node login check and loops. Page checks still apply.
  if (!secretReady) return NextResponse.next();
  return sessionMiddleware(request);
}

export const config = {
  matcher: ["/cms", "/cms/:path*"],
};
