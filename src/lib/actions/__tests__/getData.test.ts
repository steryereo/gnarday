import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

import { SUMMARY_ACTIVITY } from "../../strava/__fixtures__";
import { getData } from "../stravaActions";
import { getAccountForCurrentUser } from "../userActions";

vi.mock("@/src/lib/strava");
vi.mock("../userActions");
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    const error = new Error("NEXT_REDIRECT");
    // @ts-expect-error - Next.js internal property
    error.digest = "NEXT_REDIRECT;redirect=/login";
    throw error;
  }),
}));

const REFRESH_TOKEN = "abc";
const ACCESS_TOKEN = "123";
const FORMATTED_RESULTS = {
  activityCount: 1,
  dayCount: 1,
  dateRange: ["2023-12-25T13:54:48Z", "2023-12-25T13:54:48Z"],
};

describe("getData", () => {
  describe("when not logged in", () => {
    test("redirects to login", async () => {
      vi.mocked(getAccountForCurrentUser).mockResolvedValue({
        success: false,
        error: "unauthorized",
      });

      await expect(getData()).rejects.toThrow("NEXT_REDIRECT");
    });
  });

  describe("when account not found", () => {
    test("redirects to login", async () => {
      vi.mocked(getAccountForCurrentUser).mockResolvedValue({
        success: false,
        error: "account not found",
      });

      await expect(getData()).rejects.toThrow();
    });
  });

  describe("when logged in", () => {
    const mockAccount = {
      id: "account-id",
      accountId: "strava-123",
      providerId: "strava",
      userId: "user-id",
      accessToken: "old-token",
      refreshToken: REFRESH_TOKEN,
      idToken: null,
      accessTokenExpiresAt: new Date(Date.now() - 1000), // Expired
      refreshTokenExpiresAt: null,
      scope: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      vi.mocked(getAccountForCurrentUser).mockResolvedValue({
        success: true,
        data: mockAccount,
      });
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
