"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Gift,
  Home,
  MapPin,
  Phone,
  Store,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutSteps } from "@/components/cart/checkout-steps";
import { CartSkeleton } from "@/components/cart/cart-view";
import { PaymentBadges, Totals } from "@/components/cart/totals";
import { RadioCard } from "@/components/ui/radio-card";
import { SelectField, TextField } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { demoCustomer, POINTS_REDEEM } from "@/lib/account";
import { branches } from "@/lib/site";
import { formatPrice } from "@/lib/menu";
import { newOrderId, saveOrder, type OrderRecord } from "@/lib/orders";
import { timeOptions, upcomingDates } from "@/lib/schedule";
import { useIsClient } from "@/lib/use-is-client";

type Payment = "card" | "apple-pay" | "stc-pay" | "cash";
const paymentLabels: Record<Payment, string> = {
  card: "بطاقة مدى / ائتمانية",
  "apple-pay": "Apple Pay",
  "stc-pay": "STC Pay",
  cash: "الدفع عند الاستلام",
};

type CardErrors = Partial<Record<"holder" | "number" | "expiry" | "cvv", string>>;

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function validateCard(card: { holder: string; number: string; expiry: string; cvv: string }): CardErrors {
  const errors: CardErrors = {};
  if (card.holder.trim().length < 3) errors.holder = "اكتب الاسم كما يظهر على البطاقة.";
  const digits = card.number.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19 || !luhn(digits)) errors.number = "تأكد من رقم البطاقة.";
  const m = card.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) errors.expiry = "استخدم الصيغة MM/YY.";
  else {
    const now = new Date();
    const end = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    if (end <= now) errors.expiry = "انتهت صلاحية هذه البطاقة.";
  }
  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = "3 أو 4 أرقام خلف البطاقة.";
  return errors;
}

