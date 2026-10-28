import type { ComponentProps, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

// Figma "Checkbox": 22px box (forest when checked), label on the right (RTL start).
export function Checkbox({
  label,
  className,
  ...input
}: { label: ReactNode; className?: string } & Omit<ComponentProps<"input">, "type" | "className">) {
  return (
    <label className={cn("group flex cursor-pointer items-center gap-2.5", className)}>
      <span className="relative flex size-[22px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          className="peer absolute inset-0 cursor-pointer appearance-none rounded-md border-[1.5px] border-line-strong bg-surface transition-colors checked:border-brand checked:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
          {...input}
        />
        <Check
          size={14}
          strokeWidth={2.25}
          aria-hidden
          className="pointer-events-none relative text-canvas opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className="text-body-s text-ink">{label}</span>
    </label>
  );
}
