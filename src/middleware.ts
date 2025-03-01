import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "./auth.config";

// https://authjs.dev/guides/edge-compatibility
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  if (!request.auth) {
    return NextResponse.redirect(new URL("api/auth/signin", request.url));
  }
});

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes, also includes auth routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
