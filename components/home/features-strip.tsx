import { CalendarDays, Leaf, Store, Truck } from "lucide-react";

const features = [
  { icon: Truck, title: "توصيل خلال 35 دقيقة", caption: "لجميع الأحياء القريبة من فروعنا" },
  { icon: Leaf, title: "مكوّنات طازجة يومياً", caption: "من مزارع محلية موثوقة" },
  { icon: CalendarDays, title: "حجز فوري للطاولات", caption: "تأكيد مباشر عبر الجوال" },
  { icon: Store, title: "12 فرعاً", caption: "في الرياض وجدة والدمام" },
];

// Not part of the 390 mobile frame, so it starts at tablet width.
export function FeaturesStrip() {
  return (
    <section aria-label="لماذا سُفرة" className="hidden border-b border-line bg-surface md:block">
      <ul className="shell-wide grid grid-cols-2 gap-6 py-9 lg:flex lg:items-center lg:justify-between">
        {features.map(({ icon: Icon, title, caption }) => (
          <li key={title} className="flex items-center gap-3.5">
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
              <Icon size={24} strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-label-l font-medium text-ink">{title}</span>
              <span className="text-caption text-muted">{caption}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
