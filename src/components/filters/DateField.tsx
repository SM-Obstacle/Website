"use client";

import { endOfYear, format, isValid, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DISPLAY_FORMAT = "dd/MM/yyyy";

/** ShootMania came out in 2013, so no record is older than that. */
const START_MONTH = new Date(2013, 0);

/** The API takes naive (UTC, no offset) timestamps. */
function toApiValue(date: Date) {
  return date.toISOString().replace(/Z$/, "");
}

function fromApiValue(value: string) {
  return value ? new Date(`${value}Z`) : undefined;
}

function display(value: string) {
  const date = fromApiValue(value);
  return date ? format(date, DISPLAY_FORMAT) : "";
}

/**
 * Reads a typed day/month/year date. A leading zero is optional on the day and
 * month, but the year must be written in full, so "1/2/24" is not taken to
 * mean the year 24.
 */
function parseTyped(text: string): Date | undefined {
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) return undefined;
  const date = parse(text, "d/M/yyyy", new Date());
  return isValid(date) ? date : undefined;
}

/**
 * Keeps typed text to digits and slashes, and adds the slash after the day and
 * the month as soon as they are complete, so "26112026" (typed or pasted)
 * reads as 26/11/2026. Deleting is left alone, so a slash can be backspaced
 * over.
 */
function mask(next: string, previous: string) {
  let text = next.replace(/[^\d/]/g, "");
  if (text.length <= previous.length) return text.slice(0, 10);

  if (!text.includes("/")) {
    const digits = text.slice(0, 8);
    text = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
      .filter(Boolean)
      .join("/");
  }
  if (/^\d{2}$|^\d{1,2}\/\d{2}$/.test(text)) text += "/";
  return text.slice(0, 10);
}

export default function DateField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = fromApiValue(value);
  const [text, setText] = useState(() => display(value));
  const [open, setOpen] = useState(false);

  // When the value moves from outside the input (picked in the calendar,
  // cleared, or reset with the other filters), show it.
  const [shownValue, setShownValue] = useState(value);
  if (value !== shownValue) {
    setShownValue(value);
    if (parseTyped(text)?.getTime() !== selected?.getTime()) {
      setText(display(value));
    }
  }

  const typed = parseTyped(text);
  const invalid = text !== "" && !typed;

  const handleType = (raw: string) => {
    const next = mask(raw, text);
    setText(next);
    if (next === "") {
      onChange("");
      return;
    }
    const date = parseTyped(next);
    if (date) {
      const apiValue = toApiValue(date);
      setShownValue(apiValue);
      onChange(apiValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative w-full">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder="dd/mm/yyyy"
          aria-invalid={invalid || undefined}
          value={text}
          onChange={(e) => handleType(e.target.value)}
          // Leaving a half-typed date puts back the last one that was applied.
          onBlur={() => invalid && setText(display(value))}
          className="rounded-full pr-9 tabular-nums"
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-0.5 -translate-y-1/2 rounded-full text-muted-foreground"
              aria-label="Pick a date"
            >
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={START_MONTH}
              endMonth={endOfYear(new Date())}
              selected={selected}
              defaultMonth={typed ?? selected}
              onSelect={(date) => {
                onChange(date ? toApiValue(date) : "");
                setOpen(false);
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {(selected || text) && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full"
          aria-label="Clear date"
          onClick={() => {
            setText("");
            onChange("");
          }}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
