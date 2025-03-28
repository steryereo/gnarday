"use client";

import { signIn } from "@/src/lib/auth-client";

import { Button } from "./ui/button";

export default function SignIn() {
  function handleClick() {
    signIn.oauth2({
      providerId: "strava",
      callbackURL: "/",
    });
  }

  return (
    <Button type="button" onClick={handleClick}>
      Sign In
    </Button>
  );
}
