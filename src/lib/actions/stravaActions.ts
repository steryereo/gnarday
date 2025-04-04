"use server";
import { redirect } from "next/navigation";

import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

import { getAccountForCurrentUser } from "./userActions";

async function getUpToDateAccessToken(account: {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
}) {
  if (
    !account.accessTokenExpiresAt ||
    !account.refreshToken ||
    !account.accessToken
  ) {
    throw new Error("incomplete strava account");
  }

  if (account.accessTokenExpiresAt < new Date()) {
    const { access_token: accessToken } = await refreshAccessToken(
      account.refreshToken
    );

    return accessToken;
  }

  return account.accessToken;
}

export async function getData() {
  const account = await getAccountForCurrentUser("strava");

  const token = await getUpToDateAccessToken(account);

  if (!token) {
    return redirect("/login");
  }

  const activities = await getActivities(token);

  return formatResults(activities);
}
