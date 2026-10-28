import type { Metadata } from "next";
import Image from "next/image";
import { Check, Flame, Heart, Leaf, Mail, Star } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { MilestoneTimeline } from "@/components/about/milestone-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "عن سُفرة",
  description: "منذ 2012 ونحن نجمع العائلات والأصدقاء حول سُفرة واحدة، بأطباق تُحضَّر بشغف ومكوّنات نختارها بعناية.",
};

// RTL order as drawn in Figma (first item sits on the right).
const numbers = [
  { value: "14", label: "عاماً من الضيافة" },
  { value: "12", label: "فرعاً في 3 مدن" },
  { value: "140+", label: "طاهياً ومضيفاً" },
  { value: "1M+", label: "ضيف سنوياً" },
  { value: "4.9", label: "متوسط تقييم الضيوف" },
];

const values = [
  { icon: Leaf, title: "مكوّنات محلية طازجة", text: "نتعامل مع أكثر من 30 مزرعة سعودية، ونستلم الخضار واللحوم يومياً." },
  { icon: Flame, title: "نار الفحم الطبيعي", text: "نشوي على فحم السمر لنكهة مدخّنة أصيلة لا تقدّمها الأفران الكهربائية." },
  { icon: Heart, title: "ضيافة من القلب", text: "قهوة عربية وتمر ترحيبي لكل ضيف، وخدمة تتذكّر تفضيلاتك." },
  { icon: Check, title: "جودة بلا تنازل", text: "شهادات سلامة غذاء معتمدة، ومراجعة يومية لكل مطبخ من فريق الجودة." },
];

const milestones = [
  { year: "2012", title: "الافتتاح الأول", text: "أول فرع في حي العليا بـ 12 طاولة ومطبخ مفتوح." },
  { year: "2016", title: "التوسّع إلى جدة", text: "افتتاح فرع الكورنيش وإطلاق قائمة الفطور." },
  { year: "2019", title: "تطبيق سُفرة", text: "إطلاق التطبيق وخدمة التوصيل وبرنامج الولاء." },
  { year: "2023", title: "جائزة أفضل مطعم", text: "جائزة أفضل مطعم عربي معاصر في المملكة." },
  { year: "2026", title: "12 فرعاً", text: "وصلنا إلى الدمام، ونخدم أكثر من مليون ضيف." },
];

const team = [
  { initials: "نس", name: "نوف السبيعي", role: "مديرة الضيافة", text: "تقود فريق المضيفين في جميع الفروع وتصمّم تجربة الضيف." },
  { initials: "عق", name: "عمر القرشي", role: "شيف المشاوي", text: "خبير الشواء على الفحم، وصاحب وصفة مشاوي سُفرة الشهيرة." },
  { initials: "لع", name: "ليان العمري", role: "شيف الحلويات", text: "تعيد ابتكار الحلويات الشرقية: الكنافة، والمعمول، وأم علي." },
];

