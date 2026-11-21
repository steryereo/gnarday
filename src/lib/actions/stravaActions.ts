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

  const { accessToken } = await auth.api.getAccessToken({
    body: { accountId: stravaAccount.id },
    headers: requestHeaders,
  });

  const activities = await getActivities(accessToken);

  return formatResults(activities);
}
