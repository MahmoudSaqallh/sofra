"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, CircleCheck, Clock, MapPin, Phone, User, Users } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField, TextField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { branches } from "@/lib/site";
import { timeOptions, upcomingDates } from "@/lib/schedule";
import { useIsClient } from "@/lib/use-is-client";

type Occasion = "family" | "private" | "business";

const occasions: { value: Occasion; label: string }[] = [
  { value: "family", label: "عشاء عائلي" },
  { value: "private", label: "مناسبة خاصة" },
  { value: "business", label: "اجتماع عمل" },
];

const guestOptions = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  const label = n === 1 ? "شخص واحد" : n === 2 ? "شخصان" : n <= 10 ? `${n} أشخاص` : `${n} شخصاً`;
  return { value: String(n), label };
});


type Errors = Partial<Record<"name" | "phone" | "date", string>>;

const normalizePhone = (v: string) => v.replace(/[\s-]/g, "");

function validate(field: keyof Errors, values: { name: string; phone: string; date: string }) {
  switch (field) {
    case "name":
      return values.name.trim().length >= 2 ? undefined : "اكتب اسمك كما تريد ظهوره في الحجز.";
    case "phone":
      return /^05\d{8}$/.test(normalizePhone(values.phone))
        ? undefined
        : "أدخل رقم جوال سعودي من 10 أرقام يبدأ بـ 05.";
    case "date":
      return values.date ? undefined : "اختر تاريخ الحجز.";
  }
}

export function ReservationForm() {
  const isClient = useIsClient();
  // Dates depend on "now", so they are only generated in the browser.
  const dateOptions = useMemo(() => (isClient ? upcomingDates(14) : []), [isClient]);

  const [occasion, setOccasion] = useState<Occasion>("family");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState(branches[0].id);
  const [pickedDate, setPickedDate] = useState("");
  const [time, setTime] = useState("20:30");
  const [guests, setGuests] = useState("4");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const date = pickedDate || dateOptions[0]?.value || "";
  const values = { name, phone, date };

  function onBlur(field: keyof Errors) {
    setErrors((e) => ({ ...e, [field]: validate(field, values) }));
  }

  function clearError(field: keyof Errors) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      name: validate("name", values),
      phone: validate("phone", values),
      date: validate("date", values),
    };
    setErrors(next);
    const firstInvalid = (Object.keys(next) as (keyof Errors)[]).find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(`reservation-${firstInvalid}`)?.focus();
      return;
    }
    // No reservations API yet — the confirmation is shown locally.
    setSubmitted(true);
  }

  if (submitted) {
    const label = (list: { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label;
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl bg-success-subtle p-6">
        <CircleCheck size={32} strokeWidth={1.75} className="text-success" aria-hidden />
        <p className="font-display text-h3 font-semibold text-brand">تم استلام طلب حجزك</p>
        <p className="text-body-m text-ink">
          {label(occasions, occasion)} · {label(guestOptions, guests)} · {label(dateOptions, date)} ·{" "}
          {label(timeOptions, time)}
          <br />
          {branches.find((b) => b.id === branch)?.label}
        </p>
        <p className="text-body-s text-muted">
          سنرسل رسالة التأكيد إلى <span dir="ltr">{phone}</span>، وتذكيراً قبل موعدك بساعتين.
        </p>
        <Button variant="outline" size="md" onClick={() => setSubmitted(false)}>
          تعديل الحجز
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-7">
      <SegmentedControl label="نوع المناسبة" options={occasions} value={occasion} onChange={setOccasion} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="reservation-name"
          label="الاسم الكامل"
          icon={User}
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          onBlur={() => onBlur("name")}
          error={errors.name}
        />
        <TextField
          id="reservation-phone"
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
            clearError("phone");
          }}
          onBlur={() => onBlur("phone")}
          error={errors.phone}
        />
        <SelectField
          id="reservation-branch"
          label="الفرع"
          icon={MapPin}
          options={branches.map((b) => ({ value: b.id, label: b.label }))}
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        />
        <SelectField
          id="reservation-date"
          label="التاريخ"
          icon={CalendarDays}
          options={dateOptions}
          placeholder={dateOptions.length ? undefined : "جارٍ تحميل التواريخ…"}
          value={date}
          onChange={(e) => {
            setPickedDate(e.target.value);
            clearError("date");
          }}
          error={errors.date}
        />
        <SelectField
          id="reservation-time"
          label="الوقت"
          icon={Clock}
          options={timeOptions}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <SelectField
          id="reservation-guests"
          label="عدد الضيوف"
          icon={Users}
          options={guestOptions}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="primary" arrow fullWidth>
          تأكيد الحجز
        </Button>
        <p className="text-caption text-faint">
          بالضغط على «تأكيد الحجز» توافق على سياسة الإلغاء: مجاناً حتى 3 ساعات قبل الموعد.
        </p>
      </div>
    </form>
  );
}
