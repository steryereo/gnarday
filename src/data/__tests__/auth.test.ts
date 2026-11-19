// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, authMock } from "@/test/mocks/auth";

import { requireUser } from "../auth";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));

beforeEach(() => {
  authMock.api.getSession.mockReset();
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
