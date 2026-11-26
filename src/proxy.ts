import { NextRequest, NextResponse } from "next/server";

const OAUTH_CALLBACK_PARAMS = [
  "state",
  "code",
  "scope",
  "error",
  "error_description",
];

function hasOAuthCallbackParams(searchParams: URLSearchParams) {
  return (
    searchParams.has("state") &&
    (searchParams.has("code") || searchParams.has("error"))
  );
}

export async function proxy(request: NextRequest) {
  // Netlify copies the OAuth callback's query onto better-auth's redirect,
  // so strip those params to leave the user on a clean URL.
  if (hasOAuthCallbackParams(request.nextUrl.searchParams)) {
    const cleanUrl = request.nextUrl.clone();
    OAUTH_CALLBACK_PARAMS.forEach((param) =>
      cleanUrl.searchParams.delete(param),
    );

    return NextResponse.redirect(cleanUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
