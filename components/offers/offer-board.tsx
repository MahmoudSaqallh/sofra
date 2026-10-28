"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, Gift, Store, Tag, Truck, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyCode } from "@/components/home/copy-code";
import { getDish } from "@/lib/menu";
import { addToCart, applyPromoAndNotify } from "@/lib/notify";
import { cn } from "@/lib/cn";
import { offers, type Offer, type OfferChannel } from "@/lib/offers";
import { useNow } from "@/lib/use-now";

type Filter = "all" | OfferChannel;

const filters: { id: Filter; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "جميع العروض", icon: Tag },
  { id: "delivery", label: "التوصيل", icon: Truck },
  { id: "dine-in", label: "في المطعم", icon: Store },
  { id: "members", label: "للأعضاء", icon: Gift },
  { id: "family", label: "العائلية", icon: Users },
];

const FEATURED_CHANNELS: OfferChannel[] = ["family", "delivery", "dine-in"];

function offersLabel(n: number) {
  if (n === 1) return "عرض واحد متاح الآن";
  if (n === 2) return "عرضان متاحان الآن";
  return n <= 10 ? `${n} عروض متاحة الآن` : `${n} عرضاً متاحاً الآن`;
}

export function OfferBoard() {
  const [filter, setFilter] = useState<Filter>("all");
  const showFeatured = filter === "all" || FEATURED_CHANNELS.includes(filter);
  const visible = filter === "all" ? offers : offers.filter((o) => o.channels.includes(filter));
  const count = visible.length + (showFeatured ? 1 : 0);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-display text-h3 font-bold text-brand md:text-h2" aria-live="polite">
          {offersLabel(count)}
        </h2>
        <div role="group" aria-label="تصفية العروض" className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:px-0">
          {filters.map(({ id, label, icon: Icon }) => {
            const selected = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium whitespace-nowrap transition-colors duration-200",
                  selected
                    ? "bg-brand text-canvas"
                    : "border border-line bg-surface text-ink hover:border-brand hover:text-brand",
                )}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {showFeatured && <FeaturedOffer />}

      {visible.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((offer) => (
            <li key={offer.id} className="flex">
              <OfferCard offer={offer} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Featured: "خصم 20٪ على سُفر المشاوي العائلية" — valid Thursday to Saturday.
 * ------------------------------------------------------------------------ */

const DAY = 86_400_000;
const RIYADH_OFFSET = 3 * 3_600_000;

/** Thu–Sat: time left until the offer ends (end of Saturday). Otherwise: time until it starts on Thursday. */
function featuredWindow(now: number) {
  const local = new Date(now + RIYADH_OFFSET);
  const day = local.getUTCDay();
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - RIYADH_OFFSET;
  const live = day >= 4;
  const target = midnight + (live ? 7 - day : (4 - day + 7) % 7) * DAY;
  const left = Math.max(0, target - now);
  return {
    live,
    parts: [
      { value: Math.floor(left / DAY), label: "يوم" },
      { value: Math.floor((left % DAY) / 3_600_000), label: "ساعة" },
      { value: Math.floor((left % 3_600_000) / 60_000), label: "دقيقة" },
    ],
  };
}

function FeaturedOffer() {
  const router = useRouter();
  const now = useNow();
  const win = now ? featuredWindow(now) : null;

  function orderNow() {
    const platter = getDish("family-grill-platter");
    if (platter) addToCart(platter);
    applyPromoAndNotify("SUFRA20");
    router.push("/cart");
  }

  return (
    <article
      aria-labelledby="featured-offer-title"
      className="flex flex-col overflow-hidden rounded-[28px] bg-inverse text-canvas lg:min-h-[460px] lg:flex-row"
    >
      <div className="flex flex-1 flex-col items-start justify-center gap-5 p-6 md:p-10 lg:p-14">
        <Badge label={win && !win.live ? "العرض الأبرز · يبدأ الخميس" : "العرض الأبرز · ينتهي قريباً"} tone="gold" />
        <h3 id="featured-offer-title" className="font-display text-h1 font-bold text-canvas md:text-display-m">
          خصم 20٪ على سُفر المشاوي العائلية
        </h3>
        <p className="max-w-[520px] text-body-m opacity-90 md:text-body-l">
          سُفرة تكفي 4–6 أشخاص مع المقبلات والمشروبات. صالح الخميس إلى السبت للتوصيل والاستلام وفي المطعم.
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-label-s text-accent-light">{win && !win.live ? "يبدأ العرض خلال" : "ينتهي العرض خلال"}</p>
          <dl className="flex gap-2.5" aria-live="off">
            {(win?.parts ?? [
              { value: null, label: "يوم" },
              { value: null, label: "ساعة" },
              { value: null, label: "دقيقة" },
            ]).map((p) => (
              <div key={p.label} className="flex w-[72px] flex-col-reverse items-center gap-0.5 rounded-xl bg-white/8 py-2.5">
                <dt className="text-caption opacity-80">{p.label}</dt>
                <dd className="text-number-l font-semibold text-accent-light tabular-nums">
                  {p.value === null ? "–" : String(p.value).padStart(2, "0")}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button variant="accent" size="md" arrow onClick={orderNow}>
            اطلب السُفرة الآن
          </Button>
          <CopyCode code="SUFRA20" className="inline-flex" />
        </div>
      </div>

      <div className="relative h-[240px] md:h-[320px] lg:h-auto lg:w-[640px] lg:shrink-0">
        <Image
          src="/images/grill.png"
          alt="سُفرة مشاوي عائلية على الفحم"
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover"
        />
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
 * Grid card
 * ------------------------------------------------------------------------ */

function OfferCard({ offer }: { offer: Offer }) {
  const router = useRouter();
  const { action } = offer;

  function apply() {
    if (offer.code) applyPromoAndNotify(offer.code);
    router.push("/order");
  }

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface">
      <div className="relative h-[200px]">
        <Image src={offer.image} alt="" fill sizes="(min-width: 1024px) 405px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        <Badge label={offer.badge.label} tone={offer.badge.tone} className="absolute start-4 top-4" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="text-h4 font-semibold text-brand">{offer.title}</h3>
        <p className="text-body-s text-muted">{offer.text}</p>
        <p className="flex items-center gap-1.5 text-caption text-muted">
          <Clock size={14} strokeWidth={1.75} aria-hidden />
          {offer.when}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {action.kind === "apply" ? (
            <button
              type="button"
              onClick={apply}
              className="h-9 shrink-0 rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand transition-colors hover:bg-brand hover:text-canvas"
            >
              {action.label}
            </button>
          ) : (
            <Link
              href={action.href}
              className="inline-flex h-9 shrink-0 items-center rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand transition-colors hover:bg-brand hover:text-canvas"
            >
              {action.label}
            </Link>
          )}
          {offer.code && (
            <span className="flex min-w-0 items-center gap-1.5 rounded-lg bg-subtle px-3 py-1.5">
              <Tag size={14} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
              <span className="sr-only">الرمز</span>
              <span dir="ltr" className="truncate text-label-s font-medium text-ink">
                {offer.code}
              </span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
