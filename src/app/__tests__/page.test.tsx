// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, authMock } from "@/test/mocks/auth";

import Home from "../page";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("@/src/components/Count", () => ({ default: () => null }));
vi.mock("@/src/components/CounterText", () => ({ default: () => null }));
vi.mock("@/src/components/AvatarSection", () => ({ default: () => null }));
vi.mock("@/src/components/Preferences", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

beforeEach(() => {
  authMock.api.getSession.mockReset();
});

describe("Home", () => {
  test("redirects to /login before rendering when the session is invalid", async () => {
    actAs("anonymous");

    await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
  });

  test("renders when the session is valid", async () => {
    actAs("user");

    await expect(Home()).resolves.toBeTruthy();
  });
});
