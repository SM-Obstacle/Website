"use client";

import moment from "moment";

function formatDateImpl(date: string, f: string) {
  return moment.utc(date).local().format(f);
}

export function formatDate(date: string) {
  return formatDateImpl(date, "DD/MM/YYYY");
}

export function formatDateTime(date: string) {
  return formatDateImpl(date, "HH:mm:ss");
}

export const formatFull = (date: string) =>
  `${formatDate(date)} ${formatDateTime(date)}`;

function timeAgo(date: Date): string {
  const now = new Date();
  // difference in milliseconds
  const diffMs = now.valueOf() - date.valueOf();

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

function formatDateWithOptions(
  d: moment.Moment,
  format: "full" | "onlyDate" | "onlyTime" | undefined = "full",
): string {
  return format === "full"
    ? d.format("DD/MM/YYYY HH:mm:ss")
    : d.format(format === "onlyDate" ? "DD/MM/YYYY" : "HH:mm:ss");
}

export function FormattedTimeAgo({ children }: { children: string }) {
  const d = moment.utc(children).local();
  return (
    <span title={formatDateWithOptions(d, "full")}>{timeAgo(d.toDate())}</span>
  );
}

export default function FormattedDate({
  children,
  onlyDate,
}: {
  children: string;
  onlyDate?: boolean;
}) {
  const d = moment.utc(children).local();
  const full = formatDateWithOptions(d, "full");
  const small = formatDateWithOptions(d, onlyDate ? "onlyDate" : "onlyTime");

  return <span title={full}>{small}</span>;
}
