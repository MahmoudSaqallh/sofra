"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CircleCheck,
  CreditCard,
  Gift,
  Heart,
  Home,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  SlidersHorizontal,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import { OrderHistory } from "@/components/account/order-history";
import { MenuCard } from "@/components/menu/menu-card";
import { PaymentBadges } from "@/components/cart/totals";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { demoCustomer, pastOrders, POINTS_REDEEM } from "@/lib/account";
import { useFavorites } from "@/lib/favorites";
import { getDish } from "@/lib/menu";
import { loyaltyTiers, tierFor } from "@/lib/offers";
import { readOrders } from "@/lib/orders";
import { displayPhone, sessionStore, type Session } from "@/lib/session";
import { notify } from "@/lib/notifications";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

type Section = "orders" | "addresses" | "payments" | "favorites" | "loyalty" | "reservations" | "notifications" | "settings";

/** Signed-in profile. A phone sign-in opens the demo customer's account; "حساب جديد" starts a fresh one. */
function profileFor(session: Session) {
  const fresh = Boolean(session.isNew);
  const name = session.name ?? demoCustomer.name;
  return {
    fresh,
    name,
    initials: session.name ? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("") : demoCustomer.initials,
    phone: displayPhone(session),
    email: fresh ? null : demoCustomer.email,
    points: fresh ? 0 : demoCustomer.points,
    since: fresh ? new Date().getFullYear() : demoCustomer.memberSince,
    addresses: fresh ? [] : demoCustomer.addresses,
  };
}

export function AccountView() {
  const isClient = useIsClient();
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot, sessionStore.getServerSnapshot);

  if (!isClient) return <AccountSkeleton />;
  if (!session) return <SignedOut />;
  return <Account session={session} />;
}

