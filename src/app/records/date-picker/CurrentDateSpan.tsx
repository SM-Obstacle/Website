"use client";

import moment from "moment";
import { useDateFilter } from "./DateFilterWrapper";

export default function CurrentDateSpan() {
  const { currentDate } = useDateFilter();

  return (
    <span>
      {currentDate ? moment(currentDate).format("DD/MM/YYYY") : "Pick a date"}
    </span>
  );
}
