import { Suspense } from "react";

import Count from "@/src/components/Count";
import CounterText from "@/src/components/CounterText";
import Preferences from "@/src/components/Preferences";
import UserImage from "@/src/components/UserImage";

export const metadata = {
  title: "GnarDay",
  description: "How many days?",
};

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center text-center">
      <p className="text-6xl font-bold uppercase leading-snug">You have</p>
      <div className="mt-2 mb-6">
        <div className="relative">
          <UserImage />
          <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center">
            <Suspense
              fallback={
                <CounterText className="text-[2.5rem]">Loading...</CounterText>
              }
            >
              <Count />
            </Suspense>
          </div>
        </div>
      </div>
      <p className="text-2xl font-semibold uppercase leading-normal">
        days on the snow
      </p>
      <p className="text-2xl font-semibold uppercase leading-normal">
        this season
      </p>
      <Preferences className="mt-auto" />
    </main>
  );
}
