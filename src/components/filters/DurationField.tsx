"use client";

import { Input } from "@/components/ui/input";

const UNITS = [
  { key: "hours", label: "h", ms: 3_600_000, max: undefined },
  { key: "minutes", label: "m", ms: 60_000, max: 59 },
  { key: "seconds", label: "s", ms: 1_000, max: 59 },
] as const;

function split(totalMs: number) {
  return {
    hours: Math.floor(totalMs / 3_600_000),
    minutes: Math.floor(totalMs / 60_000) % 60,
    seconds: Math.floor(totalMs / 1_000) % 60,
  };
}

/** Enters a race time as h/m/s and reports it in milliseconds. */
export default function DurationField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const totalMs = Number.parseInt(value, 10);
  const parts = split(Number.isNaN(totalMs) ? 0 : totalMs);
  const isEmpty = value === "";

  const update = (key: keyof typeof parts, raw: string) => {
    const next = { ...parts, [key]: Math.max(0, Number.parseInt(raw, 10) || 0) };
    const ms =
      next.hours * 3_600_000 + next.minutes * 60_000 + next.seconds * 1_000;
    onChange(ms > 0 ? String(ms) : "");
  };

  return (
    <div className="flex items-center gap-1">
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex flex-1 items-center gap-1">
          <Input
            id={i === 0 ? id : undefined}
            type="number"
            min={0}
            max={unit.max}
            placeholder="00"
            aria-label={unit.key}
            value={isEmpty ? "" : String(parts[unit.key])}
            onChange={(e) => update(unit.key, e.target.value)}
            className="w-full min-w-0 rounded-md px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-sm text-muted-foreground">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
