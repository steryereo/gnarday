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

  test("rejects a BETTER_AUTH_URL that is not a URL", () => {
    expect(
      envSchema.safeParse({ ...valid, BETTER_AUTH_URL: "example.com" }).success,
    ).toBe(false);
  });
});
