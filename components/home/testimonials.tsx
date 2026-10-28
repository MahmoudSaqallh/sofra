"use client";

import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { testimonials } from "@/lib/testimonials";
import { cn } from "@/lib/cn";

/** Desktop: 3-column grid. Mobile/tablet: swipeable carousel with dots (390 frame). */
export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const step = slide.offsetWidth + 16;
    // RTL scrollLeft is 0 at the start and grows negative.
    setActive(Math.min(testimonials.length - 1, Math.round(Math.abs(track.scrollLeft) / step)));
  }

  function goTo(index: number) {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <section aria-labelledby="testimonials-title" className="shell flex flex-col gap-3 py-10 md:gap-12 md:py-28">
      <SectionHeading id="testimonials-title" overline="آراء ضيوفنا" title="ضيوف يعودون دائماً" />

      <ul
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0"
      >
        {testimonials.map((t) => (
          <li
            key={t.id}
            className="flex w-full shrink-0 snap-start flex-col items-start gap-4 rounded-3xl border border-line bg-surface p-6 md:w-[420px] lg:w-auto lg:gap-5 lg:p-8"
          >
            <span aria-hidden className="hidden font-display text-[64px] leading-[44px] font-bold text-accent-light lg:block">
              ”
            </span>
            <Rating value={t.rating} />
            <blockquote className="text-body-m text-ink">{t.quote}</blockquote>
            <div className="mt-auto flex items-center gap-3">
              <Avatar initials={t.initials} />
              <div className="flex flex-col items-start">
                <p className="text-label-l font-medium text-ink">{t.name}</p>
                <p className="text-caption text-muted">{t.context}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-2 pt-2 lg:hidden">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`عرض رأي ${t.name}`}
            aria-current={i === active ? "true" : undefined}
            className="flex h-6 items-center justify-center px-0.5"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-brand" : "w-2 bg-line-strong",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
