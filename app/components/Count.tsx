"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function Count({ count }: { count: number }) {
  const [displayCount, setDisplayCount] = useState(0);

  const delays = useMemo(() => {
    return computeDelays(count);
  }, [count]);

  useEffect(() => {
    if (displayCount === count) return;

    const delay = delays[displayCount];

    setTimeout(() => {
      setDisplayCount(displayCount + 1);
    }, delay);
  }, [count, delays, displayCount]);

  return <p className="text-8xl m-4">{displayCount}</p>;
}
