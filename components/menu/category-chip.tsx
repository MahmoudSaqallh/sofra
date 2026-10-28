import Link from "next/link";
import type { Category } from "@/lib/menu";
import { cn } from "@/lib/cn";

// Figma "Category Chip": icon + label pill; the selected state is forest-filled.
// Chips link into the Menu page, where the actual filtering happens.
export function CategoryChip({
  category,
  selected = false,
  className,
}: {
  category: Category;
  selected?: boolean;
  className?: string;
}) {
  const Icon = category.icon;
  const href = category.slug === "all" ? "/menu" : `/menu?category=${category.slug}`;
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium whitespace-nowrap transition-colors duration-200",
        selected
          ? "bg-brand text-canvas"
          : "border border-line bg-surface text-ink hover:border-brand hover:text-brand",
        className,
      )}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
      {category.label}
    </Link>
  );
}
