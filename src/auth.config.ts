import Strava from "next-auth/providers/strava";
import type { NextAuthConfig } from "next-auth";

// https://authjs.dev/guides/edge-compatibility
export default {
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
} satisfies NextAuthConfig;
