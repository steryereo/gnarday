import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, adminClient } from "better-auth/client/plugins";

import { ac, admin as adminRole, user } from "./permissions";

export const { signIn, signOut, useSession } = createAuthClient({
  plugins: [
    adminClient({
      ac: ac,
      roles: {
        admin: adminRole,
        user,
      },
    }),
    genericOAuthClient(),
  ],
});
