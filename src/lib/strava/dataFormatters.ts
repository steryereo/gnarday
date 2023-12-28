import { DEFAULT_SPORT_TYPES } from "./constants";

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

function getUniqueDayCount(activities: Activity[]) {
  const datesWithoutTime = activities.map(
    ({ start_date_local }) => start_date_local.split("T")[0]
  );

  return new Set(datesWithoutTime).size;
}

export function formatResults(results: Activity[]): FormattedResults {
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
