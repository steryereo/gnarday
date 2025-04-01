"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

import { signIn } from "@/src/lib/auth/auth-client";
import stravaBtn from "@/public/strava_btn.svg";

export default function LoginButton() {
  function handleClick() {
    signIn.oauth2({
      providerId: "strava",
      callbackURL: "/",
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="appearance-none bg-none border-none p-0 m-0 cursor-pointer"
    >
      <Image alt="" src={stravaBtn} width={250} height={50} />
      <VisuallyHidden>Connect with Strava</VisuallyHidden>
    </button>
  );
}
