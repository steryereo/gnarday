import UserButton from "./components/UserButton";
import ApiData from "./components/ApiData";
import PingData from "./components/PingData";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <UserButton />
      </div>
      <PingData />
      <ApiData />
    </main>
  );
}
