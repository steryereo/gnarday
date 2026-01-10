import { ACTIVITIES_URL, START_DATE, TOKEN_URL } from "./constants";
import { SummaryActivity } from "./types";

import { env } from "@/src/lib/env";

// TODO: use date-fns instead?
function toEpochSeconds(dateString: string) {
  const millisecondEpoch = new Date(dateString).valueOf();

  return Math.floor(millisecondEpoch / 1000);
}

export async function refreshAccessToken(refresh_token: string) {
  const body = JSON.stringify({
    client_id: env.AUTH_STRAVA_ID,
    client_secret: env.AUTH_STRAVA_SECRET,
    refresh_token,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    cache: "no-store", // Authentication tokens must be fresh
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to refresh access token: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getActivities(
  accessToken: string,
  startDate: string = START_DATE
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
