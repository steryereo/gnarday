import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_STRAVA_ID: z.string().min(1, "AUTH_STRAVA_ID is required"),
  AUTH_STRAVA_SECRET: z.string().min(1, "AUTH_STRAVA_SECRET is required"),
});

export const env = envSchema.parse(process.env);
