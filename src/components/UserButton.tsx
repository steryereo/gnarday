import { auth } from "@/src/auth";

import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default async function UserButton() {
  const session = await auth();

  return (
    <div className="text-sm mt-8">
      {session?.user ? <SignOut /> : <SignIn />}
    </div>
  );
}
