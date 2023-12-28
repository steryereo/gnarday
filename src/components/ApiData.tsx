"use client";

import { useEffect, useState } from "react";
import Count from "./Count";

export default function ApiData() {
  const [data, setData] = useState({ dayCount: null, activityCount: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (error) return <p>Something went wrong. Please try again</p>;

  const { dayCount } = data;

  return (
    <>
      <p className="text-6xl font-bold uppercase leading-snug">You have</p>
      <div className="mt-2 mb-6">
        <Count count={dayCount} />
      </div>
      <p className="text-2xl font-semibold uppercase leading-normal">
        days on the snow
      </p>
      <p className="text-2xl font-semibold uppercase leading-normal">
        this season
      </p>
    </>
  );
}
