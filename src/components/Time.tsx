export function formatTime(time: number, withMs = true): string {
  const ms = Math.round(Math.floor(time % 1000) / 10);
  let sec = Math.floor(time / 1000);
  let min = Math.floor(sec / 60);
  const hor = Math.floor(min / 60);
  sec = sec % 60;
  min = min % 60;

  return (
    hor.toString().padStart(2, "0") +
    ":" +
    min.toString().padStart(2, "0") +
    ":" +
    sec.toString().padStart(2, "0") +
    (withMs ? `.${ms.toString().padStart(2, "0")}` : "")
  );
}

export default function Time({ children }: { children: number }) {
  return formatTime(children);
}
