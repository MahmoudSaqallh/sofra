"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CircleCheck, Flame, Leaf, Truck, Users } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/notify";
import { unitPrice, FREE_DELIVERY_FROM } from "@/lib/cart";
import { formatPrice, type Dish } from "@/lib/menu";
import { cn } from "@/lib/cn";

function servesLabel(n: number) {
  return n === 1 ? "يكفي شخص" : n === 2 ? "يكفي شخصين" : `يكفي ${n} أشخاص`;
}

// Size → extras → notes → quantity → add. Totals update live: base size + extras, × quantity.
export function DishOrderForm({ dish }: { dish: Dish }) {
  const [sizeId, setSizeId] = useState(dish.sizes?.[0]?.id ?? "");
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 4000);
    return () => clearTimeout(t);
  }, [added]);

  const size = dish.sizes?.find((s) => s.id === sizeId);
  const basePrice = size?.price ?? dish.price;
  const total = unitPrice(dish, sizeId || undefined, extras) * qty;
  const isDefaultSize = !dish.sizes || sizeId === dish.sizes[0].id;
  const maxExtras = dish.extras?.max ?? 0;
  const serves = size?.serves ?? dish.serves;

  function toggleExtra(id: string) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function submit() {
    addToCart(dish, { qty, sizeId: sizeId || undefined, extras, note });
    setAdded(true);
    setQty(1);
  }

  // RTL order from Figma: calories → serves → halal → delivery (delivery is desktop-only).
  const facts = [
    { icon: Flame, title: dish.calories?.toLocaleString("en-US") ?? "", sub: "سعرة حرارية", show: Boolean(dish.calories) },
    { icon: Users, title: serves ? String(serves) : "", sub: serves ? servesLabel(serves) : "", show: Boolean(serves) },
    { icon: Leaf, title: "حلال", sub: "لحوم محلية", show: Boolean(dish.halal) },
    { icon: Truck, title: "مجاني", sub: `فوق ${FREE_DELIVERY_FROM} ر.س`, show: true, desktopOnly: true },
  ].filter((f) => f.show);

  const addLabel = added ? "تمت الإضافة" : `أضف إلى السلة · ${formatPrice(total)}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Price */}
      <div className="flex items-center gap-2.5 md:gap-3">
        <p className="text-number-l font-semibold text-brand md:text-number-xl">{formatPrice(basePrice)}</p>
        {dish.oldPrice && isDefaultSize && (
          <>
            <p className="text-body-s text-faint line-through md:text-body-m">{formatPrice(dish.oldPrice)}</p>
            <span className="hidden md:inline">
              <Badge label={`وفّر ${Math.round((1 - dish.price / dish.oldPrice) * 100)}٪`} tone="error" />
            </span>
          </>
        )}
      </div>

      {dish.sizes && (
        <fieldset className="flex flex-col gap-2.5 md:gap-3">
          <legend className="pb-2.5 text-label-l font-medium text-ink md:pb-3">الحجم</legend>
          <div className="md:hidden">
            <SegmentedControl
              label="الحجم"
              options={dish.sizes.map((s) => ({ value: s.id, label: s.label }))}
              value={sizeId}
              onChange={setSizeId}
              fullWidth
            />
          </div>
          <div className="hidden md:block">
            <SegmentedControl
              label="الحجم"
              options={dish.sizes.map((s) => ({ value: s.id, label: `${s.label} — ${formatPrice(s.price)}` }))}
              value={sizeId}
              onChange={setSizeId}
            />
          </div>
        </fieldset>
      )}

      {dish.extras && (
        <fieldset className="overflow-hidden rounded-2xl border border-line bg-surface">
          <legend className="sr-only">إضافات</legend>
          <div className="flex items-center justify-between bg-subtle px-4 py-3 md:py-3.5">
            <p className="text-label-l font-medium text-ink">إضافات</p>
            <p className="text-caption text-faint">
              اختياري<span className="hidden md:inline"> · حتى {maxExtras}</span>
            </p>
          </div>
          {dish.extras.options.map((o) => {
            const checked = extras.includes(o.id);
            return (
              <div key={o.id} className="flex items-center justify-between border-t border-line px-4 py-3 md:py-3.5">
                <Checkbox
                  label={o.label}
                  checked={checked}
                  disabled={!checked && extras.length >= maxExtras}
                  onChange={() => toggleExtra(o.id)}
                />
                <span className="text-label-s font-medium text-muted md:text-label-m">+{formatPrice(o.price)}</span>
              </div>
            );
          })}
        </fieldset>
      )}

      <div className="hidden flex-col gap-2 md:flex">
        <label htmlFor="dish-note" className="text-label-m font-medium text-ink">
          ملاحظات للمطبخ
        </label>
        <input
          id="dish-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={120}
          placeholder="مثال: بدون بصل، الشواء جيد التسوية"
          className="h-[52px] rounded-xl border border-line-strong bg-surface px-4 text-body-m text-ink outline-none placeholder:text-faint focus:border-brand focus:shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]"
        />
      </div>

      {/* Desktop add row */}
      <div className="hidden items-center gap-4 md:flex">
        <AddButton label={addLabel} added={added} onClick={submit} />
        <QuantityStepper value={qty} onChange={setQty} label="الكمية" />
      </div>

      {facts.length > 0 && (
        <ul className="flex items-stretch rounded-2xl bg-accent-subtle py-3.5 md:py-4">
          {facts.map(({ icon: Icon, title, sub, desktopOnly }) => (
            <li
              key={sub}
              className={cn(
                "flex-1 flex-col items-center gap-0.5 text-center md:flex md:gap-1",
                desktopOnly ? "hidden" : "flex",
              )}
            >
              <Icon size={20} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
              <span className="text-label-m font-medium text-ink">{title}</span>
              <span className="text-caption text-muted">{sub}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Mobile sticky add bar (Figma "Sticky bar") */}
      <div aria-hidden className="h-[76px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line bg-surface px-5 pt-4 pb-7 shadow-[0_-8px_24px_0_rgb(61_51_31/0.08)] md:hidden">
        <AddButton label={added ? "تمت الإضافة" : `أضف · ${formatPrice(total)}`} added={added} onClick={submit} />
        <QuantityStepper value={qty} onChange={setQty} label="الكمية" />
      </div>
    </div>
  );
}

function AddButton({ label, added, onClick }: { label: string; added: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-6 text-label-l font-medium whitespace-nowrap text-canvas transition-colors md:px-8",
        added ? "bg-success" : "bg-brand hover:bg-inverse",
      )}
    >
      {label}
      {added ? (
        <CircleCheck size={20} strokeWidth={1.75} aria-hidden />
      ) : (
        <ArrowLeft size={20} strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
