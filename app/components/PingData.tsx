"use client";

import { useEffect, useState } from "react";

export default function PingData() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch("/api/ping")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      <h1>PING</h1>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
