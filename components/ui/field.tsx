import type { ComponentProps, ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Figma "Input" (Text / Select): always-visible label, 52px field, leading icon.
 * States: Default (border-strong), Focus (2px forest + soft ring), Error (message below), Disabled.
 */
type FieldShellProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
  children: ReactNode;
};

function FieldShell({ id, label, icon: Icon, error, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col items-stretch gap-2">
      <label htmlFor={id} className="text-label-m font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          "relative flex h-[52px] items-center rounded-xl border bg-surface transition-shadow",
          "has-disabled:opacity-60",
          error
            ? "border-error"
            : "border-line-strong focus-within:border-brand focus-within:shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]",
        )}
      >
        <Icon
          size={20}
          strokeWidth={1.75}
          aria-hidden
          className="pointer-events-none absolute right-4 text-muted"
        />
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-caption text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

// Physical padding on purpose: the icon always sits on the right (RTL page), even for dir="ltr" inputs
// such as phone and card numbers, whose logical "start" would flip to the left.
const control =
  "h-full w-full min-w-0 rounded-xl bg-transparent pr-[46px] pl-4 text-body-m text-ink outline-none placeholder:text-faint disabled:cursor-not-allowed";

type TextFieldProps = Omit<FieldShellProps, "children"> & Omit<ComponentProps<"input">, "id">;

export function TextField({ id, label, icon, error, hint, className, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} icon={icon} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, className)}
        {...input}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<FieldShellProps, "children"> &
  Omit<ComponentProps<"select">, "id"> & { options: { value: string; label: string }[]; placeholder?: string };

export function SelectField({ id, label, icon, error, hint, options, placeholder, className, ...select }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} icon={icon} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "cursor-pointer appearance-none pl-11", className)}
        {...select}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={20}
        strokeWidth={1.75}
        aria-hidden
        className="pointer-events-none absolute left-4 text-muted"
      />
    </FieldShell>
  );
}
