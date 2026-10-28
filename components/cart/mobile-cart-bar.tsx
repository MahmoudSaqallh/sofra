"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/menu";

// Figma mobile "Sticky bar": forest pill with item count, "عرض السلة" and the running total.
export function MobileCartBar() {
  const { count, subtotal } = useCart();
  if (count === 0) return null;
  return (
    <>
      {/* Spacer so the fixed bar never covers the last content */}
      <div aria-hidden className="h-[100px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-5 pt-4 pb-7 shadow-[0_-8px_24px_0_rgb(61_51_31/0.08)] md:hidden">
        <Link
          href="/cart"
          className="flex h-14 items-center gap-3 rounded-full bg-brand ps-2 pe-5 text-canvas"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-accent text-label-l font-medium text-brand">
            {count}
          </span>
          <span className="flex-1 text-label-l font-medium">عرض السلة</span>
          <span className="text-price font-semibold text-accent-light">{formatPrice(subtotal)}</span>
        </Link>
      </div>
    </>
  );
}
