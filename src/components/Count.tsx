"use client";

import { useEffect, useMemo, useState } from "react";
import { coptek } from "../lib/fonts";
import UserImage from "./UserImage";

const DELAY_DECAY_FACTOR = 0.85;
const INIT_DELAY = 100;

function computeDelays(count: number) {
  const delays = [];

  let delay = INIT_DELAY;

  for (let i = 0; i < count; i++) {
    delays.push(delay);

    delay = Math.max(delay * DELAY_DECAY_FACTOR, 1);
  }

  return delays;
}

export default function Count({ count }: { count: number | null }) {
  const [displayCount, setDisplayCount] = useState(0);

  const isLoading = count === null;

  const delays = useMemo(() => {
    if (isLoading) return [];

    return computeDelays(count);
  }, [count, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (displayCount === count) return;

    const delay = delays[displayCount];

    setTimeout(() => {
      setDisplayCount(displayCount + 1);
    }, delay);
  }, [count, delays, displayCount, isLoading]);

  return (
    <div className="relative">
      <UserImage />
      <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center">
        <p
          // this font is weird. needs nudging
          className={`${coptek.className} ${
            isLoading ? "text-[2.5rem]" : "text-[11rem]"
          } relative top-[0.12em] right-[0.025em] text-yellow drop-shadow-solid-onyx font-bold`}
        >
          {isLoading ? "Loading..." : displayCount}
        </p>
      </div>
    </div>
  );
}
