"use client";

import { useEffect, useState } from "react";
import Count from "./Count";

export default function ApiData() {
  const [data, setData] = useState(null);
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

  if (!data) return <p>Loading...</p>;

  const { dayCount, activityCount } = data;

  return (
    <>
      <p className="text-2xl">You&apos;ve spent</p>
      <Count count={dayCount} />
      <p className="text-2xl">days on the snow this season</p>
      {activityCount > dayCount ? (
        <p className="mt-8">
          And you got {activityCount} activities in there. Hell yeah!
        </p>
      ) : null}
    </>
  );
}
