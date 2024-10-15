import moment from "moment/moment.js";

export function formatTime(time: number, withMs = true): string {
  const ms = Math.round(Math.floor(time % 1000) / 10);
  let sec = Math.floor(time / 1000);
  let min = Math.floor(sec / 60);
  let hor = Math.floor(min / 60);
  sec = sec % 60;
  min = min % 60;

  return (
    hor.toString().padStart(2, "0") +
    ":" +
    min.toString().padStart(2, "0") +
    ":" +
    sec.toString().padStart(2, "0") +
    (withMs ? "." +
      ms.toString().padStart(2, "0") : "")
  );
}

function formatDateImpl(date: string, f: string) {
  return moment.utc(date).local().format(f)
}

export function formatDate(date: string) {
  return formatDateImpl(date, "DD/MM/YYYY");
}

export function formatDateTime(date: string) {
  return formatDateImpl(date, "HH:mm:ss")
}

export const formatFull = (date: string) => formatDate(date) + " " + formatDateTime(date);

export function Date({ children, onlyDate }: { children: string; onlyDate?: boolean }) {
  return onlyDate ? formatDate(children) : formatDateTime(children);
}

export default function Time({ children }: { children: number }) {
  return formatTime(children);
}
