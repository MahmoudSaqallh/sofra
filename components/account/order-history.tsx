"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ReceiptText, Star, Truck } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button, ButtonLink } from "@/components/ui/button";
import { addManyToCart } from "@/lib/notify";
import { formatPrice, getDish } from "@/lib/menu";
import { orderStages, readOrders, type OrderRecord } from "@/lib/orders";
import { pastOrders } from "@/lib/account";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/cn";

type Status = "active" | "delivered" | "cancelled";

type Row = {
  id: string;
  dateLabel: string;
  meta: string;
  status: Status;
  statusLabel: string;
  total: number;
  items: { slug: string; qty: number }[];
  /** Orders placed on this site open the live tracking page; demo history expands inline. */
  trackingHref?: string;
};

const dateFmt = new Intl.DateTimeFormat("ar-u-nu-latn-ca-gregory", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const clock = new Intl.DateTimeFormat("ar-u-nu-latn", { hour: "numeric", minute: "2-digit" });
const modeLabels = { delivery: "توصيل", pickup: "استلام", "dine-in": "في المطعم" } as const;
const PAGE = 4;
const RATINGS_KEY = "sufra-ratings-v1";

function liveStatus(order: OrderRecord, now: number) {
  if (order.cancelledAt) return { status: "cancelled" as const, label: "ملغي", stage: null };
  const { stages, end } = orderStages(order);
  if (now >= end) return { status: "delivered" as const, label: "تم التسليم", stage: null };
  const stage = stages[Math.max(0, stages.findLastIndex((s) => s.at.getTime() <= now))];
  return { status: "active" as const, label: stage.key === "on-the-way" ? "في الطريق" : stage.title, stage };
}

function readRatings(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(RATINGS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Figma "سجل الطلبات": live orders from this browser first, then the demo customer's history. Client-only (reads localStorage). */
export function OrderHistory({ includeDemo }: { includeDemo: boolean }) {
  const now = useNow();
  const [orders] = useState(readOrders);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [shown, setShown] = useState(PAGE);
  const [ratings, setRatings] = useState(readRatings);

  const live = orders.map((o) => ({ order: o, ...liveStatus(o, now) }));
  const rows: Row[] = [
    ...live.map(({ order, status, label }) => ({
      id: order.id,
      dateLabel: dateFmt.format(new Date(order.createdAt)),
      meta: `${order.destination.title} · ${modeLabels[order.mode]}`,
      status,
      statusLabel: label,
      total: order.total,
      items: order.items.map((i) => ({ slug: i.slug, qty: i.qty })),
      trackingHref: `/tracking?order=${order.id}`,
    })),
    ...(includeDemo
      ? pastOrders.map((o) => ({
          id: o.id,
          dateLabel: o.dateLabel,
          meta: `${o.branch} · ${o.modeLabel}`,
          status: o.status,
          statusLabel: o.status === "delivered" ? "تم التسليم" : "ملغي",
          total: o.total,
          items: o.items,
        }))
      : []),
  ];

  const active = live.find((l) => l.status === "active");
  const count = (s: Status) => rows.filter((r) => r.status === s).length;
  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const rateTarget = rows.find((r) => r.status === "delivered" && !ratings[r.id])?.id;

  function rate(id: string, stars: number) {
    const next = { ...ratings, [id]: stars };
    setRatings(next);
    try {
      window.localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: the rating shows for this visit only.
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {active && (
        <div className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-brand bg-brand-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <span className="flex size-[52px] shrink-0 items-center justify-center rounded-2xl bg-brand text-canvas">
              <Truck size={24} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-label-l font-medium text-brand">
                  طلب #{active.order.id} {active.stage?.key === "on-the-way" ? "في الطريق إليك" : "قيد التنفيذ"}
                </p>
                <StatusPill status="active" label={active.label} />
              </div>
              <p className="text-caption text-muted">
                الوصول المتوقع {clock.format(orderStages(active.order).end)}
                {active.stage?.key === "on-the-way" && " · السائق حسن العمري"}
              </p>
            </div>
          </div>
          <ButtonLink href={`/tracking?order=${active.order.id}`} size="md" arrow className="h-12 px-6 text-label-m">
            تتبع الطلب
          </ButtonLink>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-h2 font-bold text-brand md:text-h1">سجل الطلبات</h2>
        <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <SegmentedControl
            label="تصفية الطلبات"
            options={[
              { value: "all", label: `الكل (${rows.length})` },
              { value: "active", label: `جارية (${count("active")})` },
              { value: "delivered", label: `مكتملة (${count("delivered")})` },
              { value: "cancelled", label: `ملغاة (${count("cancelled")})` },
            ]}
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setShown(PAGE);
            }}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-line-strong px-6 py-12 text-center">
          <ReceiptText size={32} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
          <p className="text-label-l font-medium text-ink">
            {rows.length === 0 ? "لم تطلب من سُفرة بعد" : "لا توجد طلبات بهذه الحالة"}
          </p>
          {rows.length === 0 ? (
            <ButtonLink href="/order" size="md" arrow>
              اطلب الآن
            </ButtonLink>
          ) : (
            <Button variant="outline" size="md" onClick={() => setFilter("all")}>
              عرض كل الطلبات
            </Button>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-5">
          {visible.slice(0, shown).map((row) => (
            <li key={row.id}>
              <OrderCard row={row} canRate={row.id === rateTarget} rating={ratings[row.id]} onRate={(n) => rate(row.id, n)} />
            </li>
          ))}
        </ul>
      )}

      {visible.length > shown && (
        <Button variant="outline" size="md" className="self-center" onClick={() => setShown((n) => n + PAGE)}>
          عرض المزيد من الطلبات
        </Button>
      )}
    </div>
  );
}

function StatusPill({ status, label }: { status: Status; label: string }) {
  const tone =
    status === "delivered"
      ? "bg-success-subtle text-success"
      : status === "cancelled"
        ? "bg-error-subtle text-error"
        : "bg-accent-subtle text-accent-ink";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label-s font-medium whitespace-nowrap", tone)}>
      <span aria-hidden className="size-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

function OrderCard({ row, canRate, rating, onRate }: { row: Row; canRate: boolean; rating?: number; onRate: (n: number) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const dishes = row.items.flatMap((i) => {
    const dish = getDish(i.slug);
    return dish ? [{ ...i, dish }] : [];
  });
  const qty = row.items.reduce((n, i) => n + i.qty, 0);
  const detailsId = `order-${row.id}-details`;

  function reorder() {
    addManyToCart(row.items, `أُضيف طلب #${row.id} إلى السلة`);
    router.push("/cart");
  }

  return (
    <article aria-label={`طلب #${row.id}`} className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-label-l font-medium text-brand">طلب #{row.id}</h3>
            <StatusPill status={row.status} label={row.statusLabel} />
          </div>
          <p className="text-caption text-muted">
            {row.dateLabel} · {row.meta}
          </p>
        </div>
        <p className="shrink-0 text-number-l font-semibold text-ink">{formatPrice(row.total)}</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {dishes.map(({ dish }) => (
            <Image key={dish.slug} src={dish.image} alt={dish.name} width={52} height={52} className="size-[52px] rounded-xl object-cover" />
          ))}
          <span className="text-caption text-faint">{qty} {qty === 1 ? "طبق" : "أطباق"}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {row.status === "delivered" && (
            <button
              type="button"
              onClick={reorder}
              className="flex h-9 items-center gap-2 rounded-full bg-brand px-4 text-label-s font-medium text-canvas transition-colors hover:bg-inverse"
            >
              <ReceiptText size={16} strokeWidth={1.75} aria-hidden />
              إعادة الطلب
            </button>
          )}
          {row.trackingHref ? (
            <Link
              href={row.trackingHref}
              className="flex h-9 items-center rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand transition-colors hover:bg-brand hover:text-canvas"
            >
              {row.status === "active" ? "تتبع الطلب" : "التفاصيل"}
            </Link>
          ) : (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 items-center rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand transition-colors hover:bg-brand hover:text-canvas"
            >
              {open ? "إخفاء التفاصيل" : "التفاصيل"}
            </button>
          )}
          {rating ? (
            <span className="flex h-9 items-center gap-1 px-2 text-label-s font-medium text-muted">
              تقييمك
              <Star size={14} strokeWidth={1.75} aria-hidden className="fill-accent text-accent" />
              {rating}
            </span>
          ) : (
            canRate &&
            !picking && (
              <button
                type="button"
                onClick={() => setPicking(true)}
                className="flex h-9 items-center gap-2 rounded-full px-4 text-label-s font-medium text-brand hover:bg-subtle"
              >
                <Star size={16} strokeWidth={1.75} aria-hidden />
                قيّم طلبك
              </button>
            )
          )}
        </div>
      </div>

      {picking && !rating && (
        <div role="radiogroup" aria-label="قيّم طلبك من 1 إلى 5" className="flex items-center gap-1 self-end rounded-full bg-subtle px-3 py-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={false} aria-label={`${n} من 5`} onClick={() => onRate(n)} className="group p-1">
              <Star size={22} strokeWidth={1.75} aria-hidden className="text-accent transition-colors group-hover:fill-accent" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <ul id={detailsId} className="flex flex-col divide-y divide-line rounded-2xl bg-subtle px-4">
          {dishes.map(({ dish, qty: q }) => (
            <li key={dish.slug} className="flex items-center justify-between py-3 text-body-s">
              <span className="text-ink">
                {dish.name} <span className="text-muted">× {q}</span>
              </span>
              <Link href={`/menu/${dish.slug}`} className="flex items-center gap-1 text-label-s font-medium text-brand hover:underline">
                عرض الطبق
                <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
