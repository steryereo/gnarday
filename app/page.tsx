import UserButton from "./components/UserButton";
import ApiData from "./components/ApiData";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton />
      <ApiData />
    </main>
  );
}
