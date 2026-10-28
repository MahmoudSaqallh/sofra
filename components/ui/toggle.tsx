"use client";

import { cn } from "@/lib/cn";

// Figma "Toggle": 48×28 switch. RTL — the knob sits on the left when ON.
export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-brand" : "bg-line-strong",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 size-5 rounded-full bg-surface shadow-sm transition-[inset-inline-start] duration-200",
          checked ? "start-[calc(100%-1.5rem)]" : "start-1",
        )}
      />
    </button>
  );
}
