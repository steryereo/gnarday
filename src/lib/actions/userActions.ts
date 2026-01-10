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

type AccountData = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type GetAccountResult =
  | { success: true; data: AccountData }
  | { success: false; error: string };

export async function getAccountForCurrentUser(
  provider: string,
): Promise<GetAccountResult> {
  const session = await getSession();

  const userId = session?.user?.id;

  if (userId === undefined) {
    return { success: false, error: "unauthorized" };
  }

  const [userAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, provider)));

  if (!userAccount) {
    return { success: false, error: "account not found" };
  }

  return { success: true, data: userAccount };
}

export async function adminOnly() {
  const session = await getSession();

  if (!session) {
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
