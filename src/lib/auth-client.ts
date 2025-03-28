import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const { signIn, signOut, useSession } = createAuthClient({
  plugins: [genericOAuthClient()],
});
