"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const EVENT_DAY_SELECTED = "dashboard:day-selected";

export default function CalendarBasic() {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  // Mes mostrado: permite navegar a cualquier mes (ej. febrero 2026 → marzo, abril…)
  const [month, setMonth] = useState<Date>(() => new Date());

  function handleSelect(date: Date | undefined) {
    setSelected(date);
    if (date) {
      window.dispatchEvent(
        new CustomEvent(EVENT_DAY_SELECTED, { detail: { date } })
      );
    }
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      month={month}
      onMonthChange={setMonth}
      className="rounded-lg border"
    />
  );
}
