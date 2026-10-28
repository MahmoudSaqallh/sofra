import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ReservationForm } from "@/components/home/reservation-form";

const hours = [
  { days: "السبت – الأربعاء", time: "7:00 ص – 1:00 ص" },
  { days: "الخميس – الجمعة", time: "7:00 ص – 2:00 ص" },
];

export function Reservation() {
  return (
    <section id="reservation" aria-labelledby="reservation-title" className="md:bg-subtle">
      {/* Mobile: compact CTA card (390 frame) */}
      <div className="shell pt-10 md:hidden">
        <div className="flex flex-col items-start gap-3.5 rounded-3xl border border-accent-line bg-accent-subtle p-6">
          <CalendarDays size={28} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
          <h2 className="font-display text-h2 font-semibold text-brand">احجز طاولتك في ثوانٍ</h2>
          <p className="text-body-s text-muted">18 طاولة متاحة الليلة في فرع العليا. تأكيد فوري عبر الجوال.</p>
          <ButtonLink href="/reservations" variant="primary" arrow fullWidth>
            احجز الآن
          </ButtonLink>
        </div>
      </div>

      {/* Tablet/desktop: full form + interior photo */}
      <div className="shell hidden gap-12 py-28 md:flex lg:items-center lg:justify-center">
        <div className="flex w-full flex-col gap-7 rounded-[28px] bg-surface p-8 shadow-md lg:max-w-[640px] lg:p-12">
          <SectionHeading
            id="reservation-title"
            overline="الحجوزات"
            title="احجز طاولتك"
            description="تأكيد فوري عبر رسالة نصية، وتذكير قبل موعدك بساعتين."
          />
          <ReservationForm />
        </div>

        <div className="relative isolate hidden h-[720px] min-w-0 flex-1 overflow-hidden rounded-[28px] lg:block lg:max-w-[592px]">
          <Image
            src="/images/interior.png"
            alt="صالة طعام سُفرة بفوانيس نحاسية وأقواس"
            fill
            sizes="592px"
            className="-z-20 object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(11_32_25/0)] to-[rgb(11_32_25/0.7)]" />

          <div className="absolute right-6 bottom-6 flex w-[300px] max-w-[calc(100%-3rem)] flex-col items-start gap-3 rounded-[20px] bg-surface p-6 shadow-lg">
            <p className="font-display text-h4 font-semibold text-brand">ساعات العمل</p>
            {hours.map((row) => (
              <div key={row.days} className="flex w-full items-center justify-between">
                <span className="text-body-s text-muted">{row.days}</span>
                <span className="text-label-s font-medium text-ink">{row.time}</span>
              </div>
            ))}
            <p className="flex items-center gap-2 rounded-full bg-success-subtle px-3 py-1.5 text-label-s font-medium text-success">
              <span aria-hidden className="size-2 rounded-full bg-success" />
              مفتوح الآن · 18 طاولة متاحة الليلة
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
