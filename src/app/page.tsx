import ApiData from "../components/ApiData";
import UserButton from "../components/UserButton";
import UserImage from "../components/UserImage";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div>
        <UserImage />
        <div
          style={{ textWrap: "pretty" }} // TODO: no style attribute
          className="flex flex-col items-center font-mono text-center my-16"
        >
          <ApiData />
        </div>
      </div>

      <UserButton />
    </main>
  );
}
