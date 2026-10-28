import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { meals } from "@/lib/menu";

export function MealTimes() {
  return (
    <section aria-labelledby="meals-title" className="pt-10 md:bg-subtle md:py-28">
      <div className="shell flex flex-col gap-3 md:gap-12">
        <SectionHeading
          id="meals-title"
          overline="على مدار اليوم"
          title="لكل وجبة حكاية"
          description="قوائم مخصصة لكل وقت، تتجدد موسمياً بإشراف رئيس الطهاة."
        />

        {/* Mobile: compact rows */}
        <ul className="flex flex-col gap-3 md:hidden">
          {meals.map((meal) => (
            <li key={meal.slug}>
              <Link
                href={`/menu?category=${meal.slug}`}
                className="flex items-center gap-3.5 rounded-[18px] border border-line bg-surface p-2.5"
              >
                <Image
                  src={meal.image}
                  alt=""
                  width={88}
                  height={72}
                  className="h-[72px] w-[88px] shrink-0 rounded-xl object-cover"
                />
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <span className="font-display text-h3 font-semibold text-brand">{meal.name}</span>
                  <span className="flex items-center gap-1 text-caption text-faint">
                    <Clock size={12} strokeWidth={1.75} aria-hidden />
                    {meal.hours}
                  </span>
                </span>
                <ArrowLeft size={18} strokeWidth={1.75} className="shrink-0 text-brand" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        {/* Tablet/desktop: photo cards */}
        <ul className="hidden gap-6 md:grid md:grid-cols-3 xl:gap-8">
          {meals.map((meal) => (
            <li key={meal.slug}>
              <Link
                href={`/menu?category=${meal.slug}`}
                className="group relative isolate flex h-[440px] overflow-hidden rounded-3xl lg:h-[540px]"
              >
                <Image
                  src={meal.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 405px, 33vw"
                  className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(11_32_25/0)] to-[rgb(11_32_25/0.92)]"
                />
                <span className="mt-auto flex w-full flex-col items-start gap-3 p-6 lg:p-8">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/16 px-3 py-1.5 text-label-s font-medium text-canvas">
                    <Clock size={14} strokeWidth={1.75} aria-hidden />
                    {meal.hours}
                  </span>
                  <span className="font-display text-h2 font-semibold text-canvas lg:text-h1">{meal.name}</span>
                  <span className="text-body-s text-canvas">{meal.description}</span>
                  <span className="flex items-center gap-1.5 text-label-m font-medium text-accent-light">
                    اكتشف القائمة
                    <ArrowLeft
                      size={16}
                      strokeWidth={1.75}
                      aria-hidden
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
