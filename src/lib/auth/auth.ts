import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth, admin } from "better-auth/plugins";

import * as schema from "@/src/db/schema";

import { ac, admin as adminRole, user } from "./permissions";
import { db } from "../../db";

export const auth = betterAuth({
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
    admin({
      ac,
      roles: { admin: adminRole, user },
    }),
    genericOAuth({
      config: [
        {
          providerId: "strava",
          authorizationUrl: "https://www.strava.com/oauth/authorize",
          tokenUrl: "https://www.strava.com/oauth/token",
          clientId: process.env.AUTH_STRAVA_ID!,
          clientSecret: process.env.AUTH_STRAVA_SECRET!,
          scopes: ["activity:read_all"],
          getUserInfo: async (tokens) => {
            const response = await fetch(
              "https://www.strava.com/api/v3/athlete",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );

            const profile = await response.json();

            return {
              ...profile,
              // BetterAuth requires an email address for the user
              email: `${profile.id}@stravadummyemail.com`,
            };
          },
          mapProfileToUser: (profile) => {
            console.log("PROFILE", profile);

            return {
              ...profile,
              name: [profile.firstname, profile.lastname].join(" "),
              image: profile.profile,
            };
          },
        },
      ],
    }),
  ],
});
