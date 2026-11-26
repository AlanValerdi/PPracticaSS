import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, getLoginPagePath, isProtectedPath } from "@/lib/auth-routes";

// Optimistic check only: skips rendering protected pages when there is no session cookie.
// The session itself is still validated by requireSession() and the backend.
export function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname) || request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(new URL(getLoginPagePath(`${pathname}${search}`), request.url));
}

export const config = {
  matcher: ["/guardados/:path*", "/analisis-cv/:path*", "/admin/:path*"],
};
