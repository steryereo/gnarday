import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/src/db";
import { account } from "@/src/db/schema";
import { auth } from "@/src/lib/auth/auth";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getAccountForCurrentUser(provider: string) {
  const session = await getSession();

  const userId = session?.user?.id;

  if (userId === undefined) throw new Error("unauthorized");

  console.log("userId", userId);

  const [userAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, provider)));

  return userAccount;
}

export async function adminOnly() {
  const session = await getSession();

  if (!session) {
    console.log("no session");
    return redirect("/");
  }

  const userHasPermission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        adminSection: ["access"],
      },
    },
  });

  if (!userHasPermission.success) {
    return redirect("/");
  }
}
