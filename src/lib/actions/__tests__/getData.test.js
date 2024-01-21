import { describe, expect, test, vi } from "vitest";
import { auth } from "@/src/auth";

import { getData } from "../getData";

vi.mock("@/src/auth");

describe("getData", () => {
  test("throws if not logged in", () => {
    vi.mocked(auth).mockReturnValue(null);

    expect(() => getData()).rejects.toThrowError("unauthorized");
  });
});
