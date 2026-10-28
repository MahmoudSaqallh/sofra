import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  size?: "sm" | "md" | "lg";
  /** Above-the-fold placements (site header) load the logo eagerly. */
  eager?: boolean;
  className?: string;
};

// Gold brand logo (public/logo.png, transparent, 1775×886). Heights: mobile bars 44px, desktop nav 60px, footer / sign-in 72px.
const heights = { sm: 44, md: 60, lg: 72 };
const RATIO = 1775 / 886;

export function Logo({ size = "md", eager, className }: Props) {
  const height = heights[size];
  return (
    <Link href="/" aria-label="سُفرة — الصفحة الرئيسية" className={cn("flex shrink-0 items-center", className)}>
      <Image
        src="/logo.png"
        alt="سُفرة"
        width={Math.round(height * RATIO)}
        height={height}
        loading={eager ? "eager" : "lazy"}
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
