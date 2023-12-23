import { ACTIVITIES_URL, START_DATE, TOKEN_URL } from "./constants";

// TODO: use date-fns instead?
function toEpochSeconds(dateString: string) {
  const millisecondEpoch = new Date(dateString).valueOf();

  return Math.floor(millisecondEpoch / 1000);
}

export async function refreshAccessToken(refresh_token: string) {
  const body = JSON.stringify({
    client_id: process.env.AUTH_STRAVA_ID,
    client_secret: process.env.AUTH_STRAVA_SECRET,
    refresh_token,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  return response.json();
}

export async function getActivities(
  accessToken: string,
  startDate: string = START_DATE
) {
  const params = new URLSearchParams({
    after: toEpochSeconds(startDate).toString(),
    per_page: "200",
  });

  const response = await fetch(`${ACTIVITIES_URL}?${params}`, {
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
