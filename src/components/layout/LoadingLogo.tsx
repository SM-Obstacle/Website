"use client";

import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useNavigationProgress } from "./NavigationProgress";

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The logo, doubling as the site's loading indicator: while a page is on its
 * way it shrinks, spins, and a ring around it fills with the progress.
 *
 * It sits where the eye already goes — the top of the rail on desktop, the
 * title bar on mobile — and is far bigger than a hairline bar along the top.
 */
export default function LoadingLogo({ className }: { className?: string }) {
  const { pending, progress } = useNavigationProgress();

  return (
    <span
      className={cn(
        "relative block size-logo shrink-0",
        className,
      )}
      aria-busy={pending || undefined}
    >
      <span
        className={cn(
          "block size-full transition-transform duration-300 ease-out",
          pending && "scale-[0.62]",
        )}
      >
        <Logo
          className={cn(
            pending && "motion-safe:animate-[spin_1.1s_linear_infinite]",
          )}
        />
      </span>

      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 size-full -rotate-90 transition-opacity duration-300",
          pending ? "opacity-100" : "opacity-0",
        )}
      >
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="7"
          className="stroke-current opacity-15"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className={cn(
            "stroke-primary dark:stroke-[oklch(0.7_0.13_258)]",
            // Animates forward only: the snap back to 0 when the next
            // navigation starts happens while the ring is still faded out.
            progress > 0 && "transition-[stroke-dashoffset] duration-300 ease-out",
          )}
        />
      </svg>

      {pending && <span className="sr-only">Loading…</span>}
    </span>
  );
}
