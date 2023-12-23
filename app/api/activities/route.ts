import { auth } from "@/auth";

const URL_BASE = "https://www.strava.com/api/v3";

const ACTIVITIES_URL = `${URL_BASE}/athlete/activities`;
const TOKEN_URL = `${URL_BASE}/oauth/token`;

// const SPORT_TYPES = ["AlpineSki", "BackcountrySki", "Badminton", "Canoeing", "Crossfit", "EBikeRide", "Elliptical", "EMountainBikeRide", "Golf", "GravelRide", "Handcycle", "HighIntensityIntervalTraining", "Hike", "IceSkate", "InlineSkate", "Kayaking", "Kitesurf", "MountainBikeRide", "NordicSki", "Pickleball", "Pilates", "Racquetball", "Ride", "RockClimbing", "RollerSki", "Rowing", "Run", "Sail", "Skateboard", "Snowboard", "Snowshoe", "Soccer", "Squash", "StairStepper", "StandUpPaddling", "Surfing", "Swim", "TableTennis", "Tennis", "TrailRun", "Velomobile", "VirtualRide", "VirtualRow", "VirtualRun", "Walk", "WeightTraining", "Wheelchair", "Windsurf", "Workout", "Yoga"]
const DEFAULT_SPORT_TYPES = [
  "AlpineSki",
  "BackcountrySki",
  "NordicSki",
  "Snowboard",
];

function toEpochSeconds(dateString: string) {
  const millisecondEpoch = new Date(dateString).valueOf();

  return Math.floor(millisecondEpoch / 1000);
}

interface Activity {
  name: string;
  sport_type: string;
  start_date_local: string;
}

interface FormattedResults {
  activityCount: number;
  dayCount: number;
  dateRange: string[];
}

function formatResults(results: Activity[]): FormattedResults {
  const filtered = results.filter((result) =>
    DEFAULT_SPORT_TYPES.includes(result.sport_type)
  );

  const activities = filtered.map(({ name, sport_type, start_date_local }) => ({
    name,
    sport_type,
    start_date_local,
  }));

  return {
    activityCount: activities.length,
    dayCount: getUniqueDayCount(activities),
    dateRange: [
      activities[0]?.start_date_local,
      activities[activities.length - 1]?.start_date_local,
    ],
  };
}

function getUniqueDayCount(activities: Activity[]) {
  const datesWithoutTime = activities.map(
    ({ start_date_local }) => start_date_local.split("T")[0]
  );

  return new Set(datesWithoutTime).size;
}

const START_DATE = "2023-11-01";

async function refreshAccessToken(refresh_token: string) {
  const body = JSON.stringify({
    client_id: process.env.AUTH_STRAVA_ID,
    client_secret: process.env.AUTH_STRAVA_SECRET,
    refresh_token,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body,
  });

  return res.json();
}

export const GET = auth(async (req): Promise<void | Response> => {
  if (req.auth) {
    try {
      // TODO: don't do this refresh every time. store stuff in a DB instead?
      // @ts-expect-error refresh_token was added manually in auth.ts
      const { access_token } = await refreshAccessToken(req.auth.refresh_token);

      const params = new URLSearchParams({
        after: toEpochSeconds(START_DATE).toString(),
        per_page: "200",
      });

      const url = `${ACTIVITIES_URL}?${params}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch activities: ${response.status} ${response.statusText}`
        );
      }

      const activities = await response.json();

      return Response.json({ ...formatResults(activities), ...req.auth });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      return new Response(message, { status: 500 });
    }
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
});
