"use client";

import { Calendar } from "@/components/ui/organisms/Calendar";
import { useDateFilter } from "./DateFilterWrapper";

export default function CalendarContent() {
  const { onSelect } = useDateFilter();

  return <Calendar mode="single" onSelect={onSelect} autoFocus />;
}
