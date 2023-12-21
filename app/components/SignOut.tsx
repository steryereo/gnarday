import { signOut } from "@/auth";

export default async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="text-white py-1 px-2 bg-purple-600 m-1 rounded-md"
        type="submit"
      >
        Sign Out
      </button>
    </form>
  );
}