export function CheckoutView() {
  const isClient = useIsClient();
  const router = useRouter();
  const cart = useCart();
  const dates = useMemo(() => (isClient ? upcomingDates(7) : []), [isClient]);

  const { addressId, setAddress: setAddressId, branchId, setBranch: setBranchId } = cart;
  const [instructions, setInstructions] = useState("");
  const [asap, setAsap] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [payment, setPayment] = useState<Payment>("card");
  const [card, setCard] = useState({ holder: "", number: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<CardErrors>({});
  const [saveCard, setSaveCard] = useState(true);
  const [placing, setPlacing] = useState(false);

  if (!isClient) return <CartSkeleton />;
  if (cart.count === 0) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-24 text-center">
        <h1 className="font-display text-h1 font-semibold text-brand">لا توجد أطباق في سلتك</h1>
        <p className="text-body-m text-muted">أضف أطباقاً من القائمة ثم عُد لإتمام الطلب.</p>
        <ButtonLink href="/menu" variant="primary" arrow>
          تصفّح القائمة
        </ButtonLink>
      </div>
    );
  }

  const delivery = cart.mode === "delivery";
  const dateValue = date || dates[0]?.value || "";

  function setCardField(field: keyof typeof card, value: string) {
    let v = value;
    if (field === "number") v = value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
    if (field === "expiry") {
      const d = value.replace(/\D/g, "").slice(0, 4);
      v = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    }
    if (field === "cvv") v = value.replace(/\D/g, "").slice(0, 4);
    setCard((c) => ({ ...c, [field]: v }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function onBlurCard(field: keyof CardErrors) {
    const all = validateCard(card);
    setErrors((e) => ({ ...e, [field]: all[field] }));
  }

  function placeOrder(e: FormEvent) {
    e.preventDefault();
    if (payment === "card") {
      const all = validateCard(card);
      setErrors(all);
      const first = (["number", "holder", "expiry", "cvv"] as const).find((k) => all[k]);
      if (first) {
        document.getElementById(`card-${first}`)?.focus();
        return;
      }
    }
    setPlacing(true);
    const address = demoCustomer.addresses.find((a) => a.id === addressId) ?? demoCustomer.addresses[0];
    const branch = branches.find((b) => b.id === branchId) ?? branches[0];
    const order: OrderRecord = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      mode: cart.mode,
      destination: delivery
        ? { title: address.label, line: address.line }
        : { title: cart.mode === "pickup" ? "استلام من الفرع" : "الطلب في المطعم", line: branch.label },
      schedule: asap
        ? { asap: true }
        : {
            asap: false,
            dateLabel: dates.find((d) => d.value === dateValue)?.label ?? "",
            timeLabel: timeOptions.find((t) => t.value === time)?.label ?? "",
          },
      payment: paymentLabels[payment],
      items: cart.lines.map((l) => ({
        slug: l.slug,
        name: l.dish.name,
        image: l.dish.image,
        qty: l.qty,
        label: l.label,
        total: l.total,
      })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      delivery: cart.delivery,
      vat: cart.vat,
      total: cart.total,
      points: cart.points,
      etaMinutes: delivery ? [35, 45] : [20, 25],
    };
    saveOrder(order);
    cart.clear();
    router.push(`/tracking?order=${order.id}`);
  }

  return (
    <form onSubmit={placeOrder} noValidate className="shell flex flex-col gap-6 pt-6 pb-10 md:gap-10 md:pt-12 md:pb-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex flex-col items-start gap-1.5">
          <h1 className="font-display text-h1 font-semibold text-brand md:text-display-m md:font-bold">الدفع والتوصيل</h1>
          <p className="text-body-m text-muted">خطوة أخيرة قبل أن نبدأ التحضير</p>
        </div>
        <CheckoutSteps current={2} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* 1 — Address / branch */}
          <Section n={1} title={delivery ? "عنوان التوصيل" : "فرع الاستلام"}>
            {delivery && <MapPreview />}
            <div className="grid gap-4 sm:grid-cols-2">
              {delivery
                ? demoCustomer.addresses.map((a) => (
                    <RadioCard
                      key={a.id}
                      name="address"
                      value={a.id}
                      checked={addressId === a.id}
                      onChange={setAddressId}
                      title={a.label}
                      description={a.line}
                      icon={a.icon === "home" ? Home : Store}
                    />
                  ))
                : branches.map((b) => (
                    <RadioCard
                      key={b.id}
                      name="branch"
                      value={b.id}
                      checked={branchId === b.id}
                      onChange={setBranchId}
                      title={b.label.split(" — ")[0]}
                      description={b.label.split(" — ")[1]}
                      icon={MapPin}
                    />
                  ))}
            </div>
            {delivery && (
              <TextField
                id="driver-notes"
                label="تعليمات للسائق"
                icon={Phone}
                placeholder="مثال: الاتصال عند الوصول، البوابة الشمالية"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={140}
              />
            )}
          </Section>

          {/* 2 — Time */}
          <Section n={2} title={delivery ? "وقت التوصيل" : "وقت الاستلام"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <RadioCard
                name="when"
                value="asap"
                checked={asap}
                onChange={() => setAsap(true)}
                title="في أقرب وقت"
                description={delivery ? "التوصيل خلال 35–45 دقيقة" : "نبدأ التحضير فور تأكيد الطلب"}
                icon={Clock}
              />
              <RadioCard
                name="when"
                value="later"
                checked={!asap}
                onChange={() => setAsap(false)}
                title="جدولة الطلب"
                description="اختر يوماً ووقتاً مناسباً"
                icon={CalendarDays}
              />
            </div>
            {!asap && (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="schedule-date"
                  label="اليوم"
                  icon={CalendarDays}
                  options={dates}
                  value={dateValue}
                  onChange={(e) => setDate(e.target.value)}
                />
                <SelectField
                  id="schedule-time"
                  label="الوقت"
                  icon={Clock}
                  options={timeOptions}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            )}
          </Section>

          {/* 3 — Payment */}
          <Section n={3} title="طريقة الدفع">
            <div className="grid gap-4 sm:grid-cols-2">
              <RadioCard name="payment" value="card" checked={payment === "card"} onChange={() => setPayment("card")} title="بطاقة مدى / ائتمانية" description="Visa, Mastercard, مدى" icon={CreditCard} />
              <RadioCard name="payment" value="apple-pay" checked={payment === "apple-pay"} onChange={() => setPayment("apple-pay")} title="Apple Pay" description="دفع سريع وآمن" icon={Wallet} />
              <RadioCard name="payment" value="stc-pay" checked={payment === "stc-pay"} onChange={() => setPayment("stc-pay")} title="STC Pay" description="عبر رقم الجوال" icon={Phone} />
              <RadioCard name="payment" value="cash" checked={payment === "cash"} onChange={() => setPayment("cash")} title="الدفع عند الاستلام" description="نقداً أو بالبطاقة" icon={Truck} />
            </div>

            {payment === "card" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    id="card-number"
                    label="رقم البطاقة"
                    icon={CreditCard}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    dir="ltr"
                    className="text-right placeholder:text-right"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => setCardField("number", e.target.value)}
                    onBlur={() => onBlurCard("number")}
                    error={errors.number}
                  />
                  <TextField
                    id="card-holder"
                    label="اسم حامل البطاقة"
                    icon={User}
                    autoComplete="cc-name"
                    className="uppercase"
                    value={card.holder}
                    onChange={(e) => setCardField("holder", e.target.value)}
                    onBlur={() => onBlurCard("holder")}
                    error={errors.holder}
                  />
                  <TextField
                    id="card-expiry"
                    label="تاريخ الانتهاء"
                    icon={CalendarDays}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    dir="ltr"
                    className="text-right placeholder:text-right"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(e) => setCardField("expiry", e.target.value)}
                    onBlur={() => onBlurCard("expiry")}
                    error={errors.expiry}
                  />
                  <TextField
                    id="card-cvv"
                    label="رمز CVV"
                    icon={CreditCard}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    type="password"
                    dir="ltr"
                    className="text-right"
                    value={card.cvv}
                    onChange={(e) => setCardField("cvv", e.target.value)}
                    onBlur={() => onBlurCard("cvv")}
                    error={errors.cvv}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="save-card" className="text-body-m text-ink">
                    حفظ البطاقة للطلبات القادمة
                  </label>
                  <Toggle id="save-card" checked={saveCard} onChange={setSaveCard} label="حفظ البطاقة للطلبات القادمة" />
                </div>
              </>
            )}
          </Section>

          <div className="flex items-center gap-3 rounded-[20px] border border-accent-line bg-accent-subtle p-5">
            <Gift size={24} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
            <div className="flex flex-col items-start gap-0.5">
              <p className="text-label-l font-medium text-brand">ستحصل على {cart.points} نقطة ولاء</p>
              <p className="text-caption text-muted">
                رصيدك الحالي {demoCustomer.points} نقطة · كل {POINTS_REDEEM.points} نقطة = {POINTS_REDEEM.value} ر.س
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside
          aria-label="طلبك"
          className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 shadow-md md:p-8 lg:sticky lg:top-28 lg:w-[420px] lg:shrink-0"
        >
          <h2 className="font-display text-h3 font-semibold text-brand">طلبك</h2>
          <ul className="flex flex-col gap-5">
            {cart.lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <Image src={l.dish.image} alt="" width={52} height={52} className="size-[52px] rounded-[10px] object-cover" />
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <p className="truncate text-label-m font-medium text-ink">{l.dish.name}</p>
                  <p className="text-caption text-faint">الكمية: {l.qty}</p>
                </div>
                <p className="text-label-m font-medium text-ink">{formatPrice(l.total)}</p>
              </li>
            ))}
          </ul>
          <div className="h-px bg-track" />
          <Totals
            subtotal={cart.subtotal}
            delivery={cart.delivery}
            freeDelivery={cart.freeDelivery}
            showDelivery={delivery}
            discount={cart.discount}
            promo={cart.promo}
            vat={cart.vat}
            total={cart.total}
          />
          <Button type="submit" variant="primary" arrow fullWidth disabled={placing}>
            {placing ? "جارٍ تأكيد الطلب…" : "تأكيد الطلب والدفع"}
          </Button>
          <PaymentBadges />
        </aside>
      </div>
    </form>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 md:p-7">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-subtle text-label-m font-medium text-accent-ink">
          {n}
        </span>
        <h2 id={`step-${n}`} className="font-display text-h3 font-semibold text-brand">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// Stylised street-block map from Figma (decorative; a real map provider can replace it).
function MapPreview() {
  return (
    <div aria-hidden className="relative h-[200px] overflow-hidden rounded-2xl bg-track">
      <div className="absolute inset-5 grid grid-cols-[3fr_2fr_4fr_2.3fr] grid-rows-[70px_80px] gap-5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="rounded-lg bg-subtle" />
        ))}
      </div>
      <div className="absolute inset-x-0 top-[92px] h-3.5 bg-surface" />
      <div className="absolute inset-y-0 left-[55%] w-3.5 bg-surface" />
      <span className="absolute top-[60px] left-[calc(55%-17px)] flex size-12 items-center justify-center rounded-full bg-brand text-canvas shadow-lg">
        <MapPin size={24} strokeWidth={1.75} />
      </span>
    </div>
  );
}
