import Image from "next/image";

import { auth } from "@/auth";

import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function UserButton() {
  const session = await auth();

  if (!session?.user) return <SignIn />;

  return (
    <div>
      <p>
        {session.user.image ? (
          <Image
            width={100}
            height={100}
            src={session.user.image}
            alt={session.user.name ?? ""}
          />
        ) : null}

        {session.user.name}
      </p>
      <p className="text-xs leading-none text-muted-foreground">
        {session.user.email}
      </p>
      <SignOut />
    </div>
  );
}
