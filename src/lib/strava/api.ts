import { ACTIVITIES_URL } from "./constants";
import { getSeasonStart } from "./season";
import { SummaryActivity } from "./types";

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
    after: toEpochSeconds(startDate).toString(),
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

  return response.json();
}
