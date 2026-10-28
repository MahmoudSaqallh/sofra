import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { formatPrice, type Dish } from "@/lib/menu";

// Figma "Menu Card" (Horizontal): used for mobile lists — 96px photo on the start side.
export function MenuListCard({ dish }: { dish: Dish }) {
  return (
    <article className="relative flex items-center gap-3.5 rounded-2xl border border-line bg-surface p-3">
      <Link href={`/menu/${dish.slug}`} tabIndex={-1} aria-hidden className="shrink-0">
        <Image src={dish.image} alt="" width={96} height={96} className="size-24 rounded-xl object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <h3 className="text-label-l font-medium text-ink">
          <Link href={`/menu/${dish.slug}`}>{dish.name}</Link>
        </h3>
        <p className="line-clamp-1 text-caption text-muted">{dish.short}</p>
        <div className="flex w-full items-center justify-between pt-1.5">
          <p className="text-price font-semibold text-brand">{formatPrice(dish.price)}</p>
          <AddToCartButton dish={dish} size="sm" />
        </div>
      </div>
    </article>
  );
}
