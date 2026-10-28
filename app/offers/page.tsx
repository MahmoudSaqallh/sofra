import type { Metadata } from "next";
import { Check, ChevronDown, Gift, Receipt, Star } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { OfferBoard } from "@/components/offers/offer-board";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { loyaltyTiers } from "@/lib/offers";
import { POINTS_REDEEM } from "@/lib/account";

export const metadata: Metadata = {
  title: "العروض",
  description: "عروض أسبوعية على أطباقكم المفضلة، ومكافآت أكثر لأعضاء برنامج الولاء.",
};

const steps = [
  { icon: Receipt, title: "اطلب", text: "من الموقع أو التطبيق أو في المطعم" },
  { icon: Star, title: "اجمع النقاط", text: "نقطة لكل 10 ريالات تنفقها" },
  { icon: Gift, title: "استبدل", text: `${POINTS_REDEEM.points} نقطة = ${POINTS_REDEEM.value} ر.س أو طبق مجاني` },
];

// Not in Figma: the "شروط البرنامج" button has no target frame, so it expands terms built only from facts stated on this page.
const terms = [
  "العضوية مجانية، وتبدأ كل العضويات بالمستوى البرونزي.",
  "تُحتسب النقاط على قيمة الطلب بعد الخصم، وحسب معدّل مستواك.",
  `يمكن استبدال كل ${POINTS_REDEEM.points} نقطة بقيمة ${POINTS_REDEEM.value} ر.س أو بطبق مجاني.`,
  "يرتقي مستواك تلقائياً عند بلوغ حد النقاط للمستوى التالي.",
];

export default function OffersPage() {
  return (
    <>
      <PageHero
        crumb="العروض"
        title="عروض سُفرة"
        lead="عروض أسبوعية على أطباقكم المفضلة، ومكافآت أكثر لأعضاء برنامج الولاء."
        image="/images/mansaf.png"
        imageAlt="منسف بلدي يُقدَّم في سُفرة"
      />

      <div className="shell pt-8 pb-16 md:pt-14 md:pb-24 xl:px-[120px]">
        <OfferBoard />
      </div>

      <section id="loyalty" aria-labelledby="loyalty-title" className="bg-accent-subtle py-16 md:py-24">
        <div className="shell flex flex-col gap-10 xl:px-[120px]">
          <SectionHeading
            id="loyalty-title"
            overline="برنامج الولاء"
            title="كلما طلبت أكثر، كسبت أكثر"
            description="اجمع نقطة مقابل كل ريال، واستبدلها بأطباق مجانية ومزايا حصرية."
          />

          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex items-center gap-4 rounded-[20px] bg-subtle p-5 md:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-accent-light">
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-h4 font-semibold text-brand">
                    <span className="sr-only">الخطوة {i + 1}: </span>
                    {title}
                  </h3>
                  <p className="text-body-s text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {loyaltyTiers.map((tier) => {
              const top = tier.id === "gold";
              return (
                <li
                  key={tier.id}
                  className={cn(
                    "relative flex flex-col gap-5 rounded-[24px] p-6 md:p-8",
                    top ? "bg-inverse text-canvas shadow-lg" : "border border-line bg-surface",
                  )}
                >
                  {top && (
                    <span className="absolute end-6 top-6 rounded-full bg-accent px-3 py-1 text-label-s font-medium text-brand">
                      الأكثر مزايا
                    </span>
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className={cn("font-display text-display-m font-bold", top ? "text-accent-light" : "text-brand")}>
                      {tier.name}
                    </h3>
                    <p className={cn("text-label-m", top ? "opacity-80" : "text-muted")}>{tier.range}</p>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-body-m">
                        <Check
                          size={18}
                          strokeWidth={1.75}
                          aria-hidden
                          className={cn("mt-0.5 shrink-0", top ? "text-accent-light" : "text-success")}
                        />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/sign-in" arrow>
                انضم مجاناً الآن
              </ButtonLink>
            </div>
            <details className="group max-w-[720px]">
              <summary className="inline-flex h-12 cursor-pointer list-none items-center gap-2 rounded-full px-2 text-label-m font-medium text-brand underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
                شروط البرنامج
                <ChevronDown size={18} strokeWidth={1.75} aria-hidden className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mt-2 flex list-disc flex-col gap-2 ps-6 text-body-s text-muted">
                {terms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
