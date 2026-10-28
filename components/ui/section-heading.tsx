import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  overline: string;
  title: ReactNode;
  description?: string;
  /** "light" renders on dark backgrounds. */
  tone?: "dark" | "light";
  id?: string;
  className?: string;
};

// Figma "Section header": gold rule + overline, Display/M title, Body/L description.
// Mobile uses the smaller Heading/H2 title and drops the description, per the 390 frames.
export function SectionHeading({ overline, title, description, tone = "dark", id, className }: Props) {
  return (
    <div className={cn("flex flex-col items-start gap-1 md:gap-2.5", className)}>
      <div className="flex items-center gap-2.5">
        <p className="text-overline font-medium text-accent-ink">{overline}</p>
        <span aria-hidden className="hidden h-[1.5px] w-8 bg-accent md:block" />
      </div>
      <h2
        id={id}
        className={cn(
          "font-display text-h2 font-semibold md:text-display-m md:font-bold",
          tone === "light" ? "text-canvas" : "text-brand",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="hidden max-w-[620px] text-body-l text-muted md:block">{description}</p>
      )}
    </div>
  );
}
