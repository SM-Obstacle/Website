"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/components/Time";

export default function Countdown({ start }: { start: number }) {
  const [time, setTime] = useState(start);

  useEffect(() => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    }
  }, [time]);

  return <code>{formatTime(time * 1000, false)}</code>;
}
