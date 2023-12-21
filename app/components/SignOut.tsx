import { signOut } from "@/auth";

export default async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <button className="w-full p-0">Sign Out</button>
    </form>
  );
}
