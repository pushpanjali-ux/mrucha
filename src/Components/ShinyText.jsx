import { useState, useEffect } from "react"

export default function ShinyText({ messages = [], duration = 4000, className = "" }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, duration)
    return () => clearInterval(interval)
  }, [duration, messages.length])

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <span className="inline-block animate-shine bg-clip-text text-transparent bg-gradient-to-r from-[#FFEDDB] via-white to-[#FFEDDB]">
        {messages[index]}
      </span>
    </div>
  )
}

