"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { signOut } from "@/src/lib/auth-client";

import { Button } from "./ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleClick() {
    setIsLoading(true);

    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <Button
      type="button"
      disabled={isLoading}
      variant="outline"
      onClick={handleClick}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : "Sign Out"}
    </Button>
  );
}
