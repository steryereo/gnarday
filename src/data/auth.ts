import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/src/lib/auth/auth";

export type AuthErrorKind = "unauthenticated" | "forbidden";

/**
 * Thrown by the `require*` guards below. Server Actions map this to a
 * client-safe result (see `toActionError`); pages use `adminOnly()`, which
 * turns it into a redirect.
 */
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

export async function requireAdmin() {
  const session = await requireUser();

  const { success } = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        adminSection: ["access"],
      },
    },
  });

  if (!success) {
    throw new AuthError("forbidden");
  }

  return session;
}

/**
 * Page-level guard: redirect non-admins to the home page. Unlike
 * `requireAdmin()`, this swallows `AuthError` into a redirect so pages don't
 * need their own try/catch. Unexpected errors still propagate.
 */
export async function adminOnly() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/");
    }
    throw error;
  }
}
