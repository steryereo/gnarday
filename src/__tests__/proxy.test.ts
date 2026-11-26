// @vitest-environment node
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, test } from "vitest";

import { config, proxy } from "../proxy";

function request(path = "/") {
  return new NextRequest(`http://localhost:3000${path}`);
}

describe("proxy", () => {
  test("lets requests without OAuth params through, signed in or not", async () => {
    const response = await proxy(request("/"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  test("strips leftover OAuth callback params with a temporary redirect", async () => {
    const response = await proxy(
      request("/?state=abc&code=def&scope=read,activity:read_all"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  test("keeps other query params when stripping OAuth params", async () => {
    const response = await proxy(
      request("/?state=abc&code=def&scope=read&tab=settings"),
    );

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/?tab=settings",
    );
  });

  test("strips leftovers from a denied sign-in", async () => {
    const response = await proxy(
      request("/?state=abc&error=access_denied&error_description=denied"),
    );

    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  test("leaves a lone code param alone", async () => {
    const response = await proxy(request("/?code=promo"));

    expect(response.headers.get("location")).toBeNull();
  });
});

describe("proxy matcher", () => {
  const runsOn = (url: string) =>
    unstable_doesMiddlewareMatch({ config, nextConfig: {}, url });

  test("runs on the home page", () => {
    expect(runsOn("/")).toBe(true);
    expect(runsOn("/?state=abc&code=def")).toBe(true);
  });

  test.each([
    "/login",
    "/api/auth/ok",
    "/icon.svg",
    "/strava_btn.svg",
    "/_next/image?url=%2Fstrava_btn.svg&w=256&q=75",
  ])("skips %s", (url) => {
    expect(runsOn(url)).toBe(false);
  });
});
