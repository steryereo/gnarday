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
