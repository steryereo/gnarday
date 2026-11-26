// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";

import { proxy } from "../proxy";

const SESSION_COOKIE = "better-auth.session_token=token";

function request(path = "/", cookie?: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy", () => {
  test("redirects to /login when there is no session cookie", async () => {
    const response = await proxy(request());

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  test("lets the request through when a session cookie is present", async () => {
    const response = await proxy(request("/", SESSION_COOKIE));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  test("strips leftover OAuth callback params from the URL", async () => {
    const response = await proxy(
      request("/?state=abc&code=def&scope=read,activity:read_all", SESSION_COOKIE),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  test("keeps other query params when stripping OAuth params", async () => {
    const response = await proxy(
      request("/?state=abc&code=def&scope=read&tab=settings", SESSION_COOKIE),
    );

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/?tab=settings",
    );
  });

  test("leaves a lone code param alone", async () => {
    const response = await proxy(request("/?code=promo", SESSION_COOKIE));

    expect(response.headers.get("location")).toBeNull();
  });
});
