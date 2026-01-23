"use client";

import { createContext, useContext, useRef, useState } from "react";

export type DateFilterHandler = {
  onSelect: (date: Date | undefined) => void;
  currentDate: Date | undefined;
};

const DateFilterContext = createContext<DateFilterHandler | null>(null);

function DateFilterProvider({
  children,
  ...rest
}: React.PropsWithChildren<DateFilterHandler>) {
  return <DateFilterContext value={rest}>{children}</DateFilterContext>;
}

export function DateFilterWrapper({
  name,
  children,
}: React.PropsWithChildren<{ name: string }>) {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const ref = useRef<HTMLInputElement>(null);

  const onDateSelect = (selected: Date | undefined) => {
    if (selected && ref.current) {
      const utcDate = selected.toISOString();
      // Remove the "Z" at the end
      ref.current.value = utcDate.substring(0, utcDate.length - 1);
    }
    setCurrentDate(selected);
  };

  return (
    <DateFilterProvider onSelect={onDateSelect} currentDate={currentDate}>
      <input type="hidden" name={name} id={name} ref={ref} />
      {children}
    </DateFilterProvider>
  );
}

export function useDateFilter(): DateFilterHandler {
  const ctx = useContext(DateFilterContext);

  if (ctx === null) {
    throw new Error(
      "useDateFilter must be called inside a <DateFilterProvider>",
    );
  }

  return ctx;
}
