import NextAuth from "next-auth";

import Strava from "next-auth/providers/strava";

import type { NextAuthConfig } from "next-auth";

export const config = {
  // theme: {
  //   logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  // },
  providers: [
    Strava({
      authorization: {
        params: {
          scope: "activity:read_all",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      // TODO: this is a hack. find a better way https://github.com/nextauthjs/next-auth/issues/9122
      return { ...session, ...token };
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
