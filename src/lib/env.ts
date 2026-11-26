import { z } from "zod";

export const envSchema = z.object({
  AUTH_STRAVA_ID: z.string().min(1, "AUTH_STRAVA_ID is required"),
  AUTH_STRAVA_SECRET: z.string().min(1, "AUTH_STRAVA_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "BETTER_AUTH_SECRET is required"
          : undefined,
    })
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .url("BETTER_AUTH_URL must be a full URL, e.g. https://example.com")
      .refine((value) => /^https?:\/\//.test(value), {
        message: "BETTER_AUTH_URL must start with http:// or https://",
      })
      .optional(),
  ),
});

export const env = envSchema.parse(process.env);
