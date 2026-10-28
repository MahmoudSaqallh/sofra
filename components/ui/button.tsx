import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

// Figma "Button" component: Primary (forest), Accent (gold), Outline, Inverse (on dark/photo).
type Variant = "primary" | "accent" | "outline" | "inverse";
type Size = "lg" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-canvas hover:bg-inverse",
  accent: "bg-accent text-brand hover:bg-accent-line",
  outline: "border-[1.5px] border-brand text-brand hover:bg-brand hover:text-canvas",
  inverse: "bg-canvas text-brand hover:bg-surface",
};

const sizes: Record<Size, { base: string; icon: number }> = {
  lg: { base: "h-14 px-8 text-label-l", icon: 20 },
  md: { base: "h-12 px-6 text-label-m", icon: 18 },
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  /** RTL: trailing arrow points left ("forward"). */
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

function classes({ variant = "primary", size = "lg", fullWidth, className }: StyleProps) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size].base,
    fullWidth && "w-full",
    className,
  );
}

function Content({ arrow, size = "lg", children }: StyleProps) {
  return (
    <>
      {children}
      {arrow && <ArrowLeft size={sizes[size].icon} strokeWidth={1.75} aria-hidden />}
    </>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  arrow,
  fullWidth,
  className,
  children,
  ...rest
}: StyleProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={classes({ variant, size, fullWidth, className, children })} {...rest}>
      <Content arrow={arrow} size={size}>
        {children}
      </Content>
    </Link>
  );
}

export function Button({
  variant,
  size,
  arrow,
  fullWidth,
  className,
  children,
  loading,
  loadingLabel,
  type = "button",
  disabled,
  ...rest
}: StyleProps & { loading?: boolean; loadingLabel?: string } & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(classes({ variant, size, fullWidth, className, children }), loading && "disabled:cursor-progress disabled:opacity-90")}
      {...rest}
    >
      {loading ? (
        <>
          <LoaderCircle size={sizes[size ?? "lg"].icon} strokeWidth={2} className="animate-spin" aria-hidden />
          {loadingLabel ?? children}
        </>
      ) : (
        <Content arrow={arrow} size={size}>
          {children}
        </Content>
      )}
    </button>
  );
}
