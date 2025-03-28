import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/src/db";
import { account } from "@/src/db/schema";

import { auth } from "../auth";

export async function getAccountForCurrentUser(provider: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (userId === undefined) throw new Error("unauthorized");

  console.log("userId", userId);

  const [userAccount] = await db
    .select()
    .from(account)
    // @ts-expect-error TODO: fix this?
    .where(and(eq(account.userId, userId), eq(account.providerId, provider)));

  return userAccount;
}
