"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CakeSlice,
  ChevronDown,
  Clock,
  Coffee,
  CupSoda,
  Flame,
  Gift,
  Hamburger,
  MapPin,
  NotebookPen,
  Pizza,
  Plus,
  Salad,
  Search,
  ShoppingBag,
  Star,
  Store,
  Sun,
  Tag,
  Truck,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { MenuListCard } from "@/components/menu/menu-list-card";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Totals } from "@/components/cart/totals";
import { ButtonLink } from "@/components/ui/button";
import { demoCustomer } from "@/lib/account";
import { branches } from "@/lib/site";
import { FREE_DELIVERY_FROM, type OrderMode } from "@/lib/cart";
import { addToCart, applyPromoAndNotify, clearPromoAndNotify } from "@/lib/notify";
import { dishCountLabel, dishes, formatPrice, getDish, type Dish, type DishType } from "@/lib/menu";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

const typeIcons: Record<DishType, LucideIcon> = {
  breakfast: Sun,
  starters: Salad,
  grills: Flame,
  mains: Utensils,
  burgers: Hamburger,
  pizza: Pizza,
  desserts: CakeSlice,
  "hot-drinks": Coffee,
  "cold-drinks": CupSoda,
};

const FEATURED = "family-grill-platter";
const listable = dishes.filter((d) => d.slug !== FEATURED && d.slug !== "small-fattoush");
const popular = [...listable].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

type Section = { id: string; title: string; subtitle: string; icon: LucideIcon; items: Dish[] };

// Grouped like the Figma page ("المشاوي", "الحلويات والمشروبات") so short categories share a section.
const groups: { id: string; title: string; blurb: string; types: DishType[] }[] = [
  { id: "breakfast", title: "الفطور والمقبلات", blurb: "فطور شامي وسلطات طازجة", types: ["breakfast", "starters"] },
  { id: "grills", title: "المشاوي والأطباق الرئيسية", blurb: "على فحم السمر", types: ["grills", "mains"] },
  { id: "burgers", title: "البرجر والبيتزا", blurb: "تُحضّر يدوياً عند الطلب", types: ["burgers", "pizza"] },
  { id: "sweets", title: "الحلويات والمشروبات", blurb: "حلى ومشروبات ساخنة وباردة", types: ["desserts", "hot-drinks", "cold-drinks"] },
];

const sections: Section[] = [
  { id: "popular", title: "الأكثر طلباً", subtitle: dishCountLabel(popular.length), icon: Star, items: popular },
  ...groups
    .map((g) => {
      const items = listable.filter((d) => g.types.includes(d.type));
      return {
        id: g.id,
        title: g.title,
        subtitle: `${dishCountLabel(items.length)} · ${g.blurb}`,
        icon: typeIcons[g.types[0]],
        items,
      };
    })
    .filter((s) => s.items.length > 0),
];

