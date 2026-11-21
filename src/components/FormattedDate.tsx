"use client";

import {
  formatDate,
  formatFull,
  formatTimeOfDay,
  parseApiDate,
} from "@/lib/date";

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.valueOf();

  if (diffMs < 0) return "in the future";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}mn ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export function FormattedTimeAgo({ children }: { children: string }) {
  return (
    <span suppressHydrationWarning title={formatFull(children)}>
      {timeAgo(parseApiDate(children))}
    </span>
  );
}

export default function FormattedDate({
  children,
  onlyDate,
}: {
  children: string;
  onlyDate?: boolean;
}) {
  return (
    <span suppressHydrationWarning title={formatFull(children)}>
      {onlyDate ? formatDate(children) : formatTimeOfDay(children)}
    </span>
  );
}
