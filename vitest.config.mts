import path from "path";

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // src/lib/env.ts validates these at import time. Dummy values let modules
    // that (transitively) import it load under test. No real connections are made.
    env: {
      AUTH_STRAVA_ID: "test-strava-id",
      AUTH_STRAVA_SECRET: "test-strava-secret",
      DATABASE_URL: "postgres://test:test@127.0.0.1:1/test",
      BETTER_AUTH_SECRET: "test-better-auth-secret-at-least-32-chars",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      // Next.js resolves `server-only` internally; the npm package throws
      // outside the react-server condition, so stub it for tests.
      "server-only": path.resolve(import.meta.dirname, "test/stubs/empty.ts"),
    },
  },
});
