import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  icon: LucideIcon;
};

// Figma checkout option card: radio → icon tile → text. Selected = brand-subtle fill + 2px forest border.
export function RadioCard({ name, value, checked, onChange, title, description, icon: Icon }: Props) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3.5 rounded-2xl p-[18px] transition-colors",
        checked ? "border-2 border-brand bg-brand-subtle" : "m-px border border-line bg-surface hover:border-line-strong",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-[22px] shrink-0 cursor-pointer appearance-none rounded-full border-[1.5px] border-line-strong bg-surface checked:border-[6px] checked:border-brand"
      />
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl text-brand",
          checked ? "bg-surface" : "bg-subtle",
        )}
      >
        <Icon size={20} strokeWidth={1.75} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="text-label-l font-medium text-ink">{title}</span>
        {description && <span className="text-caption text-muted">{description}</span>}
      </span>
    </label>
  );
}
