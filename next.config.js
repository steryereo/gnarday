/** @type {import("next").NextConfig} */

const nextConfig = {
  // No remote-image allowlist: the only remote image is the user avatar,
  // which renders with `unoptimized` so Next never fetches it server-side.
};

module.exports = nextConfig;
