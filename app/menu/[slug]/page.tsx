import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { DishGallery } from "@/components/menu/dish-gallery";
import { DishOrderForm } from "@/components/menu/dish-order-form";
import { DishTabs } from "@/components/menu/dish-tabs";
import { MenuCard } from "@/components/menu/menu-card";
import { dishes, dishTypes, getDish, relatedDishes } from "@/lib/menu";
import { dishReviews } from "@/lib/reviews";

export function generateStaticParams() {
  return dishes.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) return {};
  return { title: dish.name, description: dish.story ?? dish.description };
}

// The params read lives under <Suspense> so client navigations into a dish stay instant
// (Cache Components validation); direct visits are still fully prerendered via generateStaticParams.
export default function DishPage({ params }: PageProps<"/menu/[slug]">) {
  return (
    <Suspense fallback={<DishSkeleton />}>
      <DishContent params={params} />
    </Suspense>
  );
}

function DishSkeleton() {
  return (
    <div aria-hidden className="shell flex flex-col gap-8 pb-24 md:pt-8 lg:flex-row lg:gap-16">
      <div className="-mx-5 h-[360px] animate-pulse bg-subtle md:mx-0 md:h-[460px] md:rounded-[28px] lg:order-last lg:flex-1 xl:h-[560px]" />
      <div className="flex flex-col gap-5 lg:w-[576px]">
        <div className="h-7 w-40 animate-pulse rounded-full bg-subtle" />
        <div className="h-14 w-3/4 animate-pulse rounded-xl bg-subtle" />
        <div className="h-24 animate-pulse rounded-xl bg-subtle" />
        <div className="h-48 animate-pulse rounded-2xl bg-subtle" />
      </div>
    </div>
  );
}

async function DishContent({ params }: { params: PageProps<"/menu/[slug]">["params"] }) {
  const { slug } = await params;
  const dish = getDish(slug);
  if (!dish) notFound();

  const type = dishTypes.find((t) => t.slug === dish.type);
  const badges = [dish.badge, ...(dish.extraBadges ?? [])].filter(Boolean);
  const prep = dish.prepMaxMinutes ? `${dish.prepMinutes}–${dish.prepMaxMinutes} دقيقة` : `${dish.prepMinutes} دقيقة`;

  return (
    <div className="shell flex flex-col gap-8 pb-10 md:gap-8 md:pt-8 md:pb-24">
      <div className="hidden md:block">
        <Breadcrumbs
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "القائمة", href: "/menu" },
            ...(type ? [{ label: type.label, href: `/menu?category=${type.slug}` }] : []),
            { label: dish.name },
          ]}
        />
      </div>

      <div className="flex flex-col gap-0 md:gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* One gallery: first on mobile (full-bleed), left column on desktop (RTL row: info is first/right). */}
        <div className="min-w-0 lg:order-last lg:flex-1">
          <DishGallery slug={dish.slug} images={dish.gallery ?? [dish.image]} name={dish.name} />
        </div>

        <div className="flex flex-col gap-[18px] md:gap-6 lg:w-[576px] lg:shrink-0">
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {badges.map((b) => (
                <Badge key={b!.label} label={b!.label} tone={b!.tone} />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <h1 className="font-display text-h1 font-semibold text-brand md:text-display-m md:font-bold">{dish.name}</h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-1.5">
                <Rating value={dish.rating} />
                {dish.reviewCount && (
                  <span className="text-caption text-faint">
                    ({dish.reviewCount.toLocaleString("en-US")}
                    <span className="hidden md:inline"> تقييم</span>)
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1 text-caption text-muted md:gap-1.5 md:text-body-s">
                <Clock size={16} strokeWidth={1.75} aria-hidden />
                {prep}
              </span>
            </div>
          </div>
          <p className="text-body-m text-muted md:text-body-l">{dish.story ?? dish.description}</p>
          <DishOrderForm dish={dish} />
        </div>
      </div>

      <DishTabs dish={dish} reviews={dishReviews[dish.slug]} />

      <section aria-labelledby="related-title" className="flex flex-col gap-6 pt-6">
        <h2 id="related-title" className="font-display text-h2 font-semibold text-brand">
          قد يعجبك أيضاً
        </h2>
        <ul className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 xl:grid-cols-4">
          {relatedDishes(dish).map((d) => (
            <li key={d.slug} className="flex w-[296px] shrink-0 snap-start md:w-auto">
              <MenuCard dish={d} className="w-full" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
