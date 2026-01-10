"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";

import { signIn } from "@/src/lib/auth/auth-client";
import stravaBtn from "@/public/strava_btn.svg";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = "login-error";
  
  function handleClick() {
    setIsLoading(true);
    setError(null);

    signIn.oauth2({
      providerId: "strava",
      callbackURL: "/",
    }, {
      onError: () => {
        setIsLoading(false);
        
        setError("Failed to login, try again.");
      },
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-describedby={error ? errorId : undefined}
        aria-busy={isLoading}
        className="appearance-none bg-none border-none p-0 m-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image alt="" src={stravaBtn} width={250} height={50} />
        <VisuallyHidden>{isLoading ? "Connecting to Strava..." : "Connect with Strava"}</VisuallyHidden>
      </button>
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="assertive"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm text-red-500 whitespace-nowrap font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
