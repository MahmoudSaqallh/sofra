import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryChip } from "@/components/menu/category-chip";
import { MenuCard } from "@/components/menu/menu-card";
import { categories, featuredDishes } from "@/lib/menu";

/*
 * Desktop: one "Menu highlights" section (header, chips, 4-card grid).
 * Mobile (390 frame) splits it into "تصفّح حسب التصنيف" (scrolling chips) and
 * "أطباق يحبها ضيوفنا" (scrolling cards) with their own headings.
 */
export function MenuHighlights() {
  return (
    <section aria-labelledby="menu-title" className="shell flex flex-col gap-4 pt-8 md:gap-12 md:py-28">
      {/* Desktop/tablet header */}
      <div className="hidden items-end justify-between gap-6 md:flex">
        <SectionHeading
          id="menu-title"
          overline="قائمة سُفرة"
          title="أطباق تُحضَّر بشغف"
          description="اختر من بين أكثر من 180 طبقاً تغطي يومك كاملاً، من الفطور حتى الحلى."
        />
        <Link
          href="/menu"
          className="flex shrink-0 items-center gap-2 pb-2 text-label-l font-medium text-brand hover:text-accent-ink"
        >
          تصفّح القائمة كاملة
          <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      {/* Mobile header — categories */}
      <SectionHeading overline="قائمة سُفرة" title="تصفّح حسب التصنيف" className="md:hidden" />

      <nav aria-label="تصنيفات القائمة">
        <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:gap-3 md:overflow-visible md:px-0">
          {categories.map((category) => (
            <li key={category.slug} className={category.slug === "all" ? "hidden md:block" : undefined}>
              <CategoryChip category={category} selected={category.slug === "all"} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile header — popular dishes */}
      <div className="flex items-end justify-between gap-4 pt-6 md:hidden">
        <div className="flex flex-col items-start gap-1">
          <p className="text-overline font-medium text-accent-ink">الأكثر طلباً</p>
          <h2 id="menu-title-mobile" className="font-display text-h2 font-semibold text-brand">
            أطباق يحبها ضيوفنا
          </h2>
        </div>
        <Link href="/menu" className="flex shrink-0 items-center gap-1 pb-1.5 text-label-s font-medium text-brand">
          عرض الكل
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <ul className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
        {featuredDishes.map((dish) => (
          <li key={dish.slug} className="flex w-[296px] shrink-0 snap-start md:w-auto">
            <MenuCard dish={dish} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
