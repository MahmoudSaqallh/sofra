import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { CopyCode } from "@/components/home/copy-code";

const CODE = "SUFRA20";

export function OfferBanner() {
  return (
    <section aria-labelledby="offer-title" className="shell pt-10 md:pt-0 md:pb-28">
      <div className="flex flex-col overflow-hidden rounded-3xl bg-inverse md:rounded-[32px] lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-10 lg:p-14">
        <div className="relative h-[180px] w-full shrink-0 md:h-[320px] lg:h-[400px] lg:w-[520px] lg:max-w-[45%] lg:overflow-hidden lg:rounded-3xl">
          <Image
            src="/images/mansaf.png"
            alt="سُفرة مشاوي عائلية مع أرز وأطباق جانبية"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-3 p-6 md:gap-5 md:p-10 lg:max-w-[560px] lg:p-0">
          <Badge label="عرض نهاية الأسبوع" tone="gold" />
          <h2
            id="offer-title"
            className="font-display text-h2 font-semibold text-canvas md:text-display-m md:font-bold"
          >
            خصم 20٪ على سُفر المشاوي العائلية
          </h2>

          {/* Mobile copy (390 frame) */}
          <p className="text-body-s text-accent-light md:hidden">
            استخدم الرمز <span dir="ltr">{CODE}</span> · الخميس – السبت
          </p>

          {/* Tablet/desktop copy */}
          <p className="hidden max-w-[520px] text-body-l text-canvas/85 md:block">
            سُفرة تكفي 4–6 أشخاص مع المقبلات والمشروبات. العرض ساري الخميس إلى السبت للطلبات والحجوزات.
          </p>
          <CopyCode code={CODE} className="hidden md:flex" />

          <ButtonLink
            href="/order"
            variant="accent"
            arrow
            className="max-md:h-12 max-md:px-6 max-md:text-label-m"
          >
            <span className="md:hidden">اطلب السُفرة</span>
            <span className="hidden md:inline">اطلب السُفرة الآن</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
