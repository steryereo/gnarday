/** @type {import("next").NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*", // TODO: make this less permissive
      },
    ],
  },
  typescript: {
    // NOTE: currently next-auth's "auth" function does not pass build typechecking in route handlers
    // see https://github.com/nextauthjs/next-auth-example/blob/main/app/api/protected/route.ts#L9
    // TODO: remove this once next-auth gets its shit together, or maybe change to a different auth solution
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
