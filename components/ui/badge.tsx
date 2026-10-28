import type { BadgeTone } from "@/lib/menu";
import { cn } from "@/lib/cn";

// Figma "Badge" tones: Brand, Gold, Success, Info, Error, plus the menu's spicy (warning) and dark pills.
const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-subtle text-brand",
  gold: "bg-accent-subtle text-accent-ink",
  success: "bg-success-subtle text-success",
  info: "bg-info-subtle text-info",
  warning: "bg-warning-subtle text-warning",
  error: "bg-error-subtle text-error",
  dark: "bg-inverse text-accent-light",
};

export function Badge({ label, tone = "gold", className }: { label: string; tone?: BadgeTone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-label-s font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
