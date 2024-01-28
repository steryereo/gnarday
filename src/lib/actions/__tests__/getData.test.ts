import { beforeEach, describe, expect, test, vi } from "vitest";
import { auth } from "@/src/auth";
import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

import { SUMMARY_ACTIVITY } from "../../strava/__fixtures__";
import { getData } from "../getData";

vi.mock("@/src/auth");
vi.mock("@/src/lib/strava");

const REFRESH_TOKEN = "abc";
const ACCESS_TOKEN = "123";
const FORMATTED_RESULTS = {
  activityCount: 1,
  dayCount: 1,
  dateRange: ["2023-12-25T13:54:48Z", "2023-12-25T13:54:48Z"],
};

describe("getData", () => {
  describe("when not logged in", () => {
    test("throws an error", () => {
      // @ts-expect-error https://github.com/nextauthjs/next-auth-example/blob/main/app/api/protected/route.ts#L9C11-L9C44
      vi.mocked(auth).mockResolvedValue(null);

      expect(() => getData()).rejects.toThrowError("unauthorized");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      // @ts-expect-error https://github.com/nextauthjs/next-auth-example/blob/main/app/api/protected/route.ts#L9C11-L9C44
      vi.mocked(auth).mockResolvedValue({ refresh_token: REFRESH_TOKEN });
      vi.mocked(refreshAccessToken).mockResolvedValue({
        access_token: ACCESS_TOKEN,
      });
      vi.mocked(getActivities).mockResolvedValue([SUMMARY_ACTIVITY]);
      vi.mocked(formatResults).mockResolvedValue(FORMATTED_RESULTS);
    });

    test("calls refreshAccessToken", async () => {
      await getData();

      expect(refreshAccessToken).toHaveBeenCalledWith(REFRESH_TOKEN);
    });

    test("calls getActivities with the refreshed access_token", async () => {
      await getData();

      expect(getActivities).toHaveBeenCalledWith(ACCESS_TOKEN);
    });

    test("calls formatResults on the fetched activities", async () => {
      await getData();

      expect(formatResults).toHaveBeenCalledWith([SUMMARY_ACTIVITY]);
    });

    test("returns the result of formatResults", async () => {
      const results = await getData();

      expect(results).toEqual(FORMATTED_RESULTS);
    });
  });
});