const awards = [
  { title: "أفضل مطعم عربي معاصر", source: "جوائز المطاعم السعودية 2023" },
  { title: "شهادة التميّز", source: "دليل الذوّاقة 2024" },
  { title: "الخيار الأول للعائلات", source: "استطلاع الرياض 2025" },
  { title: "أفضل تجربة توصيل", source: "جوائز التطبيقات 2025" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumb="عن سُفرة"
        height="lg"
        title={
          <>
            ضيافة عربية أصيلة
            <br />
            بروح معاصرة
          </>
        }
        lead="منذ 2012 ونحن نجمع العائلات والأصدقاء حول سُفرة واحدة، بأطباق تُحضَّر بشغف ومكوّنات نختارها بعناية."
        image="/images/interior.png"
        imageAlt="صالة سُفرة بأقواس وفوانيس نحاسية"
      />

      {/* Story */}
      <section id="story" aria-labelledby="story-title" className="shell flex flex-col gap-10 py-16 md:py-28 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
        <div className="flex max-w-[600px] flex-col items-start gap-6">
          <SectionHeading id="story-title" overline="قصتنا" title="من سُفرة البيت إلى سُفرتكم" />
          <p className="text-body-m text-muted md:text-body-l">
            بدأت الحكاية في مطبخ صغير بحي العليا، حين قرّر الشيف يوسف الحربي أن يقدّم طعام البيت العربي بمعايير المطاعم الفاخرة:
            وصفات الجدّات كما هي، بمكوّنات محلية طازجة، وتقديم يليق بالضيف.
          </p>
          <p className="text-body-m text-muted md:text-body-l">
            اليوم تضم سُفرة 12 فرعاً في الرياض وجدة والدمام، وفريقاً من أكثر من 140 طاهياً ومضيفاً، يقدّمون الفطور والغداء والعشاء
            لأكثر من مليون ضيف سنوياً — لكن الفكرة بقيت كما هي: أن يشعر كل ضيف أنه في بيته.
          </p>
          <div className="flex items-center gap-3.5 pt-2">
            <Avatar initials="يح" size="lg" />
            <div className="flex flex-col items-start">
              <p className="font-display text-h4 font-semibold text-brand">يوسف الحربي</p>
              <p className="text-caption text-muted">رئيس الطهاة والشريك المؤسس</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[600px] lg:mx-0 lg:shrink-0">
          <div className="absolute top-0 right-0 h-[93%] w-[73%] overflow-hidden rounded-[28px]">
            <Image src="/images/chef.png" alt="الشيف يضع اللمسات الأخيرة على طبق" fill sizes="(min-width: 1024px) 440px, 70vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 h-1/2 w-[43%] overflow-hidden rounded-3xl border-8 border-canvas">
            <Image src="/images/grill.png" alt="مشاوي سُفرة المشكّلة" fill sizes="(min-width: 1024px) 260px, 45vw" className="object-cover" />
          </div>
          <div className="absolute top-[10%] left-[7%] flex flex-col items-center rounded-[20px] bg-accent px-5 py-4 text-brand shadow-lg md:px-[22px] md:py-[18px]">
            <span className="text-number-l font-semibold md:text-number-xl">2012</span>
            <span className="text-label-s font-medium">بداية الحكاية</span>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section aria-label="سُفرة بالأرقام" className="bg-inverse text-canvas">
        <ul className="shell grid grid-cols-2 gap-y-8 py-12 md:grid-cols-5 md:py-16">
          {numbers.map((n, i) => (
            <li
              key={n.label}
              className={cn(
                "flex flex-col items-center gap-1 text-center",
                i > 0 && "md:border-s md:border-white/12",
                i === numbers.length - 1 && "col-span-2 md:col-span-1",
              )}
            >
              <span dir="ltr" className="font-display text-display-m font-bold text-accent-light">{n.value}</span>
              <span className="text-body-s">{n.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="shell flex flex-col gap-10 py-16 md:gap-12 md:py-28">
        <SectionHeading id="values-title" overline="قيمنا" title="ما يجعل سُفرة مختلفة" description="أربعة مبادئ نلتزم بها في كل طبق وكل زيارة." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {values.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-surface p-7">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-canvas">
                <Icon size={26} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="font-display text-h4 font-semibold text-brand">{title}</h3>
              <p className="text-body-s text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Milestones */}
      <section aria-labelledby="milestones-title" className="bg-subtle">
        <div className="shell flex flex-col gap-10 py-16 md:gap-12 md:py-28">
          <SectionHeading id="milestones-title" overline="مسيرتنا" title="محطات في رحلة سُفرة" />
          <MilestoneTimeline milestones={milestones} />
        </div>
      </section>

      {/* Team */}
      <section id="team" aria-labelledby="team-title" className="shell flex flex-col gap-10 py-16 md:gap-12 md:py-28">
        <SectionHeading id="team-title" overline="فريقنا" title="الأيدي التي تصنع الطعم" description="فريق من الطهاة والمضيفين يجمعهم شغف واحد بالضيافة." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <li className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="relative h-[280px]">
              <Image src="/images/chef.png" alt="الشيف يوسف الحربي" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />
            </div>
            <div className="flex flex-col items-start gap-1 p-6">
              <Badge label="المؤسس" tone="gold" />
              <h3 className="font-display text-h3 font-semibold text-brand">يوسف الحربي</h3>
              <p className="text-body-s text-muted">رئيس الطهاة · 22 عاماً في المطابخ العربية والفرنسية</p>
            </div>
          </li>
          {team.map((m) => (
            <li key={m.name} className="flex flex-col items-center justify-center gap-3.5 rounded-3xl border border-line bg-surface p-7 text-center">
              <span aria-hidden className="flex size-[120px] items-center justify-center rounded-full border-2 border-accent-line bg-accent-subtle font-display text-display-m font-bold text-accent-ink">
                {m.initials}
              </span>
              <h3 className="font-display text-h4 font-semibold text-brand">{m.name}</h3>
              <p className="text-label-m font-medium text-accent-ink">{m.role}</p>
              <p className="max-w-[236px] text-body-s text-muted">{m.text}</p>
              <div className="flex gap-2">
                <a href="mailto:hello@sufra.sa" aria-label={`مراسلة ${m.name}`} className="flex size-9 items-center justify-center rounded-full border border-line text-muted hover:border-brand hover:text-brand">
                  <Mail size={16} strokeWidth={1.75} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label={`إنستغرام ${m.name}`} className="flex size-9 items-center justify-center rounded-full border border-line hover:border-brand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/instagram.svg" alt="" width={16.3125} height={16.3125} />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Awards */}
      <section aria-labelledby="awards-title" className="bg-accent-subtle">
        <div className="shell flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-14">
          <h2 id="awards-title" className="font-display text-h3 font-semibold text-brand">
            تقدير نعتز به
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:flex lg:gap-10">
            {awards.map((a) => (
              <li key={a.title} className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent-line bg-surface text-accent">
                  <Star size={22} strokeWidth={1.75} className="fill-accent" aria-hidden />
                </span>
                <span className="flex flex-col items-start">
                  <span className="text-label-m font-medium text-brand">{a.title}</span>
                  <span className="text-caption text-muted">{a.source}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Gallery */}
      <section aria-labelledby="gallery-title" className="shell flex flex-col gap-10 py-16 md:gap-12 md:py-28">
        <SectionHeading id="gallery-title" overline="من أجوائنا" title="لحظات من سُفرة" />
        {/* Figma mosaic: 600×560 interior | 310 column (270/270) | 330 column (360/180) */}
        <div className="grid grid-cols-2 gap-4 md:h-[560px] md:grid-cols-[600fr_310fr_330fr] md:gap-5">
          <Tile src="/images/interior.png" alt="صالة الطعام" className="col-span-2 h-[280px] md:col-span-1 md:h-full" sizes="(min-width: 768px) 45vw, 100vw" />
          <div className="flex flex-col gap-4 md:gap-5">
            <Tile src="/images/breakfast.png" alt="فطور سُفرة" className="h-[180px] md:h-auto md:flex-1" />
            <Tile src="/images/arabic-coffee.png" alt="قهوة عربية" className="h-[140px] md:h-auto md:flex-1" />
          </div>
          <div className="flex flex-col gap-4 md:gap-5">
            <Tile src="/images/kunafa.png" alt="كنافة بالفستق" className="h-[180px] md:h-auto md:flex-[2]" />
            <Tile src="/images/drinks.png" alt="مشروبات منعشة" className="h-[140px] md:h-auto md:flex-1" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="shell pb-16 md:pb-28">
        <div className="flex flex-col gap-6 rounded-[32px] bg-inverse p-8 md:p-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-display text-h1 font-bold text-canvas md:text-display-m">تعال وتذوّق الحكاية بنفسك</h2>
            <p className="text-body-m text-accent-light md:text-body-l">احجز طاولتك في أقرب فرع، أو اطلب أطباقك المفضلة إلى باب بيتك.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/reservations" variant="accent" arrow>
              احجز طاولة
            </ButtonLink>
            <ButtonLink href="/menu" variant="inverse">
              تصفّح القائمة
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Tile({ src, alt, className, sizes = "(min-width: 768px) 25vw, 50vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover transition-transform duration-500 hover:scale-105" />
    </div>
  );
}
