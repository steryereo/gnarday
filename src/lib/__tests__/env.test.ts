// @vitest-environment node
import { describe, expect, test } from "vitest";

import { envSchema } from "../env";

const valid = {
  AUTH_STRAVA_ID: "id",
  AUTH_STRAVA_SECRET: "secret",
  DATABASE_URL: "postgres://localhost/db",
  BETTER_AUTH_SECRET: "x".repeat(32),
};

describe("envSchema", () => {
  test("accepts a valid environment without BETTER_AUTH_URL", () => {
    expect(envSchema.safeParse(valid).success).toBe(true);
  });

  test("requires BETTER_AUTH_SECRET", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_SECRET: undefined }).success,
    ).toBe(false);
  });

  test("rejects a BETTER_AUTH_SECRET shorter than 32 characters", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_SECRET: "x".repeat(31) })
        .success,
    ).toBe(false);
  });

  test("accepts a valid BETTER_AUTH_URL", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_URL: "https://example.com" })
        .success,
    ).toBe(true);
  });

  test("treats an empty BETTER_AUTH_URL as unset", () => {
    const result = envSchema.safeParse({ ...valid, BETTER_AUTH_URL: "" });

    expect(result.success).toBe(true);
    expect(result.data?.BETTER_AUTH_URL).toBeUndefined();
  });

  test("rejects a BETTER_AUTH_URL without an http(s) scheme", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_URL: "localhost:3000" })
        .success,
    ).toBe(false);
  });

  test("rejects a BETTER_AUTH_URL that is not a URL", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_URL: "example.com" }).success,
    ).toBe(false);
  });
});
