import { Check } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

const steps = ["السلة", "الدفع والتوصيل", "التأكيد"];

// Figma checkout stepper: numbered circles joined by rules; done steps show a check.
export function CheckoutSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol aria-label="خطوات الطلب" className="flex items-center gap-3">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <Fragment key={label}>
            <li aria-current={active ? "step" : undefined} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-label-m font-medium",
                  done || active ? "bg-brand text-canvas" : "border border-line-strong bg-surface text-faint",
                )}
              >
                {done ? <Check size={16} strokeWidth={2} aria-label="مكتملة" /> : n}
              </span>
              <span className={cn("text-label-m font-medium whitespace-nowrap", done || active ? "text-brand" : "text-faint")}>
                {label}
              </span>
            </li>
            {n < steps.length && (
              <li aria-hidden className={cn("hidden h-0.5 w-16 sm:block", done ? "bg-brand" : "bg-track")} />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
