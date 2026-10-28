"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
};

// Figma "Segment Tab" group inside a bg-subtle pill. Arrow keys follow RTL visual order.
export function SegmentedControl<T extends string>({ label, options, value, onChange, fullWidth }: Props<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex gap-1 rounded-full bg-subtle p-1", fullWidth ? "w-full" : "w-fit")}
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "rounded-full px-5 py-2 text-label-m font-medium whitespace-nowrap transition-colors duration-200",
              fullWidth && "flex-1",
              selected ? "bg-surface text-brand shadow-sm" : "text-muted hover:text-brand",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
