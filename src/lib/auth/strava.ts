/**
 * The Strava athlete fields we use for the local user. Strava returns many
 * more (city, weight, ...); they are deliberately not copied to the user.
 */
type StravaAthleteProfile = {
  firstname?: unknown;
  lastname?: unknown;
  profile?: unknown;
  [key: string]: unknown;
};

/**
 * Maps a Strava athlete profile to the local user fields better-auth stores.
 * It must not return `id`: better-auth takes the account ID from the
 * profile's `id` itself.
 */
export function mapStravaProfileToUser(profile: StravaAthleteProfile) {
  const name = [profile.firstname, profile.lastname]
    .filter((part): part is string => typeof part === "string" && part !== "")
    .join(" ");

  return {
    name,
    image: typeof profile.profile === "string" ? profile.profile : undefined,
  };
}
