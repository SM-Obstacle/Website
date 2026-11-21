"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** The API takes naive (UTC, no offset) timestamps. */
function toApiValue(date: Date) {
  return date.toISOString().replace(/Z$/, "");
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
  const selected = value ? new Date(`${value}Z`) : undefined;

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-start rounded-full text-left font-normal"
          >
            <CalendarIcon />
            {selected ? format(selected, "dd/MM/yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => onChange(date ? toApiValue(date) : "")}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {selected && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full"
          aria-label="Clear date"
          onClick={() => onChange("")}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
