import { signOut } from "@/src/auth";

import { Button } from "./ui/button";

export default async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit" variant="outline">
        Sign Out
      </Button>
    </form>
  );
}
