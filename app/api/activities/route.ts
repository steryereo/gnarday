const URL = "https://www.strava.com/api/v3/athlete/activities";

import { auth } from "@/auth";

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
  start_date: string;
}
interface FormattedResults {
  activities: Activity[];
  count: number;
  dateRange: string[];
}

function formatResults(results: Activity[]): FormattedResults {
  const filtered = results.filter((result) =>
    DEFAULT_SPORT_TYPES.includes(result.sport_type)
  );

  const activities = filtered.map(({ name, sport_type, start_date }) => ({
    name,
    sport_type,
    start_date,
  }));

  return {
    activities,
    count: activities.length,
    dateRange: [
      activities[0].start_date,
      activities[activities.length - 1].start_date,
    ],
  };
}

const START_DATE = "2023-11-01";

export const GET = auth(async (req): Promise<void | Response> => {
  if (req.auth) {
    try {
      const params = new URLSearchParams({
        after: toEpochSeconds(START_DATE).toString(),
        // per_page: "200",
      });

      const url = `${URL}?${params}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${req.auth.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const activities = await res.json();

      return Response.json(formatResults(activities));
    } catch (err: unknown) {
      return Response.json(err);
    }
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 });
}) as unknown as Promise<void | Response>;
