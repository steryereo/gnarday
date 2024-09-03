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
};

module.exports = nextConfig;
