// @vitest-environment node
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, authMock } from "@/test/mocks/auth";

import Home from "../page";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
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
  vi.clearAllMocks();
  authMock.api.getSession.mockReset();
});

describe("Home", () => {
  test("redirects to /login before rendering when the session is invalid", async () => {
    actAs("anonymous");

    await expect(Home()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  test("checks the session and renders when it is valid", async () => {
    actAs("user");

    await expect(Home()).resolves.toBeTruthy();
    expect(authMock.api.getSession).toHaveBeenCalledOnce();
    expect(redirect).not.toHaveBeenCalled();
  });
});
