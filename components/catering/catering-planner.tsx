"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, Check, ChevronDown, CircleCheck, Gift, MapPin, Phone, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, formatDayLabel } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField, TextField } from "@/components/ui/field";
import { addOns, eventTypes, guestRanges, packages, venues, type EventType, type PackageId } from "@/lib/catering";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/cn";

type Errors = Partial<Record<"name" | "phone" | "date", string>>;

/**
 * Packages + quote form share the chosen package: "اختر الباقة" pre-selects it in the form and scrolls there.
 * `aside` is the server-rendered "لماذا ضيافة سُفرة؟" column next to the form.
 */
export function CateringPlanner({ aside }: { aside: ReactNode }) {
  const [pkg, setPkg] = useState<PackageId>("premium");

  function choose(id: PackageId) {
    setPkg(id);
    const form = document.getElementById("quote");
    form?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    document.getElementById("quote-name")?.focus({ preventScroll: true });
  }

  return (
    <>
      <section id="packages" aria-labelledby="packages-title" className="bg-subtle py-16 md:py-24 lg:py-28">
        <div className="shell flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col items-start gap-1 md:gap-2.5">
            <div className="flex items-center gap-2.5">
              <p className="text-overline font-medium text-accent-ink">الباقات</p>
              <span aria-hidden className="hidden h-[1.5px] w-8 bg-accent md:block" />
            </div>
            <h2 id="packages-title" className="font-display text-h2 font-semibold text-brand md:text-display-m md:font-bold">
              باقات واضحة بأسعار شفافة
            </h2>
            <p className="max-w-[620px] text-body-m text-muted md:text-body-l">
              الأسعار للشخص الواحد وتشمل التقديم والأواني. يمكن تخصيص أي باقة.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {packages.map((p) => {
              const dark = p.featured;
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex flex-col gap-[18px] rounded-[28px] p-7 lg:p-9",
                    dark ? "bg-inverse shadow-lg" : "border border-line bg-surface",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={cn("font-display text-h3 font-semibold", dark ? "text-accent-light" : "text-brand")}>{p.name}</h3>
                    {dark && <Badge label="الأكثر طلباً" tone="gold" />}
                  </div>
                  <p className={cn("text-body-s", dark ? "text-accent-light" : "text-muted")}>{p.tagline}</p>
                  <p className="flex items-end gap-2">
                    <span className={cn("font-display text-display-l leading-none font-bold", dark ? "text-canvas" : "text-brand")}>
                      {p.price}
                    </span>
                    <span className={cn("pb-1 text-body-s", dark ? "text-accent-light" : "text-muted")}>ر.س / للشخص</span>
                  </p>
                  <ul className="flex flex-col gap-[18px]">
                    {p.features.map((f) => (
                      <li key={f} className={cn("flex items-center gap-2.5 text-body-m", dark ? "text-canvas" : "text-ink")}>
                        <Check size={16} strokeWidth={1.75} aria-hidden className={cn("shrink-0", dark ? "text-accent-light" : "text-success")} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-1">
                    <Button variant={dark ? "accent" : "outline"} fullWidth onClick={() => choose(p.id)}>
                      اختر الباقة
                      <span className="sr-only"> {p.name}</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="quote-title" className="py-16 md:py-24 lg:py-28">
        <div className="shell flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div
            id="quote"
            className="flex-1 rounded-[28px] border border-line bg-surface p-5 shadow-md sm:p-8 lg:p-12"
          >
            <QuoteForm pkg={pkg} onPackageChange={setPkg} />
          </div>
          <div className="flex flex-col gap-5 lg:w-[460px] lg:shrink-0">{aside}</div>
        </div>
      </section>
    </>
  );
}

function QuoteForm({ pkg, onPackageChange }: { pkg: PackageId; onPackageChange: (id: PackageId) => void }) {
  const [type, setType] = useState<EventType>("family");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("40-60");
  const [venue, setVenue] = useState("home");
  const [extras, setExtras] = useState<string[]>(["grill-station", "coffee-corner"]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const clear = (k: keyof Errors) => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }));
  const range = guestRanges.find((g) => g.value === guests) ?? guestRanges[0];
  const chosen = packages.find((p) => p.id === pkg) ?? packages[0];
  const estimate = { from: range.min * chosen.price, to: range.max * chosen.price };

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "اكتب اسمك حتى نعرف بمن نتواصل.";
    if (!/^05\d{8}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "أدخل رقم جوال سعودي من 10 أرقام يبدأ بـ 05.";
    if (!date) e.date = "اختر تاريخ المناسبة.";
    setErrors(e);
    const first = (["name", "phone", "date"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(`quote-${first}`)?.focus();
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <CircleCheck size={40} strokeWidth={1.75} className="text-success" aria-hidden />
        <h2 id="quote-title" className="font-display text-h2 font-bold text-brand md:text-display-m">
          وصلنا طلبك، شكراً {name.trim().split(" ")[0]}!
        </h2>
        <p className="text-body-m text-muted md:text-body-l">
          سنرسل لك عرضاً مفصّلاً وقائمة مقترحة خلال 24 ساعة على <span dir="ltr">{phone}</span>.
        </p>
        <dl className="grid w-full grid-cols-1 gap-3 rounded-2xl bg-subtle p-5 text-body-s sm:grid-cols-2">
          <Summary label="المناسبة" value={eventTypes.find((t) => t.value === type)?.label} />
          <Summary label="التاريخ" value={formatDayLabel(date, true)} />
          <Summary label="الضيوف" value={range.label} />
          <Summary label="الباقة" value={chosen.name} />
        </dl>
        <Button variant="outline" size="md" onClick={() => setSent(false)}>
          تعديل الطلب
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-1 md:gap-2.5">
        <div className="flex items-center gap-2.5">
          <p className="text-overline font-medium text-accent-ink">اطلب عرض سعر</p>
          <span aria-hidden className="hidden h-[1.5px] w-8 bg-accent md:block" />
        </div>
        <h2 id="quote-title" className="font-display text-h2 font-semibold text-brand md:text-display-m md:font-bold">
          أخبرنا عن مناسبتك
        </h2>
        <p className="text-body-m text-muted md:text-body-l">نرسل لك عرضاً مفصّلاً وقائمة مقترحة خلال 24 ساعة.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-label-m font-medium text-ink">نوع المناسبة</p>
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <SegmentedControl label="نوع المناسبة" options={[...eventTypes]} value={type} onChange={setType} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id="quote-name"
          label="الاسم الكامل"
          icon={User}
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clear("name");
          }}
          error={errors.name}
        />
        <TextField
          id="quote-phone"
          label="رقم الجوال"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          dir="ltr"
          placeholder="05XX XXX XXX"
          className="text-right placeholder:text-right"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clear("phone");
          }}
          error={errors.phone}
        />
        <DateField
          value={date}
          error={errors.date}
          onChange={(key) => {
            setDate(key);
            clear("date");
          }}
        />
        <SelectField id="quote-guests" label="عدد الضيوف" icon={Users} options={guestRanges} value={guests} onChange={(e) => setGuests(e.target.value)} />
        <SelectField id="quote-venue" label="الموقع" icon={MapPin} options={venues} value={venue} onChange={(e) => setVenue(e.target.value)} />
        <SelectField
          id="quote-package"
          label="الباقة"
          icon={Gift}
          options={packages.map((p) => ({ value: p.id, label: p.name }))}
          value={pkg}
          onChange={(e) => onPackageChange(e.target.value as PackageId)}
        />
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-label-m font-medium text-ink">خدمات إضافية</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {addOns.map((a) => (
            <Checkbox
              key={a.id}
              label={a.label}
              checked={extras.includes(a.id)}
              onChange={(e) => setExtras((xs) => (e.target.checked ? [...xs, a.id] : xs.filter((x) => x !== a.id)))}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" arrow>
          إرسال الطلب
        </Button>
        <p className="text-caption text-muted" aria-live="polite">
          التقدير المبدئي: {estimate.from.toLocaleString("en-US")} – {estimate.to.toLocaleString("en-US")} ر.س قبل الإضافات
        </p>
      </div>
    </form>
  );
}

function Summary({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="text-label-m font-medium text-ink">{value}</dd>
    </div>
  );
}

/** Select-styled field (Figma "Input / Select" with calendar icon) that opens the shared Calendar in a popover. */
function DateField({ value, onChange, error }: { value: string; onChange: (key: string) => void; error?: string }) {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("quote-date")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative flex flex-col items-stretch gap-2">
      <span id="quote-date-label" className="text-label-m font-medium text-ink">
        تاريخ المناسبة
      </span>
      <button
        id="quote-date"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby="quote-date-label quote-date"
        aria-describedby={error ? "quote-date-error" : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex h-[52px] items-center rounded-xl border bg-surface pr-[46px] pl-11 text-start text-body-m transition-shadow",
          error ? "border-error" : "border-line-strong",
          open && "border-brand shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]",
        )}
      >
        <CalendarDays size={20} strokeWidth={1.75} aria-hidden className="pointer-events-none absolute right-4 text-muted" />
        <span className={cn("truncate", value ? "text-ink" : "text-faint")}>{value ? formatDayLabel(value, true) : "اختر التاريخ"}</span>
        <ChevronDown
          size={20}
          strokeWidth={1.75}
          aria-hidden
          className={cn("pointer-events-none absolute left-4 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {error && (
        <p id="quote-date-error" className="text-caption text-error">
          {error}
        </p>
      )}
      {open && isClient && (
        <div role="dialog" aria-label="اختر تاريخ المناسبة" className="absolute top-full right-0 z-30 mt-2 w-[min(340px,calc(100vw-2.5rem))] rounded-[20px] bg-surface shadow-lg">
          <Calendar
            value={value}
            today={new Date()}
            maxDays={180}
            onChange={(key) => {
              onChange(key);
              setOpen(false);
              document.getElementById("quote-date")?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
