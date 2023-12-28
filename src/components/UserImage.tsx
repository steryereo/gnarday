import Image from "next/image";
import { useSession } from "next-auth/react";

export default function UserImage() {
  const { data: session } = useSession();

  return (
    <div className="relative rounded-full border-onyx border-4">
      <div className="w-[200px] h-[200px] rounded-full p-8 bg-gradient-to-br from-green from-40% to-blue to-60% border-white border-2" />
      <div className="bg-pink absolute top-[25px] left-[25px] rounded-full overflow-hidden border-white border-2">
        {session?.user?.image ? (
          <Image
            className="rounded-full mix-blend-color-dodge grayscale contrast-200 animate-fade"
            width={150}
            height={150}
            src={session?.user?.image ?? ""}
            alt={session?.user?.name ?? ""}
          />
        ) : (
          <div style={{ height: 150, width: 150 }} />
        )}
      </div>
    </div>
  );
}
