"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Home, Pencil, Plus, ShoppingBag, Store, Tag, Trash2, Truck, Utensils } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutSteps } from "@/components/cart/checkout-steps";
import { PaymentBadges, Totals } from "@/components/cart/totals";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button, ButtonLink } from "@/components/ui/button";
import { FREE_DELIVERY_FROM, type OrderMode } from "@/lib/cart";
import { addToCart, removeLineAndNotify } from "@/lib/notify";
import { dishCountLabel, formatPrice, getDish } from "@/lib/menu";
import { demoCustomer } from "@/lib/account";
import { branches } from "@/lib/site";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

const modes: { value: OrderMode; label: string }[] = [
  { value: "delivery", label: "توصيل" },
  { value: "pickup", label: "استلام من الفرع" },
  { value: "dine-in", label: "في المطعم" },
];

const upsells = ["small-fattoush", "arabic-coffee", "chocolate-fondant"];

export function CartView() {
  const isClient = useIsClient();
  const cart = useCart();
  const [code, setCode] = useState(cart.promo ?? "");
  const [promoError, setPromoError] = useState("");

  // The cart lives in localStorage: render a neutral skeleton until the browser has read it.
  if (!isClient) return <CartSkeleton />;
  if (cart.count === 0) return <EmptyCart />;

  function applyPromo(e: FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setPromoError("اكتب رمز الخصم أولاً.");
      return;
    }
    if (cart.applyPromo(code)) setPromoError("");
    else setPromoError("هذا الرمز غير صالح. تأكد منه وحاول مرة أخرى.");
  }

  const modeInfo =
    cart.mode === "delivery"
      ? { icon: Home, title: "التوصيل إلى المنزل", line: demoCustomer.addresses[0].line }
      : cart.mode === "pickup"
        ? { icon: Store, title: "استلام من الفرع", line: branches[0].label }
        : { icon: Utensils, title: "الطلب في المطعم", line: branches[0].label };
  const ModeIcon = modeInfo.icon;
  const remaining = Math.max(0, FREE_DELIVERY_FROM - cart.subtotal);

  return (
    <div className="shell flex flex-col gap-4 pt-2 pb-6 md:gap-10 md:pt-12 md:pb-28">
      {/* Mobile top bar (390 frame replaces the site header here) */}
      <div className="flex h-16 items-center justify-between md:hidden">
        <Link href="/menu" aria-label="العودة إلى القائمة" className="flex size-10 items-center justify-center rounded-full border border-line">
          <ArrowRight size={20} strokeWidth={1.75} />
        </Link>
        <h1 className="font-display text-h3 font-semibold text-brand">السلة</h1>
        <button type="button" onClick={cart.clear} className="text-label-s font-medium text-error">
          مسح الكل
        </button>
      </div>

      <div className="hidden items-end justify-between gap-6 md:flex">
        <div className="flex flex-col items-start gap-1.5">
          <h1 className="font-display text-display-m font-bold text-brand">سلة الطلبات</h1>
          <p className="text-body-m text-muted">
            {dishCountLabel(cart.count)} · يتم التحضير في {branches[0].label.split(" — ")[0]}
          </p>
        </div>
        <CheckoutSteps current={1} />
      </div>

      <div className="flex flex-col gap-4 md:gap-10 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          {/* Mobile free-delivery progress */}
          {cart.mode === "delivery" && (
            <div className="flex flex-col gap-2 rounded-2xl bg-brand-subtle p-4 md:hidden">
              <p className="flex items-center gap-2 text-label-m font-medium text-brand">
                <Truck size={18} strokeWidth={1.75} aria-hidden />
                {remaining === 0 ? "مبروك! حصلت على توصيل مجاني" : `أضف ${formatPrice(remaining)} للحصول على توصيل مجاني`}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-300"
                  style={{ width: `${Math.min(100, (cart.subtotal / FREE_DELIVERY_FROM) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Order mode + destination (desktop) */}
          <div className="hidden flex-wrap items-center justify-between gap-4 rounded-[20px] border border-line bg-surface p-5 md:flex">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-subtle text-brand">
                <ModeIcon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <div className="flex flex-col items-start">
                <p className="text-label-m font-medium text-ink">{modeInfo.title}</p>
                <p className="text-caption text-muted">{modeInfo.line}</p>
              </div>
              <Link href="/checkout" aria-label="تعديل العنوان" className="text-accent-ink hover:text-brand">
                <Pencil size={16} strokeWidth={1.75} />
              </Link>
            </div>
            <SegmentedControl label="طريقة الاستلام" options={modes} value={cart.mode} onChange={cart.setMode} />
          </div>

          {/* Lines */}
          <ul className="flex flex-col gap-4 md:gap-0 md:overflow-hidden md:rounded-[20px] md:border md:border-line md:bg-surface">
            {cart.lines.map((line) => (
              <li
                key={line.key}
                className="flex gap-3 rounded-2xl border border-line bg-surface p-3 md:items-center md:gap-5 md:rounded-none md:border-0 md:border-t md:p-5 md:first:border-t-0"
              >
                <Link href={`/menu/${line.slug}`} tabIndex={-1} aria-hidden className="shrink-0">
                  <Image
                    src={line.dish.image}
                    alt=""
                    width={104}
                    height={104}
                    className="size-20 rounded-xl object-cover md:size-[104px] md:rounded-2xl"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1 md:gap-1.5">
                  <h2 className="text-label-l font-medium text-ink md:font-display md:text-h4 md:font-semibold">
                    <Link href={`/menu/${line.slug}`}>{line.dish.name}</Link>
                  </h2>
                  {line.label && <p className="text-caption text-muted md:text-body-s">{line.label}</p>}
                  {line.dish.sizes || line.dish.extras ? (
                    <Link href={`/menu/${line.slug}`} className="hidden text-label-s font-medium text-accent-ink md:inline">
                      تعديل الإضافات
                    </Link>
                  ) : null}
                  {/* Mobile: price + stepper under the text */}
                  <div className="flex w-full items-center justify-between pt-1 md:hidden">
                    <p className="text-price font-semibold text-brand">{formatPrice(line.total)}</p>
                    <QuantityStepper
                      size="compact"
                      value={line.qty}
                      min={0}
                      onChange={(q) => cart.setQty(line.key, q)}
                      label={`كمية ${line.dish.name}`}
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <QuantityStepper
                    size="compact"
                    value={line.qty}
                    onChange={(q) => cart.setQty(line.key, q)}
                    label={`كمية ${line.dish.name}`}
                  />
                </div>
                <p className="hidden w-[110px] text-price font-semibold text-brand md:block">{formatPrice(line.total)}</p>
                <button
                  type="button"
                  onClick={() => removeLineAndNotify(line)}
                  aria-label={`حذف ${line.dish.name} من السلة`}
                  className="hidden size-10 shrink-0 items-center justify-center rounded-full border border-line text-error transition-colors hover:border-error md:flex"
                >
                  <Trash2 size={18} strokeWidth={1.75} />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile applied promo */}
          {cart.promo && (
            <div className="flex items-center justify-between rounded-2xl border border-dashed border-accent-line bg-accent-subtle px-4 py-3 md:hidden">
              <p className="flex items-center gap-2">
                <Tag size={18} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
                <span dir="ltr" className="text-label-l font-medium text-brand">
                  {cart.promo}
                </span>
                <span className="text-caption text-muted">· {cart.discount > 0 ? cart.promoInfo?.label : cart.promoInfo?.hint}</span>
              </p>
              <button type="button" onClick={cart.clearPromo} className="text-label-s font-medium text-error">
                إزالة
              </button>
            </div>
          )}

          {/* Upsell */}
          <section aria-labelledby="upsell-title" className="hidden flex-col gap-4 md:flex">
            <h2 id="upsell-title" className="font-display text-h3 font-semibold text-brand">
              أكمل وجبتك
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {upsells.map((slug) => {
                const dish = getDish(slug)!;
                return (
                  <li key={slug} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                    <Image src={dish.image} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                      <p className="truncate text-label-m font-medium text-ink">{dish.name}</p>
                      <p className="text-label-s font-medium text-brand">{formatPrice(dish.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(dish)}
                      aria-label={`أضف ${dish.name}`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-brand transition-colors hover:bg-brand hover:text-canvas"
                    >
                      <Plus size={16} strokeWidth={1.75} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Summary */}
        <aside
          aria-label="ملخص الطلب"
          className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5 md:rounded-3xl md:p-8 md:shadow-md lg:w-[420px] lg:shrink-0"
        >
          <h2 className="hidden font-display text-h3 font-semibold text-brand md:block">ملخص الطلب</h2>
          <form onSubmit={applyPromo} className="hidden flex-col gap-2.5 md:flex" noValidate>
            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <label htmlFor="promo" className="text-label-m font-medium text-ink">
                  رمز الخصم
                </label>
                <div
                  className={cn(
                    "relative flex h-[52px] items-center rounded-xl border bg-surface focus-within:border-brand focus-within:shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]",
                    promoError ? "border-error" : "border-line-strong",
                  )}
                >
                  <Tag size={20} strokeWidth={1.75} className="pointer-events-none absolute start-4 text-muted" aria-hidden />
                  <input
                    id="promo"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setPromoError("");
                    }}
                    dir="ltr"
                    autoComplete="off"
                    aria-invalid={promoError ? true : undefined}
                    aria-describedby="promo-status"
                    className="h-full w-full rounded-xl bg-transparent ps-4 pe-[46px] text-right text-body-m text-ink uppercase outline-none"
                  />
                </div>
              </div>
              {cart.promo ? (
                <Button variant="outline" size="md" onClick={() => { cart.clearPromo(); setCode(""); }}>
                  إزالة
                </Button>
              ) : (
                <Button type="submit" variant="outline" size="md">
                  تطبيق
                </Button>
              )}
            </div>
            <p id="promo-status" aria-live="polite" className="text-caption">
              {promoError ? (
                <span className="text-error">{promoError}</span>
              ) : cart.promo && cart.discount > 0 ? (
                <span className="flex items-center gap-1.5 text-success">
                  <Check size={14} strokeWidth={2} aria-hidden />
                  تم تطبيق {cart.promoInfo?.label} على طلبك
                </span>
              ) : cart.promo ? (
                <span className="text-accent-ink">الرمز {cart.promo} صالح — {cart.promoInfo?.hint} لتفعيله.</span>
              ) : null}
            </p>
          </form>

          <Totals
            subtotal={cart.subtotal}
            delivery={cart.delivery}
            freeDelivery={cart.freeDelivery}
            showDelivery={cart.mode === "delivery"}
            discount={cart.discount}
            promo={cart.promo}
            vat={cart.vat}
            total={cart.total}
          />

          <div className="hidden md:block">
            <ButtonLink href="/checkout" variant="primary" arrow fullWidth>
              متابعة إلى الدفع
            </ButtonLink>
          </div>
          <div className="hidden md:block">
            <PaymentBadges />
          </div>
        </aside>
      </div>

      {/* Mobile sticky checkout */}
      <div aria-hidden className="h-[76px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-5 pt-4 pb-7 shadow-[0_-8px_24px_0_rgb(61_51_31/0.08)] md:hidden">
        <ButtonLink href="/checkout" variant="primary" arrow fullWidth>
          متابعة إلى الدفع
        </ButtonLink>
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div aria-hidden className="shell flex flex-col gap-6 py-6 md:py-12">
      <div className="h-14 w-56 animate-pulse rounded-xl bg-subtle" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-subtle" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-subtle lg:w-[420px]" />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="shell flex flex-col items-center gap-5 py-24 text-center md:py-32">
      <span className="flex size-20 items-center justify-center rounded-full bg-accent-subtle text-accent-ink">
        <ShoppingBag size={36} strokeWidth={1.5} aria-hidden />
      </span>
      <h1 className="font-display text-h1 font-semibold text-brand">سلتك فارغة</h1>
      <p className="max-w-sm text-body-m text-muted">أضف أطباقك المفضلة من القائمة، وسنحضّرها لك طازجة.</p>
      <ButtonLink href="/menu" variant="primary" arrow>
        تصفّح القائمة
      </ButtonLink>
      <Link href="/" className="flex items-center gap-1.5 text-label-m font-medium text-muted hover:text-brand">
        العودة إلى الرئيسية
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
      </Link>
    </div>
  );
}
