import { ACTIVITIES_URL } from "./constants";
import { getSeasonStart } from "./season";
import { SummaryActivity } from "./types";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

// TODO: use date-fns instead?
function toEpochSeconds(dateString: string) {
  const millisecondEpoch = new Date(dateString).valueOf();

  return Math.floor(millisecondEpoch / 1000);
}

export async function getActivities(
  accessToken: string,
  startDate: string = getSeasonStart()
): Promise<SummaryActivity[]> {
  const params = new URLSearchParams({
    after: (toEpochSeconds(startDate) - ONE_DAY_IN_SECONDS).toString(),
    per_page: "200",
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

  const activities: SummaryActivity[] = await response.json();

  return activities.filter(
    ({ start_date_local }) => start_date_local.slice(0, 10) >= startDate,
  );
}
