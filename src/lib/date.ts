import { format } from "date-fns";

/**
 * The API returns both RFC3339 timestamps and naive (timezone-less) ones, and
 * the latter are UTC. Pin them to UTC so they aren't read as local time.
 */
export function parseApiDate(date: string): Date {
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(date);
  return new Date(hasTimezone ? date : `${date}Z`);
}

export function formatDate(date: string) {
  return format(parseApiDate(date), "dd/MM/yyyy");
}

export function formatTimeOfDay(date: string) {
  return format(parseApiDate(date), "HH:mm:ss");
}

export function formatFull(date: string) {
  return format(parseApiDate(date), "dd/MM/yyyy HH:mm:ss");
}
