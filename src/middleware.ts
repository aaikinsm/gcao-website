import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { INVITE_COOKIE, INVITE_MAX_AGE } from "@/lib/invite-cookie";

const sessionMiddleware = NextAuth(authConfig).auth as unknown as (
  request: NextRequest,
) => Promise<Response>;

export default async function middleware(request: NextRequest) {
  const secretReady = Boolean(process.env.AUTH_SECRET);
  // The edge bundle can be compiled before AUTH_SECRET exists. Redirecting in
  // that state fights the Node login check and loops. Page checks still apply.
  const response = !secretReady ? NextResponse.next() : await sessionMiddleware(request);
  const invite = request.nextUrl.searchParams.get("invite") ?? "";
  if (request.nextUrl.pathname === "/cms/login" && /^[A-Za-z0-9_-]{20,200}$/.test(invite)) {
    const secure = request.nextUrl.protocol === "https:" ? "; Secure" : "";
    response.headers.append(
      "set-cookie",
      `${INVITE_COOKIE}=${invite}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${INVITE_MAX_AGE}${secure}`,
    );
  }
  return response;
}

export const config = {
  matcher: ["/cms", "/cms/:path*"],
};
