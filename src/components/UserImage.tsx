"use client";

import Image from "next/image";

import { useSession } from "@/src/lib/auth/auth-client";
import { cn } from "@/src/lib/utils";

export default function UserImage({ className }: { className?: string }) {
  const { data: session } = useSession();

  return (
    <div
      className={cn("relative rounded-full border-onyx border-4", className)}
    >
      <div className="w-[200px] h-[200px] rounded-full p-8 bg-gradient-to-br from-green from-40% to-blue to-60% border-white border-2" />
      <div className="bg-pink absolute-center rounded-full overflow-hidden border-white border-2">
        {session?.user?.image ? (
          <Image
            className="rounded-full mix-blend-color-dodge grayscale contrast-200 max-w-none"
            width={150}
            height={150}
            src={session?.user?.image ?? ""}
            alt={session?.user?.name ?? ""}
            // Avatar URLs are athlete-controlled (any host). Render unoptimized
            // so Next never fetches them server-side, and drop the referrer so
            // we don't leak the viewer to the avatar host.
            unoptimized
            referrerPolicy="no-referrer"
          />
        ) : (
          <div style={{ height: 150, width: 150 }} />
        )}
      </div>
    </div>
  );
}
