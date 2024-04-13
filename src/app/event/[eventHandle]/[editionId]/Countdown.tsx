"use client";

import { formatTime } from "@/components/Time";
import { useEffect, useState } from "react";

export default function Countdown({ start }: { start: number }) {
  const [time, setTime] = useState(start);

  useEffect(() => {
    time > 0 && setTimeout(() => setTime(time - 1), 1000);
  }, [time]);

  return (
    <code>{formatTime(time * 1000, false)}</code>
  )
}