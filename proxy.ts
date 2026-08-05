import { NextResponse } from "next/server";

import { auth } from "@/auth";

/**
 * Optimistic gate for /admin: just checks there's a valid NextAuth session
 * (reads the JWT cookie, no DB round-trip). Proxy shouldn't do slow/full
 * auth (see Next.js docs on Proxy) — Server Actions and the (protected)
 * layout still call `requireAdminSession()` for the real check, since Proxy
 * is reachable on every request including prefetches.
 */
export default auth((req) => {
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: "/admin/:path*",
};
