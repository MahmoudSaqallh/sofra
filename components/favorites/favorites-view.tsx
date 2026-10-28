"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { MenuCard } from "@/components/menu/menu-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button, ButtonLink } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { clearFavorites, restoreFavorites, useFavorites } from "@/lib/favorites";
import { dishCountLabel, dishes, featuredDishes, formatPrice, getDish } from "@/lib/menu";
import { addManyToCart } from "@/lib/notify";
import { notify } from "@/lib/notifications";
import { useIsClient } from "@/lib/use-is-client";

/*
 * Favorites ("المفضلة") — not drawn in Figma. Built from the Menu page header (bg-subtle, breadcrumbs, Display title)
 * and the Figma Menu Card grid, so hearts, prices and "add" behave exactly like on the menu.
 */

type Sort = "recent" | "rating" | "price";
const sorts: { value: Sort; label: string }[] = [
  { value: "recent", label: "الأحدث" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price", label: "الأقل سعراً" },
];

const gridSizes = "(min-width: 1280px) 296px, (min-width: 768px) 45vw, 100vw";

export function FavoritesView() {
  const isClient = useIsClient();
  const slugs = useFavorites();
  const [sort, setSort] = useState<Sort>("recent");
  const [confirmClear, setConfirmClear] = useState(false);

  const saved = slugs.flatMap((s) => getDish(s) ?? []);
  const list = [...saved];
  if (sort === "recent") list.reverse();
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  if (sort === "price") list.sort((a, b) => a.price - b.price);
  const total = saved.reduce((sum, d) => sum + d.price, 0);
  const suggestions = (saved.length ? dishes : featuredDishes)
    .filter((d) => !slugs.includes(d.slug) && d.slug !== "small-fattoush")
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  function addAll() {
    addManyToCart(saved.map((d) => ({ slug: d.slug })), "أُضيفت المفضلة إلى السلة");
  }

  function clearAll() {
    const before = slugs;
    clearFavorites();
    setConfirmClear(false);
    notify({
      tone: "info",
      title: "مُسحت المفضلة",
      description: dishCountLabel(before.length),
      action: { label: "تراجع", onClick: () => restoreFavorites(before) },
    });
  }

  return (
    <>
      {/* ---------- Page header (Menu page pattern) ---------- */}
      <section className="bg-subtle">
        <div className="shell flex flex-col gap-4 pt-6 pb-6 md:flex-row md:items-end md:justify-between md:gap-8 md:pt-14 md:pb-12">
          <div className="flex flex-col items-start gap-3">
            <div className="hidden md:block">
              <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "المفضلة" }]} />
            </div>
            <h1 className="flex items-center gap-3 font-display text-display-m font-bold text-brand md:text-display-l">
              المفضلة
              <Heart size={36} strokeWidth={1.75} aria-hidden className="fill-error text-error md:size-11" />
            </h1>
            <p className="text-body-m text-muted md:text-body-l">أطباقك المحفوظة في مكان واحد — اطلبها متى اشتهيتها.</p>
          </div>

          {isClient && saved.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-4 sm:flex-row sm:items-center md:gap-5 md:p-5">
              <div className="flex flex-col">
                <p className="text-caption text-muted">مجموع الأسعار</p>
                <p className="text-number-l font-semibold text-brand">{formatPrice(total)}</p>
              </div>
              <Button size="md" onClick={addAll}>
                <ShoppingBag size={18} strokeWidth={1.75} aria-hidden />
                أضف الكل إلى السلة
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="shell flex flex-col gap-12 py-8 md:gap-16 md:py-12">
        {!isClient ? (
          <ul aria-hidden className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="h-[400px] animate-pulse rounded-[20px] bg-subtle" />
            ))}
          </ul>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-line-strong px-6 py-14 text-center md:py-20">
            <span className="flex size-[88px] items-center justify-center rounded-[28px] bg-error-subtle text-error">
              <Heart size={40} strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="font-display text-h2 font-bold text-brand">مفضلتك فارغة حالياً</h2>
            <p className="max-w-[440px] text-body-m text-muted">
              اضغط على القلب في أي طبق لتحفظه هنا، وارجع إليه بسرعة عند طلبك القادم.
            </p>
            <ButtonLink href="/menu" arrow>
              تصفّح القائمة
            </ButtonLink>
          </div>
        ) : (
          <section aria-labelledby="saved-title" className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 id="saved-title" className="flex items-center gap-2.5 font-display text-h3 font-semibold text-brand md:text-h2">
                أطباقك المحفوظة
                <span className="rounded-full bg-error-subtle px-3 py-0.5 font-sans text-label-m font-medium text-error">
                  {dishCountLabel(saved.length)}
                </span>
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
                  <SegmentedControl label="ترتيب المفضلة" options={sorts} value={sort} onChange={setSort} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirmClear) return setConfirmClear(true);
                    clearAll();
                  }}
                  onBlur={() => setConfirmClear(false)}
                  className={
                    confirmClear
                      ? "flex h-10 items-center gap-1.5 rounded-full bg-error px-4 text-label-m font-medium text-canvas"
                      : "flex h-10 items-center gap-1.5 rounded-full px-3 text-label-m font-medium text-error hover:bg-error-subtle"
                  }
                >
                  <Trash2 size={16} strokeWidth={1.75} aria-hidden />
                  {confirmClear ? `تأكيد مسح ${dishCountLabel(saved.length)}` : "مسح الكل"}
                </button>
              </div>
            </div>

            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {list.map((dish) => (
                <li key={dish.slug} className="flex">
                  <MenuCard dish={dish} className="w-full" sizes={gridSizes} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {isClient && suggestions.length > 0 && (
          <section aria-labelledby="suggest-title" className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-overline font-medium text-accent-ink">{saved.length ? "قد يعجبك أيضاً" : "ابدأ من هنا"}</p>
                <h2 id="suggest-title" className="font-display text-h3 font-semibold text-brand md:text-h2">
                  أطباق يحبها ضيوفنا
                </h2>
              </div>
              <Link href="/menu" className="shrink-0 text-label-m font-medium text-brand hover:underline">
                القائمة كاملة
              </Link>
            </div>
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {suggestions.map((dish) => (
                <li key={dish.slug} className="flex">
                  <MenuCard dish={dish} className="w-full" sizes={gridSizes} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
