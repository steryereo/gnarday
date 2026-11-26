import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const OAUTH_CALLBACK_PARAMS = ["state", "code", "scope"];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Netlify copies the OAuth callback's query onto better-auth's redirect.
  const { searchParams } = request.nextUrl;

  if (searchParams.has("state") && searchParams.has("code")) {
    const cleanUrl = request.nextUrl.clone();
    OAUTH_CALLBACK_PARAMS.forEach((param) => cleanUrl.searchParams.delete(param));

    return NextResponse.redirect(cleanUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes, also includes auth routes)
   * - login (auth routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ["/((?!api|login|_next/static|favicon.ico).*)"],
};
