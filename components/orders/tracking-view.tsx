"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Check, Download, Home, Mail, Phone, Receipt, Share2, Star, Store, Truck, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { demoCustomer } from "@/lib/account";
import { sessionStore } from "@/lib/session";
import { addManyToCart } from "@/lib/notify";
import { branches, contact } from "@/lib/site";
import { dishCountLabel, formatPrice } from "@/lib/menu";
import { findOrder, orderStages, readOrders, updateOrder, type OrderRecord } from "@/lib/orders";
import { useIsClient } from "@/lib/use-is-client";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/cn";

const clock = new Intl.DateTimeFormat("ar-u-nu-latn", { hour: "numeric", minute: "2-digit" });

const driver = { name: "حسن العمري", initials: "حع", rating: 4.9, vehicle: "دراجة نارية", plate: "ر أ ب 4821", distance: "2.1 كم" };

export function TrackingView() {
  const isClient = useIsClient();
  const params = useSearchParams();
  const id = params.get("order");
  const [version, setVersion] = useState(0);
  const order = useMemo(
    () => (isClient ? (id ? findOrder(id) : readOrders()[0]) : undefined),
    // `version` re-reads storage after a cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isClient, id, version],
  );

  if (!isClient) return <TrackingSkeleton />;
  if (!order) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-accent-subtle text-accent-ink">
          <Receipt size={34} strokeWidth={1.5} aria-hidden />
        </span>
        <h1 className="font-display text-h1 font-semibold text-brand">{id ? "لم نعثر على هذا الطلب" : "لا يوجد طلب لتتبّعه"}</h1>
        <p className="max-w-sm text-body-m text-muted">
          {id ? `تأكد من رقم الطلب ${id}، أو تواصل معنا لمساعدتك.` : "عندما تطلب من سُفرة ستتمكن من متابعة طلبك هنا لحظة بلحظة."}
        </p>
        <ButtonLink href="/menu" variant="primary" arrow>
          اطلب الآن
        </ButtonLink>
      </div>
    );
  }
  return <Tracking order={order} onChange={() => setVersion((v) => v + 1)} />;
}

