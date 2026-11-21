"use client";

import { useEffect, useState } from "react";

import { formatTime } from "@/components/Time";

/**
 * Counts `start` seconds down to zero.
 *
 * The remaining time is derived from the wall clock rather than a decrementing
 * counter, so it stays accurate when the tab is throttled in the background.
 */
export default function Countdown({ start }: { start: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const timer = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [start]);

  const remaining = Math.max(0, start - elapsed);

  return (
    <code suppressHydrationWarning>{formatTime(remaining * 1000, false)}</code>
  );
}
