import { cn } from "@/lib/cn";

// Figma "Avatar": Arabic initials on gold-subtle. Medium 40px, Large 56px.
export function Avatar({ initials, size = "md" }: { initials: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-subtle font-medium text-accent-ink",
        size === "lg" ? "size-14 text-label-l" : "size-10 text-label-m",
      )}
    >
      {initials}
    </span>
  );
}
