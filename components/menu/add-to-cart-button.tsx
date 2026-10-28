"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Dish } from "@/lib/menu";
import { addToCart } from "@/lib/notify";
import { cn } from "@/lib/cn";

// Round forest "+" from the Menu Card; adds the default size with no extras and confirms with a toast.
export function AddToCartButton({ dish, size = "md" }: { dish: Dish; size?: "md" | "sm" }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  const Icon = added ? Check : Plus;
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(dish);
        setAdded(true);
      }}
      aria-label={`أضف ${dish.name} إلى السلة`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-brand text-canvas transition-colors duration-200 hover:bg-inverse active:scale-95",
        size === "md" ? "size-10" : "size-8",
      )}
    >
      <Icon size={size === "md" ? 20 : 16} strokeWidth={1.75} aria-hidden />
    </button>
  );
}