function Tracking({ order, onChange }: { order: OrderRecord; onChange: () => void }) {
  const router = useRouter();
  const now = useNow();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [shared, setShared] = useState(false);
  const { stages, start, end } = orderStages(order);
  const cancelled = Boolean(order.cancelledAt);
  const currentIndex = cancelled ? 0 : Math.max(0, stages.findLastIndex((s) => s.at.getTime() <= now));
  const current = stages[currentIndex];
  const done = !cancelled && current.key === "delivered";
  const remaining = Math.max(0, Math.ceil((end - now) / 60_000));
  const progress = Math.min(100, Math.max(4, ((now - start) / (end - start)) * 100));
  const delivery = order.mode === "delivery";
  const onTheWay = current.key === "on-the-way";
  const canCancel = !cancelled && currentIndex < stages.findIndex((s) => s.key === (delivery ? "on-the-way" : "ready"));
  const items = order.items.reduce((n, i) => n + i.qty, 0);
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getServerSnapshot);
  const firstName = session?.name?.trim().split(/\s+/)[0] ?? demoCustomer.firstName;

  const statusPill = cancelled
    ? { label: "ملغي", cls: "bg-error-subtle text-error" }
    : done
      ? { label: "مكتمل", cls: "bg-success-subtle text-success" }
      : { label: onTheWay ? "في الطريق" : current.title, cls: "bg-accent-subtle text-accent-ink" };

  function reorder() {
    addManyToCart(order.items, `أُضيف طلب #${order.id} إلى السلة`);
    router.push("/cart");
  }

  function cancel() {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    updateOrder(order.id, { cancelledAt: new Date().toISOString() });
    setConfirmCancel(false);
    onChange();
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `تتبّع طلب سُفرة ${order.id}`, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // User dismissed the share sheet.
    }
  }

  const etaCard = (
    <div className="flex flex-col gap-4 rounded-3xl bg-inverse p-5 md:p-7">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col items-start">
          <p className="text-label-m font-medium text-accent-light">
            {cancelled ? "تم إلغاء الطلب" : done ? (delivery ? "وصل طلبك" : "اكتمل طلبك") : delivery ? "الوصول المتوقع" : "جاهز للاستلام"}
          </p>
          <p className="font-display text-[44px] leading-[1.5] font-bold text-canvas md:text-display-l">
            {clock.format(cancelled ? new Date(order.cancelledAt!) : new Date(end))}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-label-s font-medium", statusPill.cls)}>
            <span aria-hidden className="size-2 rounded-full bg-current" />
            {statusPill.label}
          </span>
          {!cancelled && !done && (
            <p className="hidden text-label-l font-medium text-accent-light md:block">خلال {remaining} دقيقة</p>
          )}
        </div>
      </div>
      {!cancelled && (
        <div className="hidden h-2 overflow-hidden rounded bg-white/12 md:block">
          <div className="h-full rounded bg-accent transition-[width] duration-700" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Confirmation banner */}
      <section className="bg-brand-subtle">
        <div className="shell flex flex-col items-center gap-4 py-8 text-center md:flex-row md:justify-between md:py-10 md:text-start">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-5">
            <span className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-brand text-canvas shadow-md">
              {cancelled ? <X size={36} strokeWidth={1.75} /> : <Check size={36} strokeWidth={1.75} />}
            </span>
            <div className="flex flex-col items-center gap-1 md:items-start">
              <h1 className="font-display text-display-m font-bold text-brand">
                {cancelled ? "تم إلغاء طلبك" : (
                  <>
                    <span className="hidden md:inline">شكراً {firstName}، </span>تم تأكيد طلبك!
                  </>
                )}
              </h1>
              <p className="text-body-m text-muted">
                طلب رقم #{order.id} · {order.payment === "الدفع عند الاستلام" ? "الدفع عند الاستلام" : `مدفوع عبر ${order.payment}`}
                <span className="hidden md:inline"> · أرسلنا الإيصال إلى بريدك</span>
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2.5 md:flex print:hidden">
            <Button variant="outline" size="md" onClick={() => window.print()}>
              <Download size={18} strokeWidth={1.75} aria-hidden />
              تحميل الفاتورة
            </Button>
            <button
              type="button"
              onClick={share}
              className="flex h-12 items-center gap-2 rounded-full px-6 text-label-m font-medium text-brand hover:bg-surface"
            >
              <Share2 size={18} strokeWidth={1.75} aria-hidden />
              {shared ? "تم نسخ الرابط" : "مشاركة التتبع"}
            </button>
          </div>
        </div>
      </section>

      <div className="shell flex flex-col gap-5 pb-10 md:pt-10 md:pb-24 lg:flex-row-reverse lg:items-start lg:gap-8">
        {/* Map + details */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <TrackingMap delivery={delivery} onTheWay={onTheWay && !cancelled} progress={progress} />

          <div className="lg:hidden">{etaCard}</div>

          <section aria-labelledby="order-details" className="hidden flex-col gap-3.5 rounded-3xl border border-line bg-surface p-7 md:flex">
            <div className="flex items-center justify-between">
              <h2 id="order-details" className="font-display text-h4 font-semibold text-brand">
                تفاصيل الطلب
              </h2>
              <p className="text-caption text-faint">{dishCountLabel(items)}</p>
            </div>
            <ul className="flex flex-col gap-3.5">
              {order.items.map((i) => (
                <li key={i.slug + i.label} className="flex items-center gap-3">
                  <span className="text-label-m font-medium text-accent-ink">{i.qty}×</span>
                  <Image src={i.image} alt="" width={44} height={44} className="size-11 rounded-[10px] object-cover" />
                  <p className="flex-1 text-label-m font-medium text-ink">
                    {i.name}
                    {i.label && <span className="text-muted"> · {i.label}</span>}
                  </p>
                  <p className="text-label-m font-medium text-ink">{formatPrice(i.total)}</p>
                </li>
              ))}
            </ul>
            <div className="h-px bg-track" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start gap-0.5">
                <p className="text-caption text-muted">{delivery ? "التوصيل إلى" : order.destination.title}</p>
                <p className="text-label-m font-medium text-ink">{order.destination.line}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-caption text-muted">الإجمالي المدفوع</p>
                <p className="text-number-l font-semibold text-brand">{formatPrice(order.total)}</p>
              </div>
            </div>
          </section>

          <div className="hidden gap-3 md:grid md:grid-cols-3 print:hidden">
            <ActionCard icon={Receipt} title="إعادة الطلب" detail="اطلبه مجدداً بنقرة" onClick={reorder} />
            <ActionCard
              icon={X}
              title={confirmCancel ? "تأكيد الإلغاء؟" : "إلغاء الطلب"}
              detail={
                cancelled
                  ? "تم إلغاء هذا الطلب"
                  : canCancel
                    ? confirmCancel
                      ? "اضغط مرة أخرى للتأكيد"
                      : "متاح قبل خروج الطلب"
                    : "غير متاح بعد بدء التوصيل"
              }
              onClick={cancel}
              disabled={!canCancel}
              danger={confirmCancel}
            />
            <ActionCard icon={Phone} title="تحتاج مساعدة؟" detail="تواصل مع خدمة العملاء" href={contact.phoneHref} />
          </div>
        </div>

        {/* Status column */}
        <div className="flex flex-col gap-5 lg:w-[520px] lg:shrink-0">
          <div className="hidden lg:block">{etaCard}</div>

          <section aria-labelledby="status-title" className="rounded-3xl border border-line bg-surface p-5 md:p-7">
            <h2 id="status-title" className="hidden font-display text-h4 font-semibold text-brand md:block">
              حالة الطلب
            </h2>
            <ol className="flex flex-col">
              {stages.map((s, i) => {
                const reached = !cancelled && i <= currentIndex;
                const active = !cancelled && i === currentIndex && !done;
                const Icon = s.key === "on-the-way" ? Truck : s.key === "delivered" ? Home : Check;
                const hideOnMobile = s.key === "ready" && delivery;
                return (
                  <li key={s.key} className={cn("flex items-start gap-4 pt-4 first:pt-0 md:pt-4", hideOnMobile && "max-md:hidden")}>
                    <div className="flex w-10 shrink-0 flex-col items-center">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full md:size-10",
                          active ? "bg-accent text-canvas" : reached ? "bg-brand text-canvas" : "bg-subtle text-faint",
                        )}
                      >
                        <Icon size={18} strokeWidth={1.75} aria-hidden />
                      </span>
                      {i < stages.length - 1 && (
                        <span aria-hidden className={cn("h-4 w-0.5 md:h-[30px]", reached && !active ? "bg-brand" : "bg-track")} />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col items-start gap-0.5 pt-1.5 md:pt-0">
                      <p className={cn("text-label-l font-medium", reached ? "text-ink" : "text-faint")}>{s.title}</p>
                      <p className="hidden text-caption text-muted md:block">
                        {s.key === "received"
                          ? `${delivery ? branches[0].label.split(" — ")[0] : order.destination.line.split(" — ")[0]} وافق على طلبك`
                          : s.detail}
                      </p>
                    </div>
                    <p className={cn("pt-1.5 text-label-s font-medium md:pt-0", active ? "text-accent-ink" : "text-faint")}>
                      {reached ? clock.format(s.at) : "—"}
                    </p>
                  </li>
                );
              })}
              {cancelled && (
                <li className="pt-4 text-body-s text-error">أُلغي الطلب الساعة {clock.format(new Date(order.cancelledAt!))}.</li>
              )}
            </ol>
          </section>

          {delivery && !cancelled && (
            <section aria-label="السائق" className="flex items-center gap-3.5 rounded-3xl border border-line bg-surface p-5">
              <Avatar initials={driver.initials} size="lg" />
              <div className="flex flex-1 flex-col items-start gap-0.5">
                <p className="text-label-l font-medium text-ink">
                  <span className="hidden md:inline">سائقك: </span>
                  {driver.name}
                </p>
                <p className="flex items-center gap-1 text-caption text-muted">
                  <Star size={12} strokeWidth={1.75} className="fill-accent text-accent" aria-hidden />
                  {driver.rating} · <span className="hidden md:inline">{driver.vehicle} · </span>
                  {driver.plate}
                </p>
              </div>
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(`طلب ${order.id}`)}`}
                aria-label="مراسلة خدمة العملاء"
                className="hidden size-12 items-center justify-center rounded-full bg-brand-subtle text-brand md:flex"
              >
                <Mail size={20} strokeWidth={1.75} />
              </a>
              <a href={contact.phoneHref} aria-label="الاتصال بالسائق" className="flex size-12 items-center justify-center rounded-full bg-brand text-canvas">
                <Phone size={20} strokeWidth={1.75} />
              </a>
            </section>
          )}

          {/* Mobile summary + help */}
          <div className="flex items-center gap-3 rounded-2xl bg-subtle p-3 md:hidden">
            <Image src={order.items[0].image} alt="" width={44} height={44} className="size-11 rounded-[10px] object-cover" />
            <div className="flex flex-col items-start">
              <p className="text-label-m font-medium text-ink">
                {dishCountLabel(items)} · {formatPrice(order.total)}
              </p>
              <p className="text-caption text-muted">{order.destination.line}</p>
            </div>
          </div>
          <a
            href={contact.phoneHref}
            className="flex h-14 items-center justify-center rounded-full border-[1.5px] border-brand text-label-l font-medium text-brand md:hidden"
          >
            تحتاج مساعدة؟ تواصل معنا
          </a>
          <Link href="/menu" className="text-center text-label-m font-medium text-accent-ink md:hidden">
            العودة إلى القائمة
          </Link>
        </div>
      </div>
    </>
  );
}

function ActionCard({
  icon: Icon,
  title,
  detail,
  onClick,
  href,
  disabled,
  danger,
}: {
  icon: typeof Phone;
  title: string;
  detail: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  const cls = cn(
    "flex items-center gap-3 rounded-[18px] border bg-surface p-4 text-start transition-colors",
    disabled ? "cursor-not-allowed border-line" : danger ? "border-error" : "border-line hover:border-brand",
  );
  const body = (
    <>
      <Icon size={20} strokeWidth={1.75} className={disabled ? "text-faint" : danger ? "text-error" : "text-brand"} aria-hidden />
      <span className="flex flex-col items-start">
        <span className={cn("text-label-m font-medium", disabled ? "text-faint" : danger ? "text-error" : "text-brand")}>{title}</span>
        <span className="text-caption text-faint">{detail}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {body}
    </button>
  );
}

// Stylised live map from Figma: street blocks, route line, home / rider / branch pins.
function TrackingMap({ delivery, onTheWay, progress }: { delivery: boolean; onTheWay: boolean; progress: number }) {
  // Rider position along the route: branch (bottom) → corner → home (top-start).
  const t = onTheWay ? Math.min(1, Math.max(0, (progress - 71) / 29)) : 0;
  const riderTop = 86 - t * 52; // % from top
  const riderLeft = 76 - t * 36; // % from left
  return (
    <div aria-label="خريطة التوصيل" role="img" className="relative -mx-5 h-[240px] overflow-hidden bg-track md:mx-0 md:h-[460px] md:rounded-3xl">
      <div className="absolute inset-3.5 grid grid-cols-8 gap-3.5">
        {Array.from({ length: 48 }, (_, i) => (
          <div key={i} className={cn("rounded-lg", [10, 13, 21, 28, 35, 41].includes(i) ? "bg-brand-subtle" : "bg-subtle")} />
        ))}
      </div>
      <div className="absolute inset-x-0 top-[36%] h-3.5 bg-surface" />
      <div className="absolute inset-x-0 top-[70%] h-3.5 bg-surface" />
      <div className="absolute inset-y-0 left-[39%] w-3.5 bg-surface" />
      <div className="absolute inset-y-0 left-[77%] w-3.5 bg-surface" />
      {delivery && (
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points="40,19 40,37.5 78,37.5 78,91" fill="none" stroke="var(--color-brand)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 4 }} />
          <polyline points="66,37.5 78,37.5 78,91" fill="none" stroke="var(--color-accent)" style={{ strokeWidth: 4 }} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <Pin className="top-[14%] left-[40%] bg-brand text-canvas" icon={Home} />
      <Pin className="top-[86%] left-[78%] bg-surface text-brand" icon={Store} />
      {delivery && onTheWay && (
        <span
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 transition-all duration-1000"
          style={{ top: `${riderTop}%`, left: `${riderLeft}%` }}
        >
          <span className="hidden rounded-xl bg-inverse px-3 py-2 text-label-s font-medium whitespace-nowrap text-canvas md:block">
            {driver.name.split(" ")[0]} · {driver.distance}
          </span>
          <span className="flex size-12 items-center justify-center rounded-full border-[3px] border-white bg-accent text-canvas shadow-lg md:size-14">
            <Truck size={24} strokeWidth={1.75} />
          </span>
        </span>
      )}
    </div>
  );
}

function Pin({ className, icon: Icon }: { className: string; icon: typeof Home }) {
  return (
    <span
      className={cn(
        "absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white shadow-lg md:size-12",
        className,
      )}
    >
      <Icon size={22} strokeWidth={1.75} />
    </span>
  );
}

export function TrackingSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[180px] animate-pulse bg-brand-subtle" />
      <div className="shell flex flex-col gap-5 py-10 lg:flex-row-reverse">
        <div className="h-[460px] flex-1 animate-pulse rounded-3xl bg-subtle" />
        <div className="flex flex-col gap-5 lg:w-[520px]">
          <div className="h-40 animate-pulse rounded-3xl bg-inverse/80" />
          <div className="h-80 animate-pulse rounded-3xl bg-subtle" />
        </div>
      </div>
    </div>
  );
}
