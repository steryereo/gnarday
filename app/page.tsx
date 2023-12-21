import ApiData from "./components/ApiData";
import UserButton from "./components/UserButton";
import UserImage from "./components/UserImage";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <UserImage />
      <ApiData />
      <UserButton />
    </main>
  );
}
