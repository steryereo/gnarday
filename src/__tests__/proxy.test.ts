// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, test } from "vitest";

import { proxy } from "../proxy";

function request(cookie?: string) {
  return new NextRequest("http://localhost:3000/", {
    headers: cookie ? { cookie } : {},
  });
}

describe("proxy", () => {
  test("redirects to /login when there is no session cookie", async () => {
    const response = await proxy(request());

    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  test("lets the request through when a session cookie is present", async () => {
    const response = await proxy(request("better-auth.session_token=token"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
