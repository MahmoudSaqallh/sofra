"use client";

import Link from "next/link";
import { MapPin, ShoppingBag, Truck } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useCart } from "@/components/cart/cart-provider";
import type { OrderMode } from "@/lib/cart";

const modes: { value: OrderMode; label: string }[] = [
  { value: "delivery", label: "توصيل" },
  { value: "pickup", label: "استلام" },
  { value: "dine-in", label: "في المطعم" },
];

// Only the delivery state is drawn in Figma; pickup/dine-in reuse copy from the
// Order Online and Reservations frames ("استلام من الفرع", branch name).
const details: Record<OrderMode, { icon: typeof Truck; caption: string; title: string; meta: string }> = {
  delivery: { icon: Truck, caption: "التوصيل إلى", title: "حي الملقا، الرياض", meta: "35 د" },
  pickup: { icon: ShoppingBag, caption: "استلام من الفرع", title: "فرع العليا — الرياض", meta: "" },
  "dine-in": { icon: MapPin, caption: "أقرب فرع", title: "فرع العليا — الرياض", meta: "18 طاولة" },
};

/** Mobile-only order switcher shown under the hero (Figma 390 frame). Shares the cart's order mode. */
export function OrderModeBar() {
  const { mode, setMode } = useCart();
  const d = details[mode];
  const Icon = d.icon;

  return (
    <section aria-label="طريقة الطلب" className="shell flex flex-col gap-3 pt-6 pb-2 md:hidden">
      <SegmentedControl label="طريقة الطلب" options={modes} value={mode} onChange={setMode} fullWidth />
      <Link
        href={mode === "dine-in" ? "/reservations" : "/order"}
        className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3"
      >
        <Icon size={22} strokeWidth={1.75} className="shrink-0 text-brand" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <span className="text-caption text-muted">{d.caption}</span>
          <span className="truncate text-label-m font-medium text-ink">{d.title}</span>
        </span>
        {d.meta && <span className="text-label-s font-medium text-accent-ink">{d.meta}</span>}
      </Link>
    </section>
  );
}
