"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn("rdp-root calendar-pretty", className)}
      classNames={{
        month_caption: "calendar-pretty__caption",
        caption_label: "calendar-pretty__caption-label",
        nav: "calendar-pretty__nav",
        button_previous: "calendar-pretty__nav-btn",
        button_next: "calendar-pretty__nav-btn",
        weekdays: "calendar-pretty__weekdays",
        weekday: "calendar-pretty__weekday",
        month_grid: "calendar-pretty__grid",
        week: "calendar-pretty__week",
        day: "calendar-pretty__day",
        day_button: "calendar-pretty__day-btn",
        months: "calendar-pretty__months",
        month: "calendar-pretty__month",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
