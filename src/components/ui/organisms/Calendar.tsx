"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { styled } from "../../../../@shadow-panda/styled-system/jsx";
import { cx } from "../../../../@shadow-panda/styled-system/css";
import {
  button,
  icon,
  calendar,
} from "../../../../@shadow-panda/styled-system/recipes";

function BaseCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const { root, nav_button: navButton, day, ...rest } = calendar();

  return (
    <DayPicker
      className={cx(root, className)}
      classNames={{
        ...rest,
        nav_button: cx(button({ variant: "outline" }), navButton),
        day: cx(button({ variant: "ghost" }), day),
        ...classNames,
      }}
      components={{
        PreviousMonthButton: () => <ChevronLeft className={icon()} />,
        NextMonthButton: () => <ChevronRight className={icon()} />,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}
BaseCalendar.displayName = "Calendar";

export const Calendar = styled(BaseCalendar);
export type CalendarProps = React.ComponentProps<typeof Calendar>;
