/** @type {import("next").NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net", // Strava profile images
      },
    ],
  },
};

module.exports = nextConfig;
