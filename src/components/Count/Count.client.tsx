"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CounterText from "../CounterText";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

export default function ClientCount({ count }: { count: number }) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let displayCount = 0;
    let delays = computeDelays(count);

    function tick() {
      if (displayCount === count) return;

      const delay = delays[displayCount];

      displayCount++;

      // Directly set the text content because state was glitching out
      if (countRef.current) {
        countRef.current.textContent = displayCount.toString();
      }

      setTimeout(() => {
        requestAnimationFrame(tick);
      }, delay);
    }

    tick();
  }, []);

  return (
    <CounterText className="text-[11rem]">
      <VisuallyHidden>{count}</VisuallyHidden>
      <span aria-hidden ref={countRef} />
    </CounterText>
  );
}
