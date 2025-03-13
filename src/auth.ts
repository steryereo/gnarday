import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";

import authConfig from "./auth.config";
import { db } from "./db";
import { users, accounts, sessions, verificationTokens } from "./db/schema";
export const config = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth refresh_token and expires_at to the token right after signin
      if (account) {
        const { access_token, refresh_token, expires_at } = account;

        return { ...token, access_token, refresh_token, expires_at };
      }

      return token;
    },
    async session({ session, token }) {
      // TODO: this is a hack. find a better way https://github.com/nextauthjs/next-auth/issues/9122
      const { access_token, refresh_token, expires_at } = token;

      return { ...session, access_token, refresh_token, expires_at };
    },
  },
  ...authConfig,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
