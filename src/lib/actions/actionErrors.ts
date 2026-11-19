import "server-only";

import { z } from "zod";

import { AuthError } from "@/src/data/auth";

/** Coerces and validates a positive integer id coming from the client. */
export const idSchema = z.coerce.number().int().positive();

export type ActionError = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Maps a thrown error to a client-safe action result:
 * - auth failures become a generic "Unauthorized" (no detail)
 * - zod failures surface per-field messages for the form
 * - anything else is logged server-side and returned as `fallback`, so raw
 *   database/driver text never reaches the client.
 */
export function toActionError(error: unknown, fallback: string): ActionError {
  if (error instanceof AuthError) {
    return { success: false, error: "Unauthorized" };
  }

  if (error instanceof z.ZodError) {
    const fieldErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      if (err.path[0]) {
        fieldErrors[err.path[0].toString()] = err.message;
      }
    });

    return {
      success: false,
      error: error.errors.map((e) => e.message).join(", "),
      fieldErrors:
        Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  console.error(fallback, error);
  return { success: false, error: fallback };
}
