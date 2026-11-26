// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { actAs, authMock } from "@/test/mocks/auth";

import { proxy } from "../proxy";

vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));

function request(cookie?: string) {
  return new NextRequest("http://localhost:3000/", {
    headers: cookie ? { cookie } : {},
  });
}

beforeEach(() => {
  authMock.api.getSession.mockReset();
});

describe("proxy", () => {
  test("redirects to /login when there is no session cookie", async () => {
    actAs("anonymous");

    const response = await proxy(request());

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  test("redirects to /login when the session cookie is no longer valid", async () => {
    actAs("anonymous");

    const response = await proxy(
      request("better-auth.session_token=stale-token"),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  test("lets the request through with a valid session", async () => {
    actAs("user");

    const response = await proxy(
      request("better-auth.session_token=valid-token"),
    );

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
