import type { Metadata } from "next";
import Image from "next/image";
import { Check, ChefHat, Clock, Heart, Star, Store } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { CateringPlanner } from "@/components/catering/catering-planner";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { clients, services } from "@/lib/catering";

export const metadata: Metadata = {
  title: "الضيافة والمناسبات",
  description: "من عشاء عائلي خاص إلى مؤتمرات الشركات — نحضّر، نقدّم، ونهتم بكل التفاصيل.",
};

const reasons = [
  { icon: ChefHat, title: "طهاة محترفون", text: "نفس جودة مطاعمنا في مناسبتك" },
  { icon: Clock, title: "دقة في المواعيد", text: "نصل قبل موعدك بساعة للتجهيز" },
  { icon: Heart, title: "تخصيص كامل", text: "قوائم نباتية، أطفال، وحميات خاصة" },
  { icon: Check, title: "بدون عناء", text: "نحن نرتّب وننظّف بعد المناسبة" },
];

export default function CateringPage() {
  return (
    <>
      <PageHero
        crumb="الضيافة والمناسبات"
        height="lg"
        title="ضيافة سُفرة لمناسباتكم"
        lead="من عشاء عائلي خاص إلى مؤتمرات الشركات — نحضّر، نقدّم، ونهتم بكل التفاصيل."
        image="/images/chef.png"
        imageAlt="طاهٍ في مطبخ سُفرة يجهّز طبقاً"
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <ButtonLink href="#quote" variant="accent" arrow>
            اطلب عرض سعر
          </ButtonLink>
          <ButtonLink href="#packages" variant="inverse">
            تصفّح الباقات
          </ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="services-title" className="py-16 md:py-24 lg:py-28">
        <div className="shell flex flex-col gap-10 md:gap-12">
          <SectionHeading id="services-title" overline="خدماتنا" title="ضيافة لكل مناسبة" />
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {services.map((s) => (
              <li key={s.title} className="relative isolate flex h-[320px] items-end overflow-hidden rounded-[24px] bg-inverse md:h-[400px]">
                <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 302px, (min-width: 640px) 50vw, 100vw" className="-z-20 object-cover" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(11_32_25/0)] to-[rgb(11_32_25/0.9)]" />
                <div className="flex flex-col items-start gap-2 p-6">
                  <Badge label={s.badge} tone="gold" />
                  <h3 className="font-display text-h3 font-semibold text-canvas">{s.title}</h3>
                  <p className="text-body-s text-accent-light">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CateringPlanner
        aside={
          <>
            <div className="flex flex-col gap-4 rounded-[28px] bg-inverse p-6 md:p-8">
              <h2 className="font-display text-h3 font-semibold text-canvas">لماذا ضيافة سُفرة؟</h2>
              <ul className="flex flex-col gap-4">
                {reasons.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white/8 text-accent-light">
                      <Icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="flex flex-col">
                      <p className="text-label-l font-medium text-canvas">{title}</p>
                      <p className="text-caption text-accent-light">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col-reverse items-center rounded-[20px] bg-accent-subtle p-5">
                <dt className="text-caption text-muted">مناسبة نظّمناها</dt>
                <dd dir="ltr" className="text-number-xl font-semibold text-brand">1,200+</dd>
              </div>
              <div className="flex flex-col-reverse items-center rounded-[20px] bg-accent-subtle p-5">
                <dt className="text-caption text-muted">شركة تثق بنا</dt>
                <dd className="text-number-xl font-semibold text-brand">85</dd>
              </div>
            </dl>

            <figure className="flex flex-col gap-3 rounded-[24px] border border-line bg-surface p-6">
              <div className="flex gap-0.5" role="img" aria-label="التقييم 5 من 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} strokeWidth={1.75} aria-hidden className="fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-body-m text-ink">
                «نظّمت سُفرة حفل نهاية العام لـ 320 موظفاً بتفاصيل مثالية. الطعام كان حديث الجميع!»
              </blockquote>
              <figcaption className="flex items-center gap-2.5">
                <Avatar initials="عر" />
                <span className="flex flex-col">
                  <span className="text-label-m font-medium text-ink">م. عبدالعزيز الراشد</span>
                  <span className="text-caption text-muted">مدير الموارد البشرية · شركة رؤى</span>
                </span>
              </figcaption>
            </figure>
          </>
        }
      />

      <section aria-labelledby="clients-title" className="bg-accent-subtle py-10 md:py-12">
        <div className="shell flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="clients-title" className="font-display text-h4 font-semibold text-brand">
            يثق بنا
          </h2>
          <ul className="flex flex-wrap gap-3 lg:flex-1 lg:justify-between lg:gap-4 lg:ps-10">
            {clients.map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-[14px] border border-line bg-surface px-[22px] py-3 text-label-m font-medium text-muted">
                <Store size={16} strokeWidth={1.75} aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
