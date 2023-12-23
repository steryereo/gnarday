import Image from "next/image";

import { auth } from "@/src/auth";

export default async function UserImage() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center">
      <Image
        className="rounded-full"
        width={150}
        height={150}
        src={session?.user?.image ?? ""}
        alt={session?.user?.name ?? ""}
      />
    </div>
  );
}
