"use server";

import { auth } from "@/src/auth";
import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

export async function getData() {
  const user = await auth();

  if (!user) throw new Error("unauthorized");

  // TODO: don't do this refresh every time. store user data including refresh_token in a DB instead?
  // @ts-expect-error refresh_token was added manually in auth.ts
  const { access_token } = await refreshAccessToken(user.refresh_token);

  const activities = await getActivities(access_token);

  console.log(JSON.stringify(activities, null, 2));

  return formatResults(activities);
}