export function OrderOnline() {
  const isClient = useIsClient();
  const cart = useCart();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("popular");

  // Scroll-spy: highlight the rail item of the section in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("sec-", ""));
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return listable.filter((d) => d.name.includes(q) || d.description.includes(q));
  }, [query]);

  const mode: OrderMode = cart.mode === "dine-in" ? "pickup" : cart.mode;
  const delivery = mode === "delivery";
  const destinationOptions = delivery
    ? demoCustomer.addresses.map((a) => ({ value: a.id, label: `${a.label} — ${a.line.split("،")[0]}` }))
    : branches.map((b) => ({ value: b.id, label: b.label }));
  const featured = getDish(FEATURED)!;

  return (
    <>
      {/* ---------- Order bar ---------- */}
      <section className="bg-inverse text-canvas">
        <div className="shell flex flex-col gap-4 pt-5 pb-5 md:gap-6 md:py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex flex-col items-start">
              <h1 className="font-display text-display-m font-bold">اطلب أونلاين</h1>
              <p className="hidden text-body-s text-accent-light md:block">طازج من مطبخنا إلى بابك</p>
            </div>
            <div role="radiogroup" aria-label="طريقة الطلب" className="flex gap-1 rounded-full bg-white/10 p-1">
              {(
                [
                  { value: "delivery", label: "توصيل", icon: Truck },
                  { value: "pickup", label: "استلام من الفرع", short: "استلام", icon: Store },
                ] as const
              ).map((m) => {
                const selected = mode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => cart.setMode(m.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium transition-colors md:flex-none",
                      selected ? "bg-accent text-brand" : "text-canvas hover:bg-white/10",
                    )}
                  >
                    <m.icon size={18} strokeWidth={1.75} aria-hidden />
                    <span className="md:hidden">{"short" in m ? m.short : m.label}</span>
                    <span className="hidden md:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white/8 px-4 py-2.5 md:flex-none">
              <MapPin size={20} strokeWidth={1.75} className="shrink-0 text-accent-light" aria-hidden />
              <span className="flex min-w-0 flex-col items-start">
                <span className="text-caption text-accent-light">{delivery ? "التوصيل إلى" : "الاستلام من"}</span>
                <select
                  value={delivery ? cart.addressId : cart.branchId}
                  onChange={(e) => (delivery ? cart.setAddress(e.target.value) : cart.setBranch(e.target.value))}
                  className="cursor-pointer appearance-none bg-transparent pe-6 text-label-m font-medium text-canvas outline-none [&>option]:text-ink"
                >
                  {destinationOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </span>
              <ChevronDown size={16} strokeWidth={1.75} className="pointer-events-none absolute end-3 text-accent-light" aria-hidden />
              <span className="ms-auto rounded-full bg-success-subtle px-2.5 py-0.5 text-label-s font-medium text-success md:hidden">
                {delivery ? "35 د" : "20 د"}
              </span>
            </label>
            <p className="hidden items-center gap-3 rounded-2xl bg-white/8 px-4 py-2.5 md:flex">
              <Clock size={20} strokeWidth={1.75} className="text-accent-light" aria-hidden />
              <span className="flex flex-col items-start">
                <span className="text-caption text-accent-light">الوقت</span>
                <span className="text-label-m font-medium">في أقرب وقت</span>
              </span>
            </p>
            <p className="hidden items-center gap-2 rounded-full bg-success-subtle px-3.5 py-2 text-label-s font-medium text-success md:flex">
              <span aria-hidden className="size-2 rounded-full bg-success" />
              مفتوح · {delivery ? "التوصيل خلال 35 د" : "الاستلام خلال 20 د"}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="shell flex gap-8 pt-5 pb-6 md:pt-8 md:pb-16">
        {/* Category rail */}
        <nav aria-label="التصنيفات" className="hidden w-[200px] shrink-0 lg:block">
          <div className="sticky top-28 flex flex-col gap-1 rounded-[20px] border border-line bg-surface p-3">
            <p className="px-2 pb-1 text-caption text-faint">التصنيفات</p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#sec-${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-label-m font-medium transition-colors",
                  active === s.id ? "bg-brand text-canvas" : "text-ink hover:bg-subtle",
                )}
              >
                <s.icon size={16} strokeWidth={1.75} aria-hidden />
                <span className="flex-1">{s.title}</span>
                <span className={cn("text-label-s", active === s.id ? "text-accent-light" : "text-faint")}>{s.items.length}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Menu column */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-4 md:h-14 md:px-5">
            <Search size={18} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
            <span className="sr-only">ابحث في القائمة</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في القائمة: مشاوي، برجر، كنافة…"
              className="min-w-0 flex-1 bg-transparent text-body-m text-ink outline-none placeholder:text-faint"
            />
          </label>

          {/* Mobile chips */}
          <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#sec-${s.id}`}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium whitespace-nowrap",
                    active === s.id ? "bg-brand text-canvas" : "border border-line bg-surface text-ink",
                  )}
                >
                  <s.icon size={18} strokeWidth={1.75} aria-hidden />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>

          {/* Promo */}
          <div className="flex items-center gap-3 rounded-2xl border border-accent-line bg-accent-subtle p-4 md:gap-4 md:p-5">
            <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-brand md:flex">
              <Gift size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <Gift size={20} strokeWidth={1.75} className="shrink-0 text-accent-ink md:hidden" aria-hidden />
            <div className="flex flex-1 flex-col items-start">
              <p className="text-label-m font-medium text-brand md:text-label-l">
                خصم 20٪ على سُفر المشاوي<span className="hidden md:inline"> العائلية</span>
              </p>
              <p className="text-caption text-muted">الرمز SUFRA20 · الخميس – السبت</p>
            </div>
            {isClient && (
              <button
                type="button"
                onClick={() => (cart.promo === "SUFRA20" ? clearPromoAndNotify("SUFRA20") : applyPromoAndNotify("SUFRA20"))}
                aria-pressed={cart.promo === "SUFRA20"}
                className={cn(
                  "hidden items-center gap-1.5 rounded-xl border-[1.5px] border-dashed px-3 py-2 text-label-s font-medium md:flex",
                  cart.promo === "SUFRA20" ? "border-success text-success" : "border-accent-line text-brand hover:bg-surface",
                )}
              >
                <Tag size={14} strokeWidth={1.75} aria-hidden />
                {cart.promo === "SUFRA20" ? "تم تطبيق SUFRA20" : "تطبيق SUFRA20"}
              </button>
            )}
          </div>

          {filtered ? (
            <section aria-label="نتائج البحث" className="flex flex-col gap-3">
              <p className="text-body-s text-muted">
                {filtered.length ? `${dishCountLabel(filtered.length)} لـ «${query.trim()}»` : `لا توجد نتائج لـ «${query.trim()}»`}
              </p>
              <DishGrid items={filtered} />
            </section>
          ) : (
            <>
              {/* Featured family platter (desktop) */}
              <article className="hidden overflow-hidden rounded-3xl border border-line bg-surface md:flex">
                <div className="flex flex-1 flex-col items-start gap-2.5 p-6">
                  <div className="flex gap-1.5">
                    {featured.badge && <Badge label={featured.badge.label} tone={featured.badge.tone} />}
                    {featured.extraBadges?.map((b) => <Badge key={b.label} label={b.label} tone={b.tone} />)}
                  </div>
                  <h2 className="font-display text-h2 font-semibold text-brand">{featured.name}</h2>
                  <p className="max-w-[340px] text-body-s text-muted">{featured.description}</p>
                  <div className="flex items-center gap-1.5">
                    <Rating value={featured.rating} />
                    <span className="text-caption text-faint">(214 تقييم)</span>
                  </div>
                  <p className="flex items-baseline gap-2">
                    <span className="text-number-l font-semibold text-brand">{formatPrice(featured.price)}</span>
                    {featured.oldPrice && <span className="text-caption text-faint line-through">{formatPrice(featured.oldPrice)}</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(featured)}
                    className="mt-1 flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-label-m font-medium text-canvas hover:bg-inverse"
                  >
                    <Plus size={18} strokeWidth={1.75} aria-hidden />
                    أضف السُفرة
                  </button>
                </div>
                <div className="relative w-[44%] shrink-0">
                  <Image src={featured.image} alt="" fill sizes="(min-width: 1280px) 280px, 30vw" className="object-cover" />
                </div>
              </article>

              {sections.map((s) => (
                <section key={s.id} id={`sec-${s.id}`} aria-labelledby={`h-${s.id}`} className="flex flex-col gap-3 md:gap-4">
                  <div className="flex items-end justify-between gap-4">
                    <h2 id={`h-${s.id}`} className="font-display text-h2 font-semibold text-brand">
                      {s.title}
                    </h2>
                    <p className="text-caption text-faint">{s.subtitle}</p>
                  </div>
                  <DishGrid items={s.items} />
                </section>
              ))}
            </>
          )}
        </div>

        {/* Live cart panel */}
        <aside aria-label="طلبك" className="hidden w-[300px] shrink-0 xl:block">
          <div className="sticky top-28">{isClient ? <CartPanel /> : <div className="h-96 animate-pulse rounded-[20px] bg-subtle" />}</div>
        </aside>
      </div>

      {/* App strip */}
      <section className="hidden bg-subtle md:block">
        <div className="shell flex items-center justify-between gap-6 py-7">
          <div className="flex items-center gap-3.5">
            <span className="flex size-12 items-center justify-center rounded-[14px] bg-brand text-canvas">
              <ShoppingBag size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <div className="flex flex-col items-start">
              <p className="text-label-l font-medium text-brand">اطلب أسرع عبر تطبيق سُفرة</p>
              <p className="text-caption text-muted">تتبع مباشر، عناوين محفوظة، وطبق مجاني كل 10 طلبات</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" lang="en" className="flex h-9 items-center rounded-full bg-brand px-4 text-label-s font-medium text-canvas">
              App Store
            </a>
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" lang="en" className="flex h-9 items-center rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand">
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* Mobile sticky cart bar */}
      {isClient && cart.count > 0 && (
        <>
          <div aria-hidden className="h-[100px] xl:hidden" />
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-5 pt-4 pb-7 shadow-[0_-8px_24px_0_rgb(61_51_31/0.08)] xl:hidden">
            <Link href="/cart" className="mx-auto flex h-14 max-w-xl items-center gap-3 rounded-full bg-brand ps-2 pe-5 text-canvas">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-label-l font-medium text-brand">{cart.count}</span>
              <span className="flex flex-1 flex-col items-start">
                <span className="text-label-l font-medium">عرض السلة وإتمام الطلب</span>
                {cart.freeDelivery && <span className="text-caption text-accent-light">توصيل مجاني ✓</span>}
              </span>
              <span className="text-price font-semibold text-accent-light">{formatPrice(cart.total)}</span>
            </Link>
          </div>
        </>
      )}
    </>
  );
}

