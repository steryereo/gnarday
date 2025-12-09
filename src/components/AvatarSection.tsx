"use client";

import UserImage from "@/src/components/UserImage";
import { cn } from "../lib/utils";

export default function AvatarSection({ children, isLoading = false }: { children: React.ReactNode, isLoading?: boolean }) {
  return (
    <div className="relative">
      <UserImage className={cn(isLoading && "animate-spin")} />
      <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center">
       {children}
      </div>
    </div>
  );
}
