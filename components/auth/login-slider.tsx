"use client";

import Image from "next/image";
import { useState } from "react";
import { Clock, Flame, Gift, Heart, Leaf, Star, Tag, Truck, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const slides: { image: string; overline: string; title: [string, string]; text: string; perks: { icon: LucideIcon; label: string }[] }[] = [
  {
    image: "/images/interior.png",
    overline: "انضم إلى 120 ألف عضو",
    title: ["مزايا حصرية", "لأعضاء سُفرة"],
    text: "سجّل مرة واحدة واستمتع بتجربة أسرع وأذكى في كل طلب وكل زيارة.",
    perks: [
      { icon: Gift, label: "طبق مجاني كل 10 طلبات" },
      { icon: Heart, label: "احفظ أطباقك وعناوينك المفضلة" },
      { icon: Star, label: "عروض حصرية للأعضاء" },
    ],
  },
  {
    image: "/images/grill.png",
    overline: "اطلب أونلاين",
    title: ["أطباقك المفضلة", "بنقرة واحدة"],
    text: "أعد طلباتك السابقة بسهولة، واختر التوصيل أو الاستلام من أقرب فرع.",
    perks: [
      { icon: Truck, label: "تتبّع مباشر حتى باب بيتك" },
      { icon: Clock, label: "توصيل خلال 35 دقيقة" },
      { icon: Flame, label: "مشاوي على الفحم كل يوم" },
    ],
  },
  {
    image: "/images/kunafa.png",
    overline: "برنامج الولاء",
    title: ["اجمع النقاط", "واستمتع بالمكافآت"],
    text: "نقطة لكل 10 ريالات، وكل 500 نقطة تساوي 50 ر.س تستبدلها بما تحب.",
    perks: [
      { icon: Tag, label: "خصومات ومفاجآت شهرية" },
      { icon: Gift, label: "حلى مجاني في يوم ميلادك" },
      { icon: Leaf, label: "مزايا أكثر مع الفئة الذهبية" },
    ],
  },
];

const INTERVAL = 4000;

/** Figma "Login Slider": 3 slides, auto-advances every 4s, dots are clickable. Pauses on hover/focus and for reduced motion. */
export function LoginSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="مزايا العضوية"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      // Rounded only on the side facing the form (right, top + bottom); the outer left edge stays flush.
      className="relative isolate flex h-full min-h-[640px] flex-col justify-between overflow-hidden rounded-r-[50px] bg-inverse px-12 py-[72px] xl:px-20"
    >
      {slides.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt=""
          fill
          sizes="50vw"
          loading={i === 0 ? "eager" : "lazy"}
          className={cn("-z-20 object-cover transition-opacity duration-700 motion-reduce:transition-none", i === index ? "opacity-100" : "opacity-0")}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,32,25,0.45) 0%, rgba(11,32,25,0.15) 18%, rgba(11,32,25,0.55) 42%, rgba(11,32,25,0.9) 70%, rgba(11,32,25,0.97) 100%)",
        }}
      />

      <div className="flex items-center">
        <Logo size="lg" />
      </div>

      <div className="flex flex-col items-start gap-5" aria-live={paused ? "polite" : "off"}>
        <p className="text-overline font-medium text-accent-light">{slide.overline}</p>
        <h2 className="font-display text-display-m font-bold text-canvas">
          {slide.title[0]}
          <br />
          {slide.title[1]}
        </h2>
        <p className="max-w-[520px] text-body-l text-accent-light">{slide.text}</p>
        <ul className="flex flex-col gap-3">
          {slide.perks.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-label-l font-medium text-canvas">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/12">
                <Icon size={18} strokeWidth={1.75} aria-hidden />
              </span>
              {label}
            </li>
          ))}
        </ul>
        {/* Progress bars (moved here from the top; replace the old dots). The active bar fills over the slide's
            duration and advancing happens when it completes, so hover-pause keeps bar and slide in sync.
            Reduced motion: no animation → the bar shows full and slides only change on click. */}
        <div className="flex items-center gap-1.5 pt-4">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.image}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`الشريحة ${i + 1}: ${s.title.join(" ")}`}
                aria-current={active}
                className="group flex h-6 items-center"
              >
                <span
                  className={cn(
                    "relative block h-1 overflow-hidden rounded-sm transition-[width,background-color] duration-500",
                    active ? "w-[88px] bg-white/25" : "w-7 bg-white/35 group-hover:bg-white/60",
                  )}
                >
                  {active && (
                    <span
                      key={index}
                      onAnimationEnd={() => setIndex((index + 1) % slides.length)}
                      className="absolute inset-0 origin-right animate-slide-progress bg-accent"
                      style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
