// @vitest-environment node
import { beforeEach, describe, expect, test, vi } from "vitest";

import { formatResults, getActivities } from "@/src/lib/strava";
import { actAs, authMock } from "@/test/mocks/auth";

import { SUMMARY_ACTIVITY } from "../../strava/__fixtures__";
import { getData } from "../stravaActions";

vi.mock("@/src/lib/strava");
vi.mock("@/src/lib/auth/auth", async () => ({
  auth: (await import("@/test/mocks/auth")).authMock,
}));
vi.mock("@/src/db", async () => ({
  db: (await import("@/test/mocks/db")).dbMock.db,
}));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    const error = new Error("NEXT_REDIRECT");
    // @ts-expect-error - Next.js internal property
    error.digest = "NEXT_REDIRECT;redirect=/login";
    throw error;
  }),
}));

const ACCESS_TOKEN = "fresh-access-token";
const STRAVA_ACCOUNT = { id: "strava-row-id", providerId: "strava" };
const FORMATTED_RESULTS = {
  activityCount: 1,
  dayCount: 1,
  dateRange: ["2023-12-25T13:54:48Z", "2023-12-25T13:54:48Z"],
};

beforeEach(() => {
  vi.clearAllMocks();
  authMock.api.getSession.mockReset();
  authMock.api.listUserAccounts.mockReset();
  authMock.api.getAccessToken.mockReset();
});

describe("getData", () => {
  test("redirects to login when not logged in", async () => {
    actAs("anonymous");

    await expect(getData()).rejects.toThrow("NEXT_REDIRECT");
    expect(authMock.api.getAccessToken).not.toHaveBeenCalled();
  });

  test("redirects to login when the user has no Strava account", async () => {
    actAs("user");
    authMock.api.listUserAccounts.mockResolvedValue([
      { id: "other-row-id", providerId: "credential" },
    ]);

    await expect(getData()).rejects.toThrow("NEXT_REDIRECT");
    expect(authMock.api.getAccessToken).not.toHaveBeenCalled();
  });

  describe("when logged in with a Strava account", () => {
    beforeEach(() => {
      actAs("user");
      authMock.api.listUserAccounts.mockResolvedValue([STRAVA_ACCOUNT]);
      authMock.api.getAccessToken.mockResolvedValue({
        accessToken: ACCESS_TOKEN,
      });
      vi.mocked(getActivities).mockResolvedValue([SUMMARY_ACTIVITY]);
      vi.mocked(formatResults).mockReturnValue(FORMATTED_RESULTS);
    });

    test("gets the access token for the Strava account with the request headers", async () => {
      await getData();

      expect(authMock.api.listUserAccounts).toHaveBeenCalledWith({
        headers: expect.any(Headers),
      });
      expect(authMock.api.getAccessToken).toHaveBeenCalledWith({
        body: { accountId: STRAVA_ACCOUNT.id },
        headers: expect.any(Headers),
      });
    });

    test("redirects to login when getting the access token fails", async () => {
      authMock.api.getAccessToken.mockRejectedValue(
        new Error("FAILED_TO_GET_ACCESS_TOKEN"),
      );

      await expect(getData()).rejects.toThrow("NEXT_REDIRECT");
      expect(getActivities).not.toHaveBeenCalled();
    });

    test("redirects to login when the access token is empty", async () => {
      authMock.api.getAccessToken.mockResolvedValue({ accessToken: "" });

      await expect(getData()).rejects.toThrow("NEXT_REDIRECT");
      expect(getActivities).not.toHaveBeenCalled();
    });

    test("fetches activities with the returned access token", async () => {
      await getData();

      expect(getActivities).toHaveBeenCalledWith(ACCESS_TOKEN);
    });

    test("returns the formatted activities", async () => {
      expect(await getData()).toEqual(FORMATTED_RESULTS);
      expect(formatResults).toHaveBeenCalledWith([SUMMARY_ACTIVITY]);
    });
  });
});
