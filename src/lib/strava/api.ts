import { ACTIVITIES_URL } from "./constants";
import { getSeasonStart } from "./season";
import { SummaryActivity } from "./types";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;
const PAGE_SIZE = 200;
const MAX_PAGES = 10;

// TODO: use date-fns instead?
function toEpochSeconds(dateString: string) {
  const millisecondEpoch = new Date(dateString).valueOf();

  return Math.floor(millisecondEpoch / 1000);
}

async function getActivitiesPage(
  accessToken: string,
  after: number,
  page: number,
): Promise<SummaryActivity[]> {
  const params = new URLSearchParams({
    after: after.toString(),
    per_page: PAGE_SIZE.toString(),
    page: page.toString(),
  });

  const response = await fetch(`${ACTIVITIES_URL}?${params}`, {
    cache: "no-store", // User activities are dynamic
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch activities: ${response.status} ${response.statusText}`
    );
  }

  const body: unknown = await response.json();

  if (!Array.isArray(body)) {
    throw new Error("Unexpected Strava activities response: not a list");
  }

  return body;
}

export async function getActivities(
  accessToken: string,
  startDate: string = getSeasonStart()
): Promise<SummaryActivity[]> {
  const after = toEpochSeconds(startDate) - ONE_DAY_IN_SECONDS;
  const activities: SummaryActivity[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageActivities = await getActivitiesPage(accessToken, after, page);
    activities.push(...pageActivities);

    if (pageActivities.length < PAGE_SIZE) {
      break;
    }

    if (page === MAX_PAGES) {
      console.warn(
        `[strava] stopped after ${MAX_PAGES} pages; newer activities were not fetched`,
      );
    }
  }

  return activities.filter(
    ({ start_date_local }) => start_date_local.slice(0, 10) >= startDate,
  );
}
