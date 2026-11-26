import { redirect } from "next/navigation";
import { Suspense } from "react";

import Count from "@/src/components/Count";
import CounterText from "@/src/components/CounterText";
import AvatarSection from "@/src/components/AvatarSection";
import Preferences from "@/src/components/Preferences";
import { getCurrentSession } from "@/src/data/auth";

export default async function Home() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col flex-1 items-center text-center">
      <p className="text-6xl font-bold uppercase leading-snug">You have</p>
      <div className="mt-2 mb-6">
        <Suspense
          fallback={
            <AvatarSection isLoading>
              <CounterText className="text-[2.5rem]">Loading...</CounterText>
            </AvatarSection>
          }
        >
          <AvatarSection>
            <Count />
          </AvatarSection>
        </Suspense>
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
