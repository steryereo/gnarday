"use server";
import { redirect } from "next/navigation";

import {
  formatResults,
  getActivities,
  refreshAccessToken,
} from "@/src/lib/strava";

import { getAccountForCurrentUser } from "./userActions";

type GetTokenResult =
  | { success: true; token: string }
  | { success: false; error: string };

async function getUpToDateAccessToken(account: {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
}): Promise<GetTokenResult> {
  if (
    !account.accessTokenExpiresAt ||
    !account.refreshToken ||
    !account.accessToken
  ) {
    return { success: false, error: "incomplete strava account" };
  }

  if (account.accessTokenExpiresAt < new Date()) {
    try {
      const { access_token: accessToken } = await refreshAccessToken(
        account.refreshToken
      );

      return { success: true, token: accessToken };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "failed to refresh token",
      };
    }
  }

  return { success: true, token: account.accessToken };
}

export async function getData() {
  const accountResult = await getAccountForCurrentUser("strava");

  if (!accountResult.success) {
    if (accountResult.error === "unauthorized") {
      redirect("/login");
    }
    throw new Error(accountResult.error);
  }

  const tokenResult = await getUpToDateAccessToken(accountResult.data);

  if (!tokenResult.success) {
    if (tokenResult.error === "incomplete strava account") {
      redirect("/login");
    }
    throw new Error(tokenResult.error);
  }

  const activities = await getActivities(tokenResult.token);

  return formatResults(activities);
}
