"use server";

import { auth } from "@/src/auth";
import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

async function getUpToDateAccessToken(user: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}) {
  if (user.expires_at < Date.now()) {
    const { access_token } = await refreshAccessToken(user.refresh_token);

    return access_token;
  }

  return user.access_token;
}

export async function getData() {
  const user = await auth();

  if (!user) throw new Error("unauthorized");

  // @ts-expect-error refresh_token was added manually in auth.ts
  const access_token = await getUpToDateAccessToken(user);

  const activities = await getActivities(access_token);

  return formatResults(activities);
}
