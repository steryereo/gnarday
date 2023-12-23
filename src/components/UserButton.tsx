import { auth } from "@/src/auth";

import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function UserButton() {
  const session = await auth();

  return (
    <div className="text-sm font-mono">
      {session?.user ? <SignOut /> : <SignIn />}
    </div>
  );
}
