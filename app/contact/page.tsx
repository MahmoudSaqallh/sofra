import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Gift, Globe, Mail, MapPin, Phone, Store } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Faq } from "@/components/contact/faq";
import { NewsletterForm } from "@/components/contact/newsletter-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "استفسار، اقتراح، طلب ضيافة لمناسبتك، أو حتى كلمة شكر — فريقنا جاهز للرد خلال ساعتين في أوقات العمل.",
};

const channels = [
  { icon: Phone, label: "اتصل بنا", value: "920012345", note: "يومياً 9 ص – 12 م", cta: "اتصل الآن", href: "tel:920012345", ltr: true },
  { icon: Mail, label: "راسلنا", value: "hello@sufra.sa", note: "نرد خلال ساعتين", cta: "أرسل بريداً", href: "mailto:hello@sufra.sa", ltr: true },
  { icon: Gift, label: "الضيافة والمناسبات", value: "events@sufra.sa", note: "للشركات والمناسبات الكبيرة", cta: "اطلب عرض سعر", href: "/catering", ltr: true },
  { icon: MapPin, label: "زورونا", value: "12 فرعاً", note: "الرياض · جدة · الدمام", cta: "أقرب فرع", href: "/branches", ltr: false },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumb="تواصل معنا"
        title="يسعدنا سماعك"
        lead="استفسار، اقتراح، طلب ضيافة لمناسبتك، أو حتى كلمة شكر — فريقنا جاهز للرد خلال ساعتين في أوقات العمل."
        image="/images/arabic-coffee.png"
        imageAlt="دلة قهوة عربية تُسكب في فنجان"
      />

      {/* Channels */}
      <section aria-label="قنوات التواصل" className="shell pt-10 md:pt-16">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {channels.map((c) => (
            <li key={c.label}>
              <Link
                href={c.href}
                className="group flex h-full flex-col items-start gap-3.5 rounded-3xl border border-line bg-surface p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
                  <c.icon size={24} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-label-m font-medium text-muted">{c.label}</span>
                <span className="font-display text-h3 font-semibold text-brand" dir={c.ltr ? "ltr" : undefined}>
                  {c.value}
                </span>
                <span className="text-caption text-faint">{c.note}</span>
                <span className="mt-auto flex items-center gap-1.5 pt-1.5 text-label-m font-medium text-accent-ink">
                  {c.cta}
                  <ArrowLeft size={16} strokeWidth={1.75} aria-hidden className="transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Form + HQ */}
      <section aria-labelledby="form-title" className="shell flex flex-col gap-8 pt-10 pb-16 md:pt-16 md:pb-24 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-6 rounded-[28px] border border-line bg-surface p-6 md:p-12">
          <SectionHeading id="form-title" overline="نموذج التواصل" title="أرسل لنا رسالة" description="املأ النموذج وسيتواصل معك الفريق المختص." />
          <ContactForm />
        </div>

        <aside aria-label="المقر الرئيسي" className="flex flex-col gap-6 lg:w-[448px] lg:shrink-0">
          <div aria-hidden className="relative h-[280px] overflow-hidden rounded-3xl bg-track">
            <div className="absolute inset-3 grid grid-cols-5 grid-rows-4 gap-3">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className={cn("rounded-lg", [0, 7, 10, 13, 19].includes(i) ? "bg-brand-subtle" : "bg-subtle")} />
              ))}
            </div>
            <div className="absolute inset-x-0 top-[46%] h-3.5 bg-surface" />
            <div className="absolute inset-y-0 left-[58%] w-3.5 bg-surface" />
            <span className="absolute top-[46%] left-[58%] flex size-[52px] -translate-x-1/2 -translate-y-1/3 items-center justify-center rounded-full border-2 border-accent-line bg-brand text-canvas shadow-lg">
              <Store size={22} strokeWidth={1.75} />
            </span>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl bg-inverse p-7 text-canvas">
            <p className="text-overline font-medium text-accent-light">المقر الرئيسي</p>
            <p className="font-display text-h3 font-semibold">مطاعم سُفرة</p>
            <p className="flex items-center gap-2.5 text-body-s">
              <MapPin size={18} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              طريق العليا، حي العليا، الرياض 12214
            </p>
            <p className="flex items-center gap-2.5 text-body-s">
              <Clock size={18} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              الأحد – الخميس · 9:00 ص – 5:00 م
            </p>
            <a href="tel:0112345678" className="flex items-center gap-2.5 text-body-s hover:text-accent-light">
              <Phone size={18} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              <span dir="ltr">0112345678</span>
            </a>
            <a href="mailto:info@sufra.sa" className="flex items-center gap-2.5 text-body-s hover:text-accent-light">
              <Mail size={18} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              info@sufra.sa
            </a>
            <hr className="border-0 border-t border-white/12" />
            <div className="flex items-center justify-between">
              <p className="text-label-m font-medium">تابعنا</p>
              <div className="flex gap-2.5">
                {[
                  { href: "tel:920012345", label: "اتصال", icon: <Phone size={18} strokeWidth={1.75} /> },
                  { href: "mailto:hello@sufra.sa", label: "البريد", icon: <Mail size={18} strokeWidth={1.75} /> },
                  { href: "/", label: "الموقع", icon: <Globe size={18} strokeWidth={1.75} /> },
                ].map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} className="flex size-11 items-center justify-center rounded-full border border-accent-line text-accent-light hover:bg-white/8">
                    {s.icon}
                  </a>
                ))}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className="flex size-11 items-center justify-center rounded-full border border-accent-line hover:bg-white/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/instagram.svg" alt="" width={16.3125} height={16.3125} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[20px] bg-success-subtle p-5 text-success">
            <span aria-hidden className="size-2.5 rounded-full bg-success" />
            <div className="flex flex-col items-start">
              <p className="text-label-m font-medium">متوسط وقت الرد: 47 دقيقة</p>
              <p className="text-caption">خدمة العملاء متاحة يومياً 9 ص – 12 م</p>
            </div>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-subtle">
        <div className="shell flex flex-col gap-8 py-16 md:py-28 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex flex-col items-start gap-5 lg:w-[380px] lg:shrink-0">
            <SectionHeading id="faq-title" overline="الأسئلة الشائعة" title="قبل أن تراسلنا" description="ربما تجد إجابتك هنا." />
          </div>
          <div className="flex-1">
            <Faq />
          </div>
        </div>
      </section>

      {/* Extras */}
      <section aria-label="المزيد" className="shell grid grid-cols-1 gap-6 py-16 md:py-28 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-3.5 rounded-[28px] border border-accent-line bg-accent-subtle p-7 md:p-9">
          <h2 className="font-display text-h2 font-semibold text-brand">النشرة البريدية</h2>
          <p className="max-w-[440px] text-body-m text-muted">عروض حصرية وأطباق موسمية جديدة، مرة واحدة كل أسبوعين.</p>
          <div className="w-full max-w-[540px]">
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col-reverse items-start gap-6 rounded-[28px] bg-inverse p-7 sm:flex-row sm:items-center sm:justify-between md:p-9">
          <div className="flex flex-col items-start gap-2.5">
            <h2 className="font-display text-h2 font-semibold text-canvas">انضم إلى فريقنا</h2>
            <p className="max-w-[320px] text-body-m text-accent-light">نبحث دائماً عن طهاة ومضيفين شغوفين بالضيافة.</p>
            <ButtonLink href="mailto:careers@sufra.sa" variant="accent" size="md" arrow>
              الوظائف المتاحة
            </ButtonLink>
          </div>
          <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-[20px] sm:w-[220px]">
            <Image src="/images/chef.png" alt="طاهٍ في مطبخ سُفرة" fill sizes="220px" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
