type StravaAthleteProfile = {
  firstname?: unknown;
  lastname?: unknown;
  profile?: unknown;
  [key: string]: unknown;
};

export function mapStravaProfileToUser(profile: StravaAthleteProfile) {
  const name = [profile.firstname, profile.lastname]
    .filter((part): part is string => typeof part === "string" && part !== "")
    .join(" ");

  return {
    name,
    image: typeof profile.profile === "string" ? profile.profile : undefined,
  };
}
