import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

import * as schema from "@/src/db/schema";

import { env } from "@/src/lib/env";
import { db } from "../../db";
import { mapStravaProfileToUser } from "./strava";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  account: {
    accountLinking: {
      // Strava does not provide an email address - this option is a workaround https://www.better-auth.com/docs/concepts/users-accounts#manually-linking-accounts
      allowDifferentEmails: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "strava",
          authorizationUrl: "https://www.strava.com/oauth/authorize",
          tokenUrl: "https://www.strava.com/oauth/token",
          clientId: env.AUTH_STRAVA_ID,
          clientSecret: env.AUTH_STRAVA_SECRET,
          scopes: ["activity:read_all"],
          getUserInfo: async (tokens) => {
            const response = await fetch(
              "https://www.strava.com/api/v3/athlete",
              {
                method: "GET",
                cache: "no-store", // User info is dynamic
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              },
            );

            const profile = await response.json().catch(() => null);

            if (!response.ok || typeof profile?.id !== "number") {
              // TODO(#84): replace with Sentry.captureMessage once Sentry is set up.
              // https://github.com/steryereo/gnarday/issues/84
              console.error("[strava] /athlete request failed during sign-in", {
                status: response.status,
                errors: JSON.stringify(profile?.errors ?? profile),
              });
              return null;
            }

            return {
              ...profile,
              // BetterAuth requires an email address for the user
              email: `${profile.id}@stravadummyemail.com`,
            };
          },
          mapProfileToUser: mapStravaProfileToUser,
        },
      ],
    }),
  ],
});
