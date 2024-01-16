import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";

import type { NextAuthConfig } from "next-auth";

export const config = {
  providers: [
    Strava({
      authorization: {
        params: {
          scope: "activity:read_all",
        },
      },
      style: {
        bg: "#FC4C02",
        logo: "",
        text: "#FFF",
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth refresh_token to the token right after signin
      if (account) {
        const { refresh_token } = account;

        return { ...token, refresh_token };
      }

      return token;
    },
    async session({ session, token }) {
      // TODO: this is a hack. find a better way https://github.com/nextauthjs/next-auth/issues/9122
      const { refresh_token } = token;

      return { ...session, refresh_token };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
