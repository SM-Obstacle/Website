"use client";

import { Button } from "@/components/ui/molecules/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { CalendarIcon } from "lucide-react";
import { useRef } from "react";
import { icon } from "../../../@shadow-panda/styled-system/recipes";
import { Calendar } from "@/components/ui/organisms/Calendar";

export default function RecordDatePicker({ name }: { name: string }) {
  const ref = useRef<HTMLInputElement>(null);

  const onDateSelect = (selected: Date | undefined) => {
    if (selected && ref.current) {
      ref.current.value = selected.toISOString();
    }
  };

  return (
    <>
      <input type="hidden" ref={ref} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            w="280px"
            justifyContent="flex-start"
            textAlign="left"
            fontWeight="normal"
          >
            <CalendarIcon className={icon()} />
            <span>Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent w="auto" p="0">
          <Calendar mode="single" onSelect={onDateSelect} autoFocus />
        </PopoverContent>
      </Popover>
    </>
  );
}
