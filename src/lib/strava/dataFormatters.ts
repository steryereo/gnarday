import { DEFAULT_SPORT_TYPES } from "./constants";
import { SummaryActivity } from "./types";

export interface FormattedResults {
  activityCount: number;
  dayCount: number;
  dateRange: string[];
}

function getUniqueDayCount(
  activities: {
    name: string;
    sport_type: string;
    start_date_local: string;
  }[]
) {
  const datesWithoutTime = activities.map(
    ({ start_date_local }) => start_date_local.split("T")[0]
  );

  return new Set(datesWithoutTime).size;
}

export function formatResults(results: SummaryActivity[]): FormattedResults {
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
