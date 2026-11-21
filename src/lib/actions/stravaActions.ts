"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/src/data/auth";
import { auth } from "@/src/lib/auth/auth";
import { formatResults, getActivities } from "@/src/lib/strava";

export async function getData() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const requestHeaders = await headers();
  const accounts = await auth.api.listUserAccounts({ headers: requestHeaders });
  const stravaAccount = accounts.find(
    (account) => account.providerId === "strava",
  );

  if (!stravaAccount) {
    redirect("/login");
  }

  let accessToken: string | undefined;

  try {
    ({ accessToken } = await auth.api.getAccessToken({
      body: { accountId: stravaAccount.id },
      headers: requestHeaders,
    }));
  } catch (error) {
    console.error("[strava] could not get an access token", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  if (!accessToken) {
    redirect("/login");
  }

  const activities = await getActivities(accessToken);

  return formatResults(activities);
}
