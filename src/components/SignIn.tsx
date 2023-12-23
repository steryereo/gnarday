import { signIn } from "@/src/auth";

export default async function SignIn({ provider }: { provider?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button type="submit">Sign In</button>
    </form>
  );
}
