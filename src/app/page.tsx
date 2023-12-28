import { SessionProvider } from "next-auth/react";

import ApiData from "../components/ApiData";
import UserButton from "../components/UserButton";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center text-pretty text-center p-12">
        <ApiData />
        <UserButton />
      </main>
    </SessionProvider>
  );
}
