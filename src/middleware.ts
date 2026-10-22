import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/auth.config";

const sessionMiddleware = NextAuth(authConfig).auth as unknown as (
  request: NextRequest,
) => Promise<Response>;

export default function middleware(request: NextRequest) {
  const secretReady = Boolean(process.env.AUTH_SECRET);
  // The edge bundle can be compiled before AUTH_SECRET exists. Redirecting in
  // that state fights the Node login check and loops. Page checks still apply.
  if (!secretReady) return NextResponse.next();
  return sessionMiddleware(request);
}

export const config = {
  matcher: ["/cms", "/cms/:path*"],
};
