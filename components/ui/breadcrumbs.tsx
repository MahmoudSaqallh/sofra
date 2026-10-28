import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

// Figma breadcrumb: tertiary links, chevron-left separators, current page in brand.
// "light" is the variant drawn over hero photos: canvas links, champagne current page.
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <nav aria-label="مسار التنقل">
      <ol className="flex flex-wrap items-center gap-2 text-label-s font-medium">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.label}>
              <li>
                {last || !item.href ? (
                  <span aria-current={last ? "page" : undefined} className={light ? "text-accent-light" : "text-brand"}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn("transition-colors", light ? "text-canvas hover:text-accent-light" : "text-faint hover:text-brand")}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {!last && (
                <li aria-hidden className={light ? "text-accent-light" : "text-faint"}>
                  <ChevronLeft size={14} strokeWidth={1.75} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