function DishGrid({ items }: { items: Dish[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
      {items.map((d) => (
        <li key={d.slug}>
          <MenuListCard dish={d} />
        </li>
      ))}
    </ul>
  );
}

function CartPanel() {
  const cart = useCart();
  const remaining = Math.max(0, FREE_DELIVERY_FROM - cart.subtotal);

  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-h3 font-semibold text-brand">
          <ShoppingBag size={20} strokeWidth={1.75} aria-hidden />
          طلبك
          {cart.count > 0 && (
            <span className="flex size-6 items-center justify-center rounded-full bg-accent font-sans text-label-s font-medium text-brand">
              {cart.count}
            </span>
          )}
        </h2>
        {cart.count > 0 && (
          <button type="button" onClick={cart.clear} className="text-label-s font-medium text-error">
            مسح
          </button>
        )}
      </div>

      {cart.count === 0 ? (
        <p className="rounded-2xl border border-dashed border-line-strong p-5 text-center text-body-s text-muted">
          سلتك فارغة — اضغط + لإضافة أطباقك.
        </p>
      ) : (
        <>
          {cart.mode === "delivery" && (
            <div className="flex flex-col gap-2 rounded-2xl bg-brand-subtle p-3">
              <p className="flex items-center gap-1.5 text-label-s font-medium text-brand">
                <Truck size={16} strokeWidth={1.75} aria-hidden />
                {remaining === 0 ? "حصلت على توصيل مجاني 🎉" : `أضف ${formatPrice(remaining)} للتوصيل المجاني`}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (cart.subtotal / FREE_DELIVERY_FROM) * 100)}%` }} />
              </div>
            </div>
          )}
          <ul className="flex max-h-[340px] flex-col overflow-y-auto">
            {cart.lines.map((l) => (
              <li key={l.key} className="flex gap-3 border-b border-line py-3 last:border-0">
                <Image src={l.dish.image} alt="" width={52} height={52} className="size-[52px] shrink-0 rounded-xl object-cover" />
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <p className="truncate text-label-m font-medium text-ink">{l.dish.name}</p>
                  {l.label && <p className="truncate text-caption text-accent-ink">{l.label}</p>}
                  <div className="flex w-full items-center justify-between">
                    <p className="text-label-m font-medium text-ink">{formatPrice(l.total)}</p>
                    <QuantityStepper size="compact" value={l.qty} min={0} onChange={(q) => cart.setQty(l.key, q)} label={`كمية ${l.dish.name}`} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 focus-within:border-brand">
            <NotebookPen size={16} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
            <span className="sr-only">ملاحظة للمطبخ</span>
            <input
              value={cart.kitchenNote}
              onChange={(e) => cart.setKitchenNote(e.target.value)}
              maxLength={140}
              placeholder="أضف ملاحظة للمطبخ…"
              className="min-w-0 flex-1 bg-transparent text-body-s text-ink outline-none placeholder:text-faint"
            />
          </label>
          <Totals
            compact
            subtotal={cart.subtotal}
            delivery={cart.delivery}
            freeDelivery={cart.freeDelivery}
            showDelivery={cart.mode === "delivery"}
            discount={cart.discount}
            promo={cart.promo}
            vat={cart.vat}
            total={cart.total}
          />
          <ButtonLink href="/checkout" variant="primary" fullWidth arrow>
            إتمام الطلب
          </ButtonLink>
          <p className="flex items-center justify-center gap-1.5 text-label-s font-medium text-accent-ink">
            <Gift size={14} strokeWidth={1.75} aria-hidden />
            ستكسب {cart.points} نقطة ولاء
          </p>
        </>
      )}
      <Link href="/menu" className="flex items-center justify-center gap-1 text-label-s font-medium text-muted hover:text-brand">
        القائمة الكاملة
        <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
      </Link>
    </div>
  );
}
