import { vi } from "vitest";

/**
 * Stand-in for `auth` from `@/src/lib/auth/auth`. Wire it up with:
 *
 *   vi.mock("@/src/lib/auth/auth", async () => ({
 *     auth: (await import("@/test/mocks/auth")).authMock,
 *   }));
 *
 * then call `actAs(...)` to choose what better-auth reports for the caller.
 */
export const authMock = {
  api: {
    getSession: vi.fn(),
  },
};

export type Caller = "anonymous" | "user";

export function actAs(caller: Caller) {
  const { getSession } = authMock.api;

  if (caller === "anonymous") {
    getSession.mockResolvedValue(null);
    return;
  }

  getSession.mockResolvedValue({
    user: { id: `${caller}-id` },
    session: { id: `${caller}-session` },
  });
}
