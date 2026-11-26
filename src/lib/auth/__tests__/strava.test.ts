// @vitest-environment node
import { describe, expect, test } from "vitest";

import { mapStravaProfileToUser } from "../strava";

const profile = {
  id: 12345,
  firstname: "Ada",
  lastname: "Lovelace",
  profile: "https://example.com/avatar.jpg",
  email: "12345@stravadummyemail.com",
  city: "London",
  weight: 60,
};

describe("mapStravaProfileToUser", () => {
  test("joins first and last name and uses the profile photo as the image", () => {
    expect(mapStravaProfileToUser(profile)).toEqual({
      name: "Ada Lovelace",
      image: "https://example.com/avatar.jpg",
    });
  });

  test("handles a missing name part", () => {
    expect(mapStravaProfileToUser({ ...profile, lastname: null }).name).toBe(
      "Ada",
    );
  });

  test("leaves image undefined when Strava has no profile photo", () => {
    expect(
      mapStravaProfileToUser({ ...profile, profile: undefined }).image,
    ).toBeUndefined();
  });

  test("does not return the Strava id or other raw profile fields", () => {
    const user = mapStravaProfileToUser(profile);

    expect(user).not.toHaveProperty("id");
    expect(user).not.toHaveProperty("city");
    expect(user).not.toHaveProperty("weight");
  });
});
