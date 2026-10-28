import Image from "next/image";
import { Flame, Heart, Leaf } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

const pillars = [
  { icon: Leaf, title: "مكوّنات محلية", text: "نتعامل مع 30 مزرعة سعودية للخضار واللحوم." },
  { icon: Flame, title: "شواء على الفحم", text: "فحم السمر الطبيعي لنكهة مدخّنة أصيلة." },
  { icon: Heart, title: "ضيافة من القلب", text: "قهوة عربية وتمر ترحيبي لكل ضيف." },
];

// Not part of the 390 mobile frame, so it starts at tablet width.
export function OurStory() {
  return (
    <section
      aria-labelledby="story-title"
      className="shell hidden flex-col items-center gap-12 py-24 md:flex lg:flex-row lg:justify-center lg:gap-16 lg:py-30 xl:gap-24"
    >
      <div className="flex w-full max-w-[560px] flex-col items-start gap-7">
        <SectionHeading id="story-title" overline="قصتنا" title="من سُفرة البيت إلى سُفرتكم" />
        <p className="text-body-l text-muted">
          بدأت سُفرة عام 2012 بفكرة بسيطة: أن نقدّم طعام البيت العربي بمعايير المطاعم الفاخرة. اليوم يقود فريقنا من
          140 طاهياً رئيسُ الطهاة يوسف الحربي، محافظين على وصفات الجدّات ومضيفين إليها لمسات عصرية.
        </p>

        <ul className="flex flex-col gap-4">
          {pillars.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-accent-subtle text-accent-ink">
                <Icon size={22} strokeWidth={1.75} aria-hidden />
              </span>
              <span className="flex flex-col items-start gap-0.5">
                <span className="text-label-l font-medium text-ink">{title}</span>
                <span className="text-body-s text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 pt-2">
          <Avatar initials="يح" size="lg" />
          <div className="flex flex-col items-start">
            <p className="font-display text-h4 font-semibold text-brand">يوسف الحربي</p>
            <p className="text-caption text-muted">رئيس الطهاة والشريك المؤسس</p>
          </div>
        </div>

        <ButtonLink href="/about#team" variant="outline" size="md" arrow>
          تعرّف على فريقنا
        </ButtonLink>
      </div>

      {/* Media: 520×560 photo offset from a 580×600 frame, "since" badge overlapping bottom-left */}
      <div className="relative h-[600px] w-full max-w-[580px] shrink-0">
        <div className="absolute top-0 right-0 h-[560px] w-[calc(100%-60px)] overflow-hidden rounded-3xl">
          <Image
            src="/images/chef.png"
            alt="رئيس الطهاة يضع اللمسات الأخيرة على طبق في مطبخ سُفرة"
            fill
            sizes="(min-width: 1024px) 520px, 90vw"
            className="object-cover"
          />
        </div>
        <div className="absolute top-[420px] left-0 flex flex-col items-center gap-0.5 rounded-[20px] bg-accent p-6 text-brand shadow-lg">
          <span className="font-display text-display-m font-bold">14</span>
          <span className="text-label-s font-medium">عاماً من الضيافة</span>
        </div>
      </div>
    </section>
  );
}
