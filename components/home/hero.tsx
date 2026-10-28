import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/menu";

const stats = [
  { value: "4.9", label: "تقييم 12 ألف ضيف" },
  { value: "12", label: "فرعاً في المملكة" },
  { value: "180+", label: "طبقاً في القائمة" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-inverse">
      <Image
        src="/images/grill.png"
        alt="طبق مشاوي مشكّلة مع أرز بالزعفران على طاولة سُفرة"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Mobile: vertical fade. Desktop: horizontal fade toward the text side + top fade under the nav. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(11_32_25/0.1)] to-[rgb(11_32_25/0.95)] lg:bg-linear-to-r lg:from-[rgb(11_32_25/0.2)] lg:via-[rgb(11_32_25/0.6)] lg:via-45% lg:to-[rgb(11_32_25/0.96)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 hidden h-[200px] bg-linear-to-b from-[rgb(11_32_25/0.7)] to-transparent lg:block"
      />

      <div className="shell flex min-h-[620px] flex-col justify-end pt-20 pb-10 lg:min-h-[880px] lg:justify-start lg:pt-[200px] lg:pb-20 xl:px-[120px]">
        <div className="flex max-w-[660px] flex-col items-start gap-4 lg:gap-7">
          <p className="flex items-center gap-1.5 rounded-full border border-accent-line bg-white/12 px-3 py-1.5 text-label-s font-medium text-accent-light lg:gap-2 lg:bg-white/10 lg:px-4 lg:py-2">
            <Flame size={16} strokeWidth={1.75} aria-hidden />
            <span className="lg:hidden">مطبخ عربي معاصر</span>
            <span className="hidden lg:inline">مطبخ عربي معاصر · منذ 2012</span>
          </p>

          <h1
            id="hero-title"
            className="font-display text-display-m font-bold text-canvas lg:text-display-l"
          >
            حيث تلتقي الضيافة الأصيلة <br className="hidden lg:block" />
            بفنّ الطهي<span className="hidden lg:inline"> الحديث</span>
          </h1>

          <p className="max-w-[560px] text-body-m text-canvas lg:text-body-l lg:opacity-90">
            <span className="lg:hidden">مشاوي على الفحم، برجر وبيتزا يدوية، وحلويات شرقية فاخرة.</span>
            <span className="hidden lg:inline">
              من فطور الصباح إلى عشاء المساء، نقدّم مشاوي على الفحم، برجر وبيتزا محضّرة يدوياً، وحلويات شرقية
              فاخرة — في أجواء تليق بضيوفنا.
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-2.5 lg:gap-4">
            <ButtonLink href="/order" variant="accent" arrow>
              اطلب الآن
            </ButtonLink>
            <ButtonLink href="#reservation" variant="inverse">
              احجز طاولة
            </ButtonLink>
          </div>

          <ul className="hidden items-center gap-10 pt-4 lg:flex">
            {stats.map((stat) => (
              <li key={stat.label} className="flex flex-col items-start gap-0.5">
                <span className="text-number-xl font-semibold text-accent-light">{stat.value}</span>
                <span className="text-body-s text-canvas">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dish of the day — desktop only, bottom-left of the hero */}
      <Link
        href="/menu/aged-ribeye-300"
        className="absolute bottom-20 left-10 hidden items-center gap-4 rounded-[20px] bg-surface p-4 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 lg:flex xl:left-[120px]"
      >
        <span className="flex flex-col items-start gap-1">
          <span className="text-overline font-medium text-accent-ink">طبق اليوم</span>
          <span className="text-label-l font-medium text-ink">ريبآي مشوي بزبدة الأعشاب</span>
          <span className="text-price font-semibold text-brand">{formatPrice(189)}</span>
        </span>
        <Image
          src="/images/steak.png"
          alt=""
          width={88}
          height={88}
          className="size-[88px] rounded-[14px] object-cover"
        />
      </Link>
    </section>
  );
}
