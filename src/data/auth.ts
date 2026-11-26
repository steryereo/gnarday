import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/src/lib/auth/auth";

export type AuthErrorKind = "unauthenticated" | "forbidden";

/** Thrown by the `require*` guards below. */
export class AuthError extends Error {
  readonly kind: AuthErrorKind;

  constructor(kind: AuthErrorKind) {
    super(kind);
    this.name = "AuthError";
    this.kind = kind;
  }
}

/**
 * The current better-auth session, or null. Wrapped in React `cache` so a
 * single render pass that calls it several times only reads the cookie once.
 */
export const getCurrentSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function requireUser() {
  const session = await getCurrentSession();

  if (!session) {
    throw new AuthError("unauthenticated");
  }

  return session;
}
