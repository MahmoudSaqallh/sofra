"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { contact } from "@/lib/site";
import type { Dish } from "@/lib/menu";
import type { DishReview } from "@/lib/reviews";
import { cn } from "@/lib/cn";

type Props = { dish: Dish; reviews?: { bars: number[]; items: DishReview[] } };

export function DishTabs({ dish, reviews }: Props) {
  const id = useId();
  const reviewCount = dish.reviewCount ?? reviews?.items.length ?? 0;
  const tabs = [
    { key: "reviews", label: reviewCount ? `التقييمات (${reviewCount.toLocaleString("en-US")})` : "التقييمات" },
    { key: "ingredients", label: "المكوّنات" },
    { key: "nutrition", label: "القيمة الغذائية" },
    { key: "allergens", label: "مسببات الحساسية" },
  ] as const;
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("reviews");
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent, i: number) {
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + tabs.length) % tabs.length;
    setActive(tabs[next].key);
    refs.current[next]?.focus();
  }

  const ingredients = dish.ingredients ?? (dish.story ?? dish.description).replace(/\.$/, "").split(/،\s*/);

  return (
    <section className="flex flex-col gap-8">
      <div role="tablist" aria-label="تفاصيل الطبق" className="no-scrollbar flex gap-8 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => {
          const selected = t.key === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${id}-${t.key}-tab`}
              aria-controls={`${id}-${t.key}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "relative shrink-0 pb-3 text-label-l font-medium whitespace-nowrap transition-colors",
                selected ? "text-brand" : "text-faint hover:text-ink",
              )}
            >
              {t.label}
              <span
                aria-hidden
                className={cn("absolute inset-x-0 bottom-0 mx-auto h-[3px] w-20 max-w-full bg-brand", !selected && "hidden")}
              />
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`${id}-${active}`} aria-labelledby={`${id}-${active}-tab`} tabIndex={0}>
        {active === "reviews" && (
          <div className="flex flex-col gap-5 lg:flex-row-reverse lg:items-start lg:gap-12">
            <div className="flex flex-col items-start gap-3 rounded-[20px] border border-line bg-surface p-7 lg:w-[300px] lg:shrink-0">
              <p className="font-display text-display-l font-bold text-brand">{dish.rating.toFixed(1)}</p>
              <div className="flex items-center gap-1.5">
                <Stars value={dish.rating} />
                {reviewCount > 0 && (
                  <span className="text-caption text-faint">{reviewCount.toLocaleString("en-US")} تقييم</span>
                )}
              </div>
              {reviews && (
                <ul className="flex w-full flex-col gap-3" aria-label="توزيع التقييمات">
                  {reviews.bars.map((pct, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-2 text-label-s font-medium text-muted">{5 - i}</span>
                      <span className="relative h-2 flex-1 overflow-hidden rounded bg-track">
                        <span className="absolute inset-y-0 start-0 rounded bg-accent" style={{ width: `${pct}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-5">
              {reviews?.items.length ? (
                reviews.items.map((r) => (
                  <article key={r.name} className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar initials={r.initials} />
                        <div className="flex flex-col items-start">
                          <p className="text-label-l font-medium text-ink">{r.name}</p>
                          <p className="text-caption text-faint">{r.when}</p>
                        </div>
                      </div>
                      <Rating value={r.rating} />
                    </div>
                    <p className="text-body-m text-ink">{r.text}</p>
                  </article>
                ))
              ) : (
                <p className="rounded-[20px] border border-dashed border-line-strong p-6 text-body-m text-muted">
                  لا توجد تقييمات مكتوبة لهذا الطبق بعد.
                </p>
              )}
            </div>
          </div>
        )}

        {active === "ingredients" && (
          <ul className="flex flex-wrap gap-2.5">
            {ingredients.map((item) => (
              <li key={item} className="rounded-full border border-line bg-surface px-4 py-2 text-body-s text-ink">
                {item}
              </li>
            ))}
          </ul>
        )}

        {active === "nutrition" && (
          <p className="text-body-m text-muted">
            {dish.calories
              ? `الحصة الواحدة (${dish.serves === 1 ? "لشخص" : "الحجم الأساسي"}) تحتوي على ${dish.calories.toLocaleString("en-US")} سعرة حرارية تقريباً.`
              : "القيم الغذائية التفصيلية لهذا الطبق متاحة عند الطلب من الفرع."}
          </p>
        )}

        {active === "allergens" && (
          <p className="text-body-m text-muted">
            إذا كانت لديك حساسية غذائية، يرجى إبلاغ الفرع قبل الطلب على{" "}
            <a href={contact.phoneHref} className="font-medium text-brand underline underline-offset-4" dir="ltr">
              {contact.phone}
            </a>{" "}
            أو كتابة ملاحظة للمطبخ مع طلبك.
          </p>
        )}
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`التقييم ${value} من 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={1.75}
          aria-hidden
          className={i < Math.round(value) ? "fill-accent text-accent" : "text-line-strong"}
        />
      ))}
    </span>
  );
}
