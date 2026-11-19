// @vitest-environment node
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, authMock } from "@/test/mocks/auth";

import { AuthError, adminOnly, requireAdmin, requireUser } from "../auth";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

beforeEach(() => {
  vi.mocked(redirect).mockClear();
  authMock.api.getSession.mockReset();
  authMock.api.userHasPermission.mockReset();
});

describe("requireUser", () => {
  test("throws an unauthenticated AuthError when there is no session", async () => {
    actAs("anonymous");

    await expect(requireUser()).rejects.toMatchObject({
      name: "AuthError",
      kind: "unauthenticated",
    });
  });

  test("returns the session when logged in", async () => {
    actAs("user");

    await expect(requireUser()).resolves.toMatchObject({
      user: { id: "user-id" },
    });
  });
});

describe("requireAdmin", () => {
  test("throws an unauthenticated AuthError when there is no session", async () => {
    actAs("anonymous");

    const error = await requireAdmin().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AuthError);
    expect(error).toMatchObject({ kind: "unauthenticated" });
    expect(authMock.api.userHasPermission).not.toHaveBeenCalled();
  });

  test("throws a forbidden AuthError for a non-admin user", async () => {
    actAs("user");

    const error = await requireAdmin().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(AuthError);
    expect(error).toMatchObject({ kind: "forbidden" });
  });

  test("checks the adminSection permission for the session's user", async () => {
    actAs("admin");

    await requireAdmin();

    expect(authMock.api.userHasPermission).toHaveBeenCalledWith({
      body: {
        userId: "admin-id",
        permission: { adminSection: ["access"] },
      },
    });
  });

  test("returns the session for an admin", async () => {
    actAs("admin");

    await expect(requireAdmin()).resolves.toMatchObject({
      user: { id: "admin-id" },
    });
  });

  test("propagates unexpected errors from better-auth", async () => {
    actAs("admin");
    const failure = new Error("db down");
    authMock.api.userHasPermission.mockRejectedValue(failure);

    await expect(requireAdmin()).rejects.toBe(failure);
  });
});

describe("adminOnly", () => {
  test.each(["anonymous", "user"] as const)(
    "redirects a %s caller to /",
    async (caller) => {
      actAs(caller);

      await expect(adminOnly()).rejects.toThrow("NEXT_REDIRECT");
      expect(redirect).toHaveBeenCalledWith("/");
    },
  );

  test("does not redirect an admin", async () => {
    actAs("admin");

    await adminOnly();

    expect(redirect).not.toHaveBeenCalled();
  });

  test("rethrows unexpected errors instead of redirecting", async () => {
    actAs("admin");
    const failure = new Error("db down");
    authMock.api.userHasPermission.mockRejectedValue(failure);

    await expect(adminOnly()).rejects.toBe(failure);
    expect(redirect).not.toHaveBeenCalled();
  });
});
