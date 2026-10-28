"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const weekdays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const monthFmt = new Intl.DateTimeFormat("ar-u-nu-latn-ca-gregory", { month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("ar-u-nu-latn-ca-gregory", { weekday: "long", day: "numeric", month: "long" });

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Props = {
  value: string;
  onChange: (key: string) => void;
  today: Date;
  /** How many days ahead can be booked. */
  maxDays?: number;
};

// Figma calendar: Sunday-first week (RTL: Sunday on the right), today ringed in gold, selection forest.
export function Calendar({ value, onChange, today, maxDays = 60 }: Props) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const last = new Date(start.getFullYear(), start.getMonth(), start.getDate() + maxDays);
  const [view, setView] = useState(() => new Date(start.getFullYear(), start.getMonth(), 1));

  const firstDow = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];
  const canPrev = view > new Date(start.getFullYear(), start.getMonth(), 1);
  const canNext = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= last;

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-line p-4 md:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          aria-label="الشهر السابق"
          className="flex size-8 items-center justify-center rounded-full border border-line disabled:opacity-40"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
        <p aria-live="polite" className="text-label-l font-medium text-brand">
          {monthFmt.format(view)}
        </p>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          aria-label="الشهر التالي"
          className="flex size-8 items-center justify-center rounded-full border border-line disabled:opacity-40"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
      </div>
      <div role="grid" aria-label={monthFmt.format(view)} className="grid grid-cols-7 gap-1 md:gap-2">
        {weekdays.map((w) => (
          <span key={w} role="columnheader" className="flex h-7 items-center justify-center text-caption text-faint">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} aria-hidden />;
          const key = dateKey(d);
          const disabled = d < start || d > last;
          const selected = key === value;
          const isToday = key === dateKey(start);
          return (
            <button
              key={key}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={selected}
              aria-label={dayFmt.format(d)}
              onClick={() => onChange(key)}
              className={cn(
                "mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-label-m font-medium transition-colors",
                disabled && "text-faint opacity-45",
                !disabled && !selected && "text-ink hover:bg-subtle",
                selected && "bg-brand text-canvas",
                isToday && !selected && "border-[1.5px] border-accent-line",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function formatDayLabel(key: string, withYear = false) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return withYear
    ? new Intl.DateTimeFormat("ar-u-nu-latn-ca-gregory", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date)
    : dayFmt.format(date);
}
