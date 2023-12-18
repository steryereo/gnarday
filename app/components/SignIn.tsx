import { signIn } from "@/auth"

export default async function SignIn({ provider }: { provider?: string }) {
    return (
      <form
        action={async () => {
          "use server"
          await signIn(provider)
        }}
      >
        <button>Sign In</button>
      </form>
    )
  }
  