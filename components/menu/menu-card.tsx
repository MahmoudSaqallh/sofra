"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { formatPrice, type Dish } from "@/lib/menu";
import { useFavorites } from "@/lib/favorites";
import { toggleFavoriteAndNotify } from "@/lib/notify";
import { cn } from "@/lib/cn";

// Figma "Menu Card" (Vertical): 220px photo, badge top-start, favorite top-end.
export function MenuCard({ dish, className, sizes }: { dish: Dish; className?: string; sizes?: string }) {
  const favorite = useFavorites().includes(dish.slug);
  const href = `/menu/${dish.slug}`;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-sm transition-shadow duration-200 hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-[220px] w-full">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <Image
            src={dish.image}
            alt=""
            fill
            sizes={sizes ?? "(min-width: 1280px) 296px, (min-width: 768px) 45vw, 296px"}
            className="object-cover"
          />
        </Link>
        {dish.badge && <Badge label={dish.badge.label} tone={dish.badge.tone} className="absolute start-4 top-4" />}
        <button
          type="button"
          onClick={() => toggleFavoriteAndNotify(dish, favorite)}
          aria-pressed={favorite}
          aria-label={favorite ? `إزالة ${dish.name} من المفضلة` : `إضافة ${dish.name} إلى المفضلة`}
          className="absolute end-4 top-4 flex size-9 items-center justify-center rounded-full bg-surface text-ink transition-transform duration-150 active:scale-90"
        >
          <Heart size={18} strokeWidth={1.75} className={cn("transition-colors", favorite && "fill-error text-error")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-h4 font-semibold text-ink">
          <Link href={href} className="hover:text-brand">
            {dish.name}
          </Link>
        </h3>
        <p className="text-body-s text-muted">{dish.description}</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-label-s font-medium text-ink">
            <Star size={14} strokeWidth={1.75} className="fill-accent text-accent" aria-hidden />
            <span aria-label={`التقييم ${dish.rating}`}>{dish.rating}</span>
          </span>
          <span className="flex items-center gap-1 text-caption text-faint">
            <Clock size={14} strokeWidth={1.75} aria-hidden />
            {dish.prepMinutes} دقيقة
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-price font-semibold text-brand">{formatPrice(dish.price)}</p>
          <AddToCartButton dish={dish} />
        </div>
      </div>
    </article>
  );
}
