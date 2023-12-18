"use client"

import { useEffect, useState } from "react"

export default function ApiData() {
  const [data, setData] = useState()

  useEffect(() => {
      fetch("/api/activities")
        .then(res => res.json())
        .then(json => {
          setData(json)        
        })
        .catch(err => console.error(err))
    }, [])

  
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}
