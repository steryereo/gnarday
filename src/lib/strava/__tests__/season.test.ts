// @vitest-environment node
import { describe, expect, test } from "vitest";

import { getSeasonStart } from "../season";

describe("getSeasonStart", () => {
  test("is this year's Nov 1 from Nov 1 onwards", () => {
    expect(getSeasonStart(new Date("2026-11-01T00:00:00Z"))).toBe(
      "2026-11-01",
    );
    expect(getSeasonStart(new Date("2026-12-31T23:59:59Z"))).toBe(
      "2026-11-01",
    );
  });

  test("is last year's Nov 1 before Nov 1", () => {
    expect(getSeasonStart(new Date("2027-01-01T00:00:00Z"))).toBe(
      "2026-11-01",
    );
    expect(getSeasonStart(new Date("2026-10-31T23:59:59Z"))).toBe(
      "2025-11-01",
    );
  });
});
