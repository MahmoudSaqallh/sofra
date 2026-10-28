"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck, Mail, Paperclip, Phone, Store, User, X } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField, TextField } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { branches } from "@/lib/site";
import { cn } from "@/lib/cn";

const subjects = [
  { value: "general", label: "استفسار عام" },
  { value: "event", label: "حجز مناسبة" },
  { value: "feedback", label: "اقتراح أو شكوى" },
  { value: "careers", label: "شراكة وتوظيف" },
];

const inquiryTypes = [
  { value: "general", label: "استفسار عام" },
  { value: "corporate", label: "طلب ضيافة لشركة" },
  { value: "large-order", label: "طلب كبير" },
  { value: "partnership", label: "شراكة أو تعاون" },
];

const MAX = 500;
const MAX_FILE = 10 * 1024 * 1024;

type Errors = Partial<Record<"name" | "phone" | "email" | "message" | "consent" | "file", string>>;

/**
 * Contact form. "full" = Contact page (subject tabs, branch, attachment, consent);
 * "compact" = Branches page (inquiry type select). No backend yet — success is shown locally.
 */
export function ContactForm({ variant = "full", initialSubject = "general" }: { variant?: "full" | "compact"; initialSubject?: string }) {
  const full = variant === "full";
  const [subject, setSubject] = useState(initialSubject);
  const [inquiry, setInquiry] = useState(inquiryTypes[0].value);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const clear = (k: keyof Errors) => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }));

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "اكتب اسمك حتى نعرف بمن نتواصل.";
    if (!/^05\d{8}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "أدخل رقم جوال سعودي من 10 أرقام يبدأ بـ 05.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "تأكد من صيغة البريد الإلكتروني.";
    if (message.trim().length < 10) e.message = "اكتب تفاصيل رسالتك (10 أحرف على الأقل).";
    if (full && !consent) e.consent = "نحتاج موافقتك للرد على رسالتك.";
    return e;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = (["name", "phone", "email", "message", "consent"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-2xl bg-success-subtle p-6">
        <CircleCheck size={32} strokeWidth={1.75} className="text-success" aria-hidden />
        <p className="font-display text-h3 font-semibold text-brand">وصلتنا رسالتك، شكراً {name.split(" ")[0]}!</p>
        <p className="text-body-m text-ink">سيتواصل معك الفريق المختص خلال ساعتين في أوقات العمل على <span dir="ltr">{phone}</span>.</p>
        <Button
          variant="outline"
          size="md"
          onClick={() => {
            setSent(false);
            setMessage("");
            setFile(null);
          }}
        >
          إرسال رسالة أخرى
        </Button>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={submit} noValidate className="flex flex-col gap-6">
      {full && (
        <div className="flex flex-col gap-2.5">
          <p className="text-label-m font-medium text-ink">موضوع الرسالة</p>
          <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
            <SegmentedControl label="موضوع الرسالة" options={subjects} value={subject} onChange={setSubject} />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="contact-name" label={full ? "الاسم الكامل" : "الاسم"} icon={User} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} error={errors.name} />
        <TextField id="contact-phone" label="رقم الجوال" icon={Phone} type="tel" inputMode="tel" autoComplete="tel-national" dir="ltr" placeholder="05XX XXX XXX" className="text-right placeholder:text-right" value={phone} onChange={(e) => { setPhone(e.target.value); clear("phone"); }} error={errors.phone} />
        <TextField id="contact-email" label={full ? "البريد الإلكتروني" : "البريد الإلكتروني"} hint="اختياري" icon={Mail} type="email" autoComplete="email" dir="ltr" className="text-right" value={email} onChange={(e) => { setEmail(e.target.value); clear("email"); }} error={errors.email} />
        {full ? (
          <SelectField id="contact-branch" label="الفرع (اختياري)" icon={Store} placeholder="بدون فرع محدد" options={branches.map((b) => ({ value: b.id, label: b.label }))} value={branch} onChange={(e) => setBranch(e.target.value)} />
        ) : (
          <SelectField id="contact-type" label="نوع الاستفسار" icon={Store} options={inquiryTypes} value={inquiry} onChange={(e) => setInquiry(e.target.value)} />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-label-m font-medium text-ink">
          رسالتك
        </label>
        <div
          className={cn(
            "flex flex-col rounded-xl border bg-surface p-4 focus-within:border-brand focus-within:shadow-[0_0_0_1px_var(--color-brand),0_0_0_5px_rgb(22_56_40/0.12)]",
            errors.message ? "border-error" : "border-line-strong",
          )}
        >
          <textarea
            id="contact-message"
            rows={4}
            maxLength={MAX}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clear("message");
            }}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby="contact-message-count"
            className="min-h-24 resize-y bg-transparent text-body-m text-ink outline-none"
          />
          <p id="contact-message-count" className="text-caption text-faint" aria-live="polite">
            {message.length} / {MAX}
          </p>
        </div>
        {errors.message && <p className="text-caption text-error">{errors.message}</p>}
      </div>

      {full && (
        <>
          <label className={cn("flex cursor-pointer items-center gap-3 rounded-[14px] border border-dashed p-4 transition-colors hover:border-brand", errors.file ? "border-error" : "border-line-strong")}>
            <Paperclip size={20} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
            <span className="flex min-w-0 flex-1 flex-col items-start">
              <span className="text-label-m font-medium text-ink">{file ? file.name : "إرفاق ملف (اختياري)"}</span>
              <span className={cn("text-caption", errors.file ? "text-error" : "text-faint")}>
                {errors.file ?? (file ? `${(file.size / 1024 / 1024).toFixed(1)} ميغابايت` : "صورة الفاتورة أو أي مستند · حتى 10 ميغابايت")}
              </span>
            </span>
            {file && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                }}
                aria-label="إزالة الملف"
                className="flex size-8 items-center justify-center rounded-full hover:bg-subtle"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                if (f && f.size > MAX_FILE) {
                  setErrors((x) => ({ ...x, file: "الملف أكبر من 10 ميغابايت، اختر ملفاً أصغر." }));
                  setFile(null);
                } else {
                  setFile(f);
                  clear("file");
                }
                e.target.value = "";
              }}
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <Checkbox
              id="contact-consent"
              label="أوافق على سياسة الخصوصية واستخدام بياناتي للرد على رسالتي"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                clear("consent");
              }}
            />
            {errors.consent && <p className="text-caption text-error">{errors.consent}</p>}
          </div>
        </>
      )}

      <Button type="submit" variant="primary" arrow className="self-start">
        إرسال الرسالة
      </Button>
    </form>
  );
}
