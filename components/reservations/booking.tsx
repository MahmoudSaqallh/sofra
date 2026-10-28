"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Clock,
  Gift,
  Heart,
  Mail,
  Phone,
  Store,
  Sun,
  User,
  Users,
} from "lucide-react";
import { Calendar, dateKey, formatDayLabel } from "@/components/ui/calendar";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { SelectField, TextField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { branchList, getBranch } from "@/lib/branches";
import { formatTimeLabel, shortTimeLabel } from "@/lib/schedule";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

const seatings = [
  { id: "main", title: "الصالة الرئيسية", detail: "أجواء عائلية دافئة", icon: Users, maxGuests: 12 },
  { id: "terrace", title: "التراس الخارجي", detail: "إطلالة على الحديقة", icon: Sun, maxGuests: 12 },
  { id: "private", title: "غرفة خاصة", detail: "حتى 24 ضيفاً · +150 ر.س", icon: Heart, maxGuests: 24 },
];

const occasions = ["بدون مناسبة", "عشاء عائلي", "عيد ميلاد", "ذكرى زواج", "اجتماع عمل", "مناسبة أخرى"].map((o) => ({ value: o, label: o }));

// Evening seatings from the Figma slot grid: 6:00 م → 11:30 م every 30 min.
const slots = Array.from({ length: 12 }, (_, i) => 18 * 60 + i * 30);

/** Deterministic "fully booked" slots per branch/day (simulated availability, no backend). */
function isBooked(branchId: string, day: string, minutes: number) {
  let h = 0;
  for (const c of `${branchId}${day}${minutes}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 4 === 0;
}

function guestsLabel(n: number) {
  return n === 1 ? "شخص واحد" : n === 2 ? "شخصان" : n <= 10 ? `${n} أشخاص` : `${n} شخصاً`;
}

type Errors = Partial<Record<"name" | "phone" | "email" | "time", string>>;

export function Booking() {
  const isClient = useIsClient();
  const params = useSearchParams();
  const today = useMemo(() => (isClient ? new Date() : null), [isClient]);
  const requested = params.get("branch");

  const [branchId, setBranchId] = useState(
    branchList.some((b) => b.id === requested) ? (requested as string) : branchList[0].id,
  );
  const [day, setDay] = useState("");
  const [time, setTime] = useState<number | null>(20 * 60 + 30);
  const [guests, setGuests] = useState(4);
  const [seating, setSeating] = useState("main");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState(occasions[0].value);
  const [requests, setRequests] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const branch = getBranch(branchId);
  const seat = seatings.find((s) => s.id === seating)!;
  const dayKey = day || (today ? dateKey(today) : "");
  const nowMinutes = today && dayKey === dateKey(today) ? today.getHours() * 60 + today.getMinutes() : -1;

  function slotState(m: number) {
    if (m <= nowMinutes + 30) return "past" as const;
    if (isBooked(branchId, dayKey, m)) return "booked" as const;
    return "free" as const;
  }
  const timeValid = time !== null && dayKey && slotState(time) === "free";

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "اكتب اسمك كما تريد ظهوره في الحجز.";
    if (!/^05\d{8}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "أدخل رقم جوال سعودي من 10 أرقام يبدأ بـ 05.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "تأكد من صيغة البريد الإلكتروني.";
    if (!timeValid) e.time = "اختر وقتاً متاحاً.";
    return e;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = (["time", "name", "phone", "email"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(first === "time" ? "slots" : `booking-${first}`)?.focus();
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!today) return <div aria-hidden className="shell h-[900px] animate-pulse py-14" />;

  const summary: [typeof Store, string, string][] = [
    [Store, "الفرع", `${branch.name} — ${branch.city}`],
    [CalendarDays, "التاريخ", formatDayLabel(dayKey, true)],
    [Clock, "الوقت", time !== null ? formatTimeLabel(Math.floor(time / 60) % 24, time % 60) : "—"],
    [Users, "الضيوف", guestsLabel(guests)],
    [Heart, "الجلسة", seat.title],
    ...(occasion !== occasions[0].value ? [[Gift, "المناسبة", occasion] as [typeof Store, string, string]] : []),
  ];

  if (done) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-16 text-center md:py-24">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-brand text-canvas">
          <Check size={36} strokeWidth={1.75} />
        </span>
        <h2 className="font-display text-display-m font-bold text-brand">تم تأكيد حجزك!</h2>
        <p className="max-w-md text-body-m text-muted">
          ننتظرك في {branch.name} {formatDayLabel(dayKey)} الساعة {summary[2][2]}. أرسلنا رسالة التأكيد إلى{" "}
          <span dir="ltr">{phone}</span>.
        </p>
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 text-start">
          <SummaryRows rows={summary} />
        </div>
        <Button variant="outline" size="md" onClick={() => setDone(false)}>
          تعديل الحجز
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="shell flex flex-col gap-6 pt-8 pb-16 md:pt-14 md:pb-28 lg:flex-row-reverse lg:items-start lg:gap-10">
      {/* Summary */}
      <aside aria-label="ملخص الحجز" className="order-last flex flex-col gap-[18px] rounded-3xl lg:order-none border border-line bg-surface p-6 shadow-md md:p-8 lg:sticky lg:top-28 lg:w-[420px] lg:shrink-0">
        <div className="relative hidden h-40 overflow-hidden rounded-2xl md:block">
          <Image src={branch.image} alt="" fill sizes="356px" className="object-cover" />
        </div>
        <h2 className="font-display text-h3 font-semibold text-brand">ملخص الحجز</h2>
        <SummaryRows rows={summary} />
        <div className="h-px bg-track" />
        <p className="flex items-start gap-2.5 rounded-xl bg-accent-subtle p-3.5 text-caption text-ink">
          <Check size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-success" aria-hidden />
          لا يلزم دفع عربون. يُحتفظ بالطاولة 15 دقيقة بعد الموعد، والإلغاء مجاني حتى 3 ساعات قبله.
        </p>
        <Button type="submit" variant="primary" arrow fullWidth>
          تأكيد الحجز
        </Button>
        <p className="text-center text-caption text-faint">
          {phone ? (
            <>
              ستصلك رسالة تأكيد على <span dir="ltr">{phone}</span>
            </>
          ) : (
            "ستصلك رسالة تأكيد على جوالك"
          )}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Step n={1} title="اختر الفرع">
          <div role="radiogroup" aria-label="الفرع" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {branchList.map((b) => {
              const selected = b.id === branchId;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setBranchId(b.id)}
                  className={cn(
                    "flex flex-col overflow-hidden rounded-2xl bg-surface text-start transition-colors",
                    selected ? "border-2 border-brand" : "m-px border border-line hover:border-line-strong",
                  )}
                >
                  <span className="relative h-[110px] w-full">
                    <Image src={b.image} alt="" fill sizes="200px" className="object-cover" />
                  </span>
                  <span className="flex flex-col items-start gap-0.5 p-3.5">
                    <span className={cn("text-label-l font-medium", selected ? "text-brand" : "text-ink")}>{b.name}</span>
                    <span className="text-caption text-muted">
                      {b.city} · {b.tablesTonight} طاولة متاحة
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={2} title="التاريخ والوقت">
          <div className="grid gap-7 md:grid-cols-[1fr_340px]">
            <Calendar value={dayKey} onChange={setDay} today={today} />
            <div className="flex flex-col gap-4">
              <p className="text-label-l font-medium text-ink">الوقت المتاح · {formatDayLabel(dayKey)}</p>
              <div id="slots" tabIndex={-1} role="radiogroup" aria-label="الوقت" className="grid grid-cols-3 gap-2.5">
                {slots.map((m) => {
                  const state = slotState(m);
                  const selected = time === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={state !== "free"}
                      onClick={() => {
                        setTime(m);
                        setErrors((e) => ({ ...e, time: undefined }));
                      }}
                      title={state === "booked" ? "محجوز بالكامل" : undefined}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-xl text-label-m font-medium transition-colors",
                        selected && state === "free"
                          ? "bg-brand text-canvas"
                          : state === "free"
                            ? "border border-line bg-surface text-ink hover:border-brand"
                            : "cursor-not-allowed border border-line bg-subtle text-faint line-through decoration-faint/50",
                      )}
                    >
                      {shortTimeLabel(m)}
                    </button>
                  );
                })}
              </div>
              {errors.time && <p className="text-caption text-error">{errors.time}</p>}
              <div className="flex items-center justify-between rounded-2xl bg-subtle p-4">
                <div className="flex flex-col items-start">
                  <p className="text-label-l font-medium text-ink">عدد الضيوف</p>
                  <p className="text-caption text-muted">حتى {seat.maxGuests} ضيفاً {seating === "private" ? "للغرفة" : "للطاولة"}</p>
                </div>
                <QuantityStepper value={guests} onChange={setGuests} max={seat.maxGuests} label="عدد الضيوف" />
              </div>
            </div>
          </div>
        </Step>

        <Step n={3} title="تفضيل الجلسة">
          <div role="radiogroup" aria-label="تفضيل الجلسة" className="grid gap-4 sm:grid-cols-3">
            {seatings.map((s) => {
              const selected = s.id === seating;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setSeating(s.id);
                    setGuests((g) => Math.min(g, s.maxGuests));
                  }}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-2xl p-5 text-start transition-colors",
                    selected ? "border-2 border-brand bg-brand-subtle" : "m-px border border-line bg-surface hover:border-line-strong",
                  )}
                >
                  <span className="flex w-full items-center justify-between">
                    <span className={cn("flex size-11 items-center justify-center rounded-xl text-brand", selected ? "bg-surface" : "bg-subtle")}>
                      <s.icon size={20} strokeWidth={1.75} aria-hidden />
                    </span>
                    <span
                      aria-hidden
                      className={cn("size-[22px] rounded-full bg-surface", selected ? "border-[6px] border-brand" : "border-[1.5px] border-line-strong")}
                    />
                  </span>
                  <span className="text-label-l font-medium text-ink">{s.title}</span>
                  <span className="text-caption text-muted">{s.detail}</span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={4} title="بيانات التواصل">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="booking-name" label="الاسم الكامل" icon={User} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} error={errors.name} />
            <TextField id="booking-phone" label="رقم الجوال" icon={Phone} type="tel" inputMode="tel" autoComplete="tel-national" dir="ltr" placeholder="05XX XXX XXX" className="text-right placeholder:text-right" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((x) => ({ ...x, phone: undefined })); }} error={errors.phone} />
            <TextField id="booking-email" label="البريد الإلكتروني (اختياري)" icon={Mail} type="email" autoComplete="email" dir="ltr" className="text-right" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} error={errors.email} />
            <SelectField id="booking-occasion" label="المناسبة" icon={Gift} options={occasions} value={occasion} onChange={(e) => setOccasion(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="booking-requests" className="text-label-m font-medium text-ink">
              طلبات خاصة
            </label>
            <textarea
              id="booking-requests"
              rows={3}
              maxLength={300}
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              placeholder="مثال: كعكة صغيرة مع شمعة عند التحلية، وكرسي أطفال"
              className="resize-y rounded-xl border border-line-strong bg-surface p-4 text-body-m text-ink outline-none placeholder:text-faint focus:border-brand focus:shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]"
            />
          </div>
        </Step>
      </div>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`booking-step-${n}`} className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 md:p-7">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-accent-subtle text-label-m font-medium text-accent-ink">{n}</span>
        <h2 id={`booking-step-${n}`} className="font-display text-h3 font-semibold text-brand">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function SummaryRows({ rows }: { rows: [typeof Store, string, string][] }) {
  return (
    <dl className="flex flex-col gap-[18px]">
      {rows.map(([Icon, label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-body-s text-muted">
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            {label}
          </dt>
          <dd className="text-end text-label-m font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