function Account({ session }: { session: Session }) {
  const router = useRouter();
  const profile = profileFor(session);
  const favorites = useFavorites();
  const [section, setSection] = useState<Section>("orders");
  const orderCount = readOrders().length + (profile.fresh ? 0 : pastOrders.length);
  const tier = tierFor(profile.points);
  const toNext = POINTS_REDEEM.points - (profile.points % POINTS_REDEEM.points);
  const progress = ((profile.points % POINTS_REDEEM.points) / POINTS_REDEEM.points) * 100;

  const nav: { id: Section; label: string; icon: LucideIcon; count?: number }[] = [
    { id: "orders", label: "طلباتي", icon: ReceiptText, count: orderCount },
    { id: "addresses", label: "العناوين المحفوظة", icon: MapPin, count: profile.addresses.length },
    { id: "payments", label: "طرق الدفع", icon: CreditCard },
    { id: "favorites", label: "المفضلة", icon: Heart, count: favorites.length },
    { id: "loyalty", label: "نقاط الولاء والمكافآت", icon: Gift },
    { id: "reservations", label: "حجوزاتي", icon: CalendarDays },
    { id: "notifications", label: "الإشعارات", icon: Bell },
    { id: "settings", label: "إعدادات الحساب", icon: SlidersHorizontal },
  ];

  function signOut() {
    sessionStore.signOut();
    notify({ tone: "info", title: "تم تسجيل الخروج", description: "نراك قريباً على سُفرة" });
    router.push("/");
  }

  return (
    <>
      {/* Figma "Profile header" */}
      <section aria-label="الملف الشخصي" className="bg-inverse">
        <div className="shell flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:py-10">
          <div className="flex items-center gap-4 md:gap-5">
            <span
              aria-hidden
              className="flex size-16 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-accent font-display text-h2 font-bold text-brand md:size-[88px] md:text-display-m"
            >
              {profile.initials}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-h2 font-bold text-canvas md:text-display-m">{profile.name}</h1>
                <Badge label={`عضوية ${tier.name}ة`} tone="gold" />
              </div>
              <p className="text-body-s text-accent-light">
                عضو منذ {profile.since}
                {profile.email && <> · {profile.email}</>} · <span dir="ltr">{profile.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-[20px] bg-accent p-5 text-brand lg:w-[380px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-caption">رصيد النقاط</p>
                <p className="text-number-xl font-semibold">{profile.points.toLocaleString("en-US")} نقطة</p>
              </div>
              <Gift size={32} strokeWidth={1.75} aria-hidden />
            </div>
            <div
              role="progressbar"
              aria-label="التقدّم نحو الطبق المجاني"
              aria-valuemin={0}
              aria-valuemax={POINTS_REDEEM.points}
              aria-valuenow={profile.points % POINTS_REDEEM.points}
              className="h-2 overflow-hidden rounded-full bg-white/45"
            >
              <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-caption">{toNext} نقطة متبقية لطبق مجاني · تنتهي في ديسمبر 2026</p>
          </div>
        </div>
      </section>

      <div className="shell flex flex-col gap-6 py-8 md:py-10 lg:flex-row lg:items-start lg:gap-8">
        <nav aria-label="أقسام الحساب" className="lg:sticky lg:top-28 lg:w-[280px] lg:shrink-0">
          <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:rounded-[20px] lg:border lg:border-line lg:bg-surface lg:p-3">
            {nav.map(({ id, label, icon: Icon, count }) => {
              const active = section === id;
              return (
                <li key={id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setSection(id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-11 w-full items-center gap-2.5 rounded-xl px-3.5 text-label-m font-medium whitespace-nowrap transition-colors max-lg:rounded-full max-lg:border",
                      // Phones: pill chips (forest when active). Desktop: sidebar rows (subtle when active).
                      active
                        ? "max-lg:border-brand max-lg:bg-brand max-lg:text-canvas lg:bg-subtle lg:text-brand"
                        : "text-ink hover:bg-subtle max-lg:border-line max-lg:bg-surface",
                    )}
                  >
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                    <span className="flex-1 text-start">{label}</span>
                    {count ? <span className={cn("text-caption", active ? "max-lg:text-canvas lg:text-brand" : "text-faint")}>{count}</span> : null}
                  </button>
                </li>
              );
            })}
            <li className="shrink-0">
              <button
                type="button"
                onClick={signOut}
                className="flex h-11 w-full items-center gap-2.5 rounded-xl px-3.5 text-label-m font-medium whitespace-nowrap text-error hover:bg-error-subtle max-lg:rounded-full max-lg:border max-lg:border-line max-lg:bg-surface"
              >
                <LogOut size={18} strokeWidth={1.75} aria-hidden className="rtl:-scale-x-100" />
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {section === "orders" && <OrderHistory includeDemo={!profile.fresh} />}
          {section === "addresses" && <Addresses addresses={profile.addresses} />}
          {section === "payments" && <Payments />}
          {section === "favorites" && <Favorites slugs={favorites} />}
          {section === "loyalty" && <Loyalty points={profile.points} />}
          {section === "reservations" && <Reservations />}
          {section === "notifications" && <Notifications />}
          {section === "settings" && <Settings session={session} name={profile.name} email={profile.email} />}
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Panels below "طلباتي" have no Figma frames; they reuse the page's card and type styles.
 * ------------------------------------------------------------------------- */

function Panel({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-h2 font-bold text-brand md:text-h1">{title}</h2>
        {lead && <p className="text-body-m text-muted">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ icon: Icon, title, cta }: { icon: LucideIcon; title: string; cta: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-line-strong px-6 py-12 text-center">
      <Icon size={32} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
      <p className="text-label-l font-medium text-ink">{title}</p>
      <ButtonLink href={cta.href} size="md" arrow>
        {cta.label}
      </ButtonLink>
    </div>
  );
}

function Addresses({ addresses }: { addresses: typeof demoCustomer.addresses }) {
  return (
    <Panel title="العناوين المحفوظة" lead="تظهر هذه العناوين عند اختيار التوصيل في صفحة الدفع.">
      {addresses.length === 0 ? (
        <Empty icon={MapPin} title="لا توجد عناوين محفوظة بعد" cta={{ href: "/order", label: "اطلب الآن" }} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((a, i) => {
            const Icon = a.icon === "home" ? Home : Store;
            return (
              <li key={a.id} className="flex items-start gap-3.5 rounded-[20px] border border-line bg-surface p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-subtle text-brand">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2 text-label-l font-medium text-ink">
                    {a.label}
                    {i === 0 && <Badge label="الافتراضي" tone="success" />}
                  </p>
                  <p className="text-body-s text-muted">{a.line}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Payments() {
  return (
    <Panel title="طرق الدفع" lead="تختار طريقة الدفع عند إتمام كل طلب؛ لا تُحفظ بيانات البطاقات في هذه النسخة.">
      <div className="flex flex-col items-center gap-4 rounded-[20px] border border-line bg-surface p-6">
        <CreditCard size={32} strokeWidth={1.75} className="text-accent-ink" aria-hidden />
        <p className="text-label-l font-medium text-ink">طرق الدفع المقبولة</p>
        <PaymentBadges />
        <p className="text-caption text-muted">أو الدفع عند الاستلام، نقداً أو بالبطاقة.</p>
      </div>
    </Panel>
  );
}

function Favorites({ slugs }: { slugs: string[] }) {
  const dishes = slugs.flatMap((s) => getDish(s) ?? []);
  return (
    <Panel title="المفضلة" lead="الأطباق التي ضغطت على قلبها في القائمة.">
      {dishes.length === 0 ? (
        <Empty icon={Heart} title="لم تضف أطباقاً إلى المفضلة بعد" cta={{ href: "/menu", label: "تصفّح القائمة" }} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dishes.map((dish) => (
            <li key={dish.slug} className="flex">
              <MenuCard dish={dish} className="w-full" sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw" />
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Loyalty({ points }: { points: number }) {
  const current = tierFor(points);
  return (
    <Panel title="نقاط الولاء والمكافآت" lead={`كل ${POINTS_REDEEM.points} نقطة = ${POINTS_REDEEM.value} ر.س أو طبق مجاني، تُستبدل عند الدفع.`}>
      <ul className="grid gap-4 md:grid-cols-3">
        {loyaltyTiers.map((t) => {
          const mine = t.id === current.id;
          return (
            <li key={t.id} className={cn("flex flex-col gap-2 rounded-[20px] p-5", mine ? "bg-inverse text-canvas" : "border border-line bg-surface")}>
              <div className="flex items-center justify-between gap-2">
                <p className={cn("font-display text-h3 font-semibold", mine ? "text-accent-light" : "text-brand")}>{t.name}</p>
                {mine && <Badge label="مستواك الحالي" tone="gold" />}
              </div>
              <p className={cn("text-caption", mine ? "opacity-80" : "text-muted")}>{t.range}</p>
              <p className="text-body-s">{t.perks[0]}</p>
            </li>
          );
        })}
      </ul>
      <ButtonLink href="/offers#loyalty" variant="outline" size="md" className="self-start" arrow>
        كل مزايا البرنامج
      </ButtonLink>
    </Panel>
  );
}

function Reservations() {
  return (
    <Panel title="حجوزاتي">
      <Empty icon={CalendarDays} title="لا توجد حجوزات قادمة" cta={{ href: "/reservations", label: "احجز طاولة" }} />
    </Panel>
  );
}

const NOTIFY_KEY = "sufra-notify-v1";
const notifyOptions = [
  { id: "orders", label: "تحديثات الطلب", detail: "رسالة نصية عند تجهيز طلبك وخروجه للتوصيل" },
  { id: "offers", label: "العروض الأسبوعية", detail: "بريد بعروض الأسبوع وأطباق الموسم" },
  { id: "points", label: "نقاط الولاء", detail: "تنبيه عند اقتراب انتهاء نقاطك" },
];

function Notifications() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    try {
      return { orders: true, offers: false, points: true, ...JSON.parse(window.localStorage.getItem(NOTIFY_KEY) ?? "{}") };
    } catch {
      return { orders: true, offers: false, points: true };
    }
  });

  function set(id: string, value: boolean) {
    const next = { ...prefs, [id]: value };
    setPrefs(next);
    try {
      window.localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  return (
    <Panel title="الإشعارات">
      <ul className="flex flex-col divide-y divide-line rounded-[20px] border border-line bg-surface px-5">
        {notifyOptions.map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-4 py-4">
            <div className="flex flex-col">
              <p className="text-label-l font-medium text-ink">{o.label}</p>
              <p className="text-caption text-muted">{o.detail}</p>
            </div>
            <Toggle label={o.label} checked={prefs[o.id]} onChange={(v) => set(o.id, v)} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function Settings({ session, name: initialName, email: initialEmail }: { session: Session; name: string; email: string | null }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [error, setError] = useState<{ name?: string; email?: string }>({});
  const [saved, setSaved] = useState(false);

  function save(e: FormEvent) {
    e.preventDefault();
    const errs: typeof error = {};
    if (name.trim().length < 2) errs.name = "اكتب اسمك (حرفان على الأقل).";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "تأكد من صيغة البريد الإلكتروني.";
    setError(errs);
    if (errs.name || errs.email) return;
    sessionStore.signIn({ ...session, name: name.trim() });
    setSaved(true);
  }

  return (
    <Panel title="إعدادات الحساب">
      <form onSubmit={save} noValidate className="flex flex-col gap-5 rounded-[20px] border border-line bg-surface p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField id="settings-name" label="الاسم" icon={User} value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} error={error.name} />
          <TextField id="settings-phone" label="رقم الجوال" icon={Phone} value={displayPhone(session)} dir="ltr" className="text-right" disabled hint="لتغيير الرقم سجّل الدخول بالرقم الجديد" />
          <TextField id="settings-email" label="البريد الإلكتروني" icon={Mail} type="email" dir="ltr" className="text-right" value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} error={error.email} hint="اختياري" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="md">
            حفظ التغييرات
          </Button>
          {saved && (
            <p role="status" className="flex items-center gap-1.5 text-label-m text-success">
              <CircleCheck size={18} strokeWidth={1.75} aria-hidden />
              تم الحفظ
            </p>
          )}
        </div>
      </form>
    </Panel>
  );
}

function SignedOut() {
  return (
    <div className="shell flex flex-col items-center gap-4 py-24 text-center">
      <span className="flex size-[88px] items-center justify-center rounded-[28px] bg-brand-subtle text-brand">
        <User size={40} strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="font-display text-h1 font-bold text-brand">سجّل دخولك لعرض حسابك</h1>
      <p className="max-w-[440px] text-body-m text-muted">تابع طلباتك، واجمع نقاط الولاء، واحفظ عناوينك وأطباقك المفضلة.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/sign-in?next=/account" arrow>
          تسجيل الدخول
        </ButtonLink>
        <ButtonLink href="/order" variant="outline">
          المتابعة كضيف
        </ButtonLink>
      </div>
      <p className="text-caption text-faint">
        ليس لديك حساب؟{" "}
        <Link href="/sign-in?next=/account" className="font-medium text-brand hover:underline">
          أنشئ حساباً مجاناً
        </Link>
      </p>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[260px] bg-inverse lg:h-[228px]" />
      <div className="shell flex gap-8 py-10">
        <div className="hidden h-[460px] w-[280px] shrink-0 animate-pulse rounded-[20px] bg-subtle lg:block" />
        <div className="flex flex-1 flex-col gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[169px] animate-pulse rounded-[20px] bg-subtle" />
          ))}
        </div>
      </div>
    </div>
  );
}
