// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { SUMMARY_ACTIVITY } from "../__fixtures__";
import { getActivities } from "../api";

function activity(startDateLocal: string) {
  return { ...SUMMARY_ACTIVITY, start_date_local: startDateLocal };
}

function mockStravaResponse(activities: unknown[]) {
  const fetchMock = vi.fn<[string], Promise<Response>>(async () =>
    Response.json(activities),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getActivities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-20T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test("fetches from a day before the current season's Nov 1", async () => {
    const fetchMock = mockStravaResponse([]);

    await getActivities("token");

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("after")).toBe(
      String(Date.parse("2026-10-31T00:00:00Z") / 1000),
    );
  });

  test("fetches pages until Strava returns a short page", async () => {
    const pages: Record<string, unknown[]> = {
      "1": Array.from({ length: 200 }, () => activity("2026-11-02T09:00:00Z")),
      "2": Array.from({ length: 50 }, () => activity("2026-11-03T09:00:00Z")),
    };
    const fetchMock = vi.fn<[string], Promise<Response>>(async (url) =>
      Response.json(pages[new URL(url).searchParams.get("page") ?? ""] ?? []),
    );
    vi.stubGlobal("fetch", fetchMock);

    const activities = await getActivities("token");

    expect(activities).toHaveLength(250);
    expect(
      fetchMock.mock.calls.map(([url]) => new URL(url).searchParams.get("page")),
    ).toEqual(["1", "2"]);
  });

  test("stops after an empty page when the total is a multiple of the page size", async () => {
    const fetchMock = vi.fn<[string], Promise<Response>>(async (url) =>
      Response.json(
        new URL(url).searchParams.get("page") === "1"
          ? Array.from({ length: 200 }, () => activity("2026-11-02T09:00:00Z"))
          : [],
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    expect(await getActivities("token")).toHaveLength(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("fetches at most 10 pages", async () => {
    const fetchMock = mockStravaResponse(
      Array.from({ length: 200 }, () => activity("2026-11-02T09:00:00Z")),
    );

    expect(await getActivities("token")).toHaveLength(2000);
    expect(fetchMock).toHaveBeenCalledTimes(10);
  });

  test("warns when the page cap cuts off activities", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockStravaResponse(
      Array.from({ length: 200 }, () => activity("2026-11-02T09:00:00Z")),
    );

    await getActivities("token");

    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  test("does not warn when all activities fit", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockStravaResponse([activity("2026-11-02T09:00:00Z")]);

    await getActivities("token");

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  test("throws a clear error when Strava does not return a list", async () => {
    mockStravaResponse({ message: "unexpected" } as unknown as unknown[]);

    await expect(getActivities("token")).rejects.toThrow(
      "Unexpected Strava activities response",
    );
  });

  test("keeps only activities whose local date is in the season", async () => {
    mockStravaResponse([
      activity("2026-10-31T19:00:00Z"),
      activity("2026-11-01T00:30:00Z"),
      activity("2026-11-15T09:00:00Z"),
    ]);

    const activities = await getActivities("token");

    expect(activities.map((a) => a.start_date_local)).toEqual([
      "2026-11-01T00:30:00Z",
      "2026-11-15T09:00:00Z",
    ]);
  });
});
