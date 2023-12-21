import Image from "next/image";

import { auth } from "@/auth";

import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function UserButton() {
  const session = await auth();

  if (!session?.user) return <SignIn />;

  return (
    <div className="flex flex-col items-center">
      <Image
        className="rounded-full"
        width={150}
        height={150}
        src={session.user.image ?? ""}
        alt={session.user.name ?? ""}
      />
      <SignOut />
    </div>
  );
}
