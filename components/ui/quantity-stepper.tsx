"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "default" | "compact";
  label: string;
};

// Figma "Quantity Stepper": RTL — plus on the right (start), minus on the left.
export function QuantityStepper({ value, onChange, min = 1, max = 20, size = "default", label }: Props) {
  const compact = size === "compact";
  const btn = cn(
    "flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40",
    compact ? "size-[30px]" : "size-10",
  );
  const icon = compact ? 14 : 18;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex w-fit items-center rounded-full bg-subtle p-1", compact ? "gap-2.5" : "gap-4")}
    >
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="زيادة الكمية"
        className={cn(btn, "bg-brand text-canvas hover:bg-inverse")}
      >
        <Plus size={icon} strokeWidth={1.75} aria-hidden />
      </button>
      <span
        aria-live="polite"
        className={cn("min-w-4 text-center font-medium text-ink", compact ? "text-label-m" : "text-label-l")}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="إنقاص الكمية"
        className={cn(btn, "border border-line bg-surface text-ink hover:border-brand")}
      >
        <Minus size={icon} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
