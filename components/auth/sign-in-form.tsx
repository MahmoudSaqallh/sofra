"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { ArrowRight, ChevronDown, Gift, Phone, Star, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TextField } from "@/components/ui/field";
import { displayPhone, sessionStore } from "@/lib/session";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/cn";

type Mode = "sign-in" | "sign-up";

// Figma shows +966 with a chevron; the other Gulf codes are an assumption for the dropdown.
const dialCodes = [
  { code: "+966", flag: "🇸🇦", country: "السعودية" },
  { code: "+971", flag: "🇦🇪", country: "الإمارات" },
  { code: "+965", flag: "🇰🇼", country: "الكويت" },
  { code: "+973", flag: "🇧🇭", country: "البحرين" },
  { code: "+974", flag: "🇶🇦", country: "قطر" },
  { code: "+968", flag: "🇴🇲", country: "عُمان" },
];

const RESEND_SECONDS = 60;
const SIMULATED_REQUEST_MS = 900;

/** Only same-site paths are accepted as the post-login destination. */
function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export function SignInForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [dialCode, setDialCode] = useState("+966");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [socialNote, setSocialNote] = useState("");
  const [sending, setSending] = useState(false);

  const national = phone.replace(/\D/g, "").replace(/^0+/, "");

  function sendCode(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (mode === "sign-up" && name.trim().length < 2) errs.name = "اكتب اسمك كما تحب أن نناديك.";
    const valid = dialCode === "+966" ? /^5\d{8}$/.test(national) : /^\d{7,9}$/.test(national);
    if (!valid) errs.phone = dialCode === "+966" ? "أدخل رقم جوال سعودي من 9 أرقام يبدأ بـ 5." : "تأكد من رقم الجوال.";
    setErrors(errs);
    if (errs.name) return document.getElementById("signup-name")?.focus();
    if (errs.phone) return document.getElementById("signin-phone")?.focus();
    // No SMS backend yet: a short simulated request so the loading state is real-feeling and testable.
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStep("otp");
    }, SIMULATED_REQUEST_MS);
  }

  if (step === "otp") {
    return (
      <OtpStep
        phoneLabel={displayPhone({ dialCode, phone: national })}
        onBack={() => setStep("phone")}
        onVerified={() => {
          sessionStore.signIn(
            mode === "sign-up" ? { phone: national, dialCode, name: name.trim(), isNew: true } : { phone: national, dialCode },
          );
          notify(
            mode === "sign-up"
              ? { title: `مرحباً بك في سُفرة، ${name.trim().split(/\s+/)[0]}!`, description: "تم إنشاء حسابك بنجاح" }
              : { title: "تم تسجيل الدخول", description: "أهلاً بك من جديد 👋" },
          );
          router.push(next);
        }}
      />
    );
  }

  return (
    <>
      <MobileBar onBack={() => router.back()} />
      <form onSubmit={sendCode} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:gap-6">
          <h1 className="font-display text-h1 font-bold text-brand md:text-display-m">
            {mode === "sign-in" ? "أهلاً بك من جديد 👋" : "انضم إلى سُفرة"}
          </h1>
          <p className="text-body-m text-muted md:text-body-l">
            {mode === "sign-in"
              ? "سجّل دخولك برقم جوالك لتتبع طلباتك وجمع نقاط الولاء."
              : "سجّل مرة واحدة واستمتع بتجربة أسرع وأذكى في كل طلب وكل زيارة."}
          </p>
        </div>

        <SegmentedControl
          label="نوع الحساب"
          fullWidth
          options={[
            { value: "sign-in", label: "تسجيل الدخول" },
            { value: "sign-up", label: "حساب جديد" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setErrors({});
          }}
        />

        {mode === "sign-up" && (
          <TextField
            id="signup-name"
            label="الاسم"
            icon={User}
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
            }}
            error={errors.name}
          />
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="signin-phone" className="text-label-m font-medium text-ink">
            رقم الجوال
          </label>
          <div
            className={cn(
              "flex h-14 items-stretch overflow-hidden rounded-[14px] border bg-surface transition-shadow",
              errors.phone
                ? "border-error"
                : "border-line-strong focus-within:border-2 focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgb(22_56_40/0.12)]",
            )}
          >
            <div className="relative flex flex-1 items-center">
              <Phone size={18} strokeWidth={1.75} aria-hidden className="pointer-events-none absolute right-4 text-muted" />
              <input
                id="signin-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                dir="ltr"
                placeholder="5X XXX XXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((x) => ({ ...x, phone: undefined }));
                }}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby="signin-phone-hint"
                className="h-full w-full min-w-0 bg-transparent pr-11 pl-4 text-right text-body-l text-ink outline-none placeholder:text-faint"
              />
            </div>
            <div className="relative flex shrink-0 items-center bg-subtle">
              <select
                aria-label="رمز الدولة"
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                className="h-full cursor-pointer appearance-none bg-transparent pr-3.5 pl-8 text-label-m font-medium text-ink outline-none"
              >
                {dialCodes.map((d) => (
                  <option key={d.code} value={d.code} aria-label={`${d.country} ${d.code}`}>
                    {d.flag} {d.code}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} strokeWidth={1.75} aria-hidden className="pointer-events-none absolute left-3 text-muted" />
            </div>
          </div>
          <p id="signin-phone-hint" className={cn("text-caption", errors.phone ? "text-error" : "text-muted")}>
            {errors.phone ?? "سنرسل رمز تحقق من 4 أرقام عبر رسالة نصية"}
          </p>
        </div>

        <Button type="submit" fullWidth arrow loading={sending} loadingLabel="جارٍ إرسال الرمز…">
          إرسال رمز التحقق
        </Button>

        <div className="flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-track" />
          <p className="text-caption text-faint">أو تابع باستخدام</p>
          <span aria-hidden className="h-px flex-1 bg-track" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSocialNote("Apple")}
              className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-inverse text-label-m font-medium text-canvas transition-colors hover:bg-brand"
            >
              <span aria-hidden className="font-display text-h4 font-semibold">●</span>
              المتابعة مع Apple
            </button>
            <button
              type="button"
              onClick={() => setSocialNote("Google")}
              className="flex h-[52px] items-center justify-center gap-2 rounded-full border border-line-strong bg-surface text-label-m font-medium text-ink transition-colors hover:border-brand"
            >
              <span aria-hidden className="font-display text-h4 font-semibold text-brand">G</span>
              المتابعة مع Google
            </button>
          </div>
          <p role="status" className="text-center text-caption text-muted">
            {socialNote && `الدخول عبر ${socialNote} غير مفعّل في هذه النسخة بعد — استخدم رقم جوالك.`}
          </p>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-body-s text-muted">
          تفضّل الطلب بدون حساب؟
          <Link href="/order" className="text-label-m font-medium text-brand hover:underline">
            المتابعة كضيف
          </Link>
        </p>
      </form>
      <MemberPerks />
    </>
  );
}

function OtpStep({ phoneLabel, onBack, onVerified }: { phoneLabel: string; onBack: () => void; onVerified: () => void }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  function setAt(i: number, value: string) {
    const d = value.replace(/\D/g, "").slice(-1);
    setDigits((xs) => xs.map((x, j) => (j === i ? d : x)));
    setError("");
    if (d && i < 3) refs.current[i + 1]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    // Boxes run left-to-right (dir="ltr"), like the numbers they hold.
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 3) refs.current[i + 1]?.focus();
  }

  function onPaste(e: ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: 4 }, (_, i) => pasted[i] ?? ""));
    refs.current[Math.min(pasted.length, 3)]?.focus();
  }

  function verify(e: FormEvent) {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      setError("أدخل الأرقام الأربعة كاملة.");
      refs.current[digits.findIndex((d) => !d)]?.focus();
      return;
    }
    setVerifying(true);
    window.setTimeout(onVerified, SIMULATED_REQUEST_MS);
  }

  const firstEmpty = digits.findIndex((d) => !d);

  return (
    <>
      <MobileBar onBack={onBack} />
      <form onSubmit={verify} noValidate className="flex flex-col gap-6">
        <span className="flex size-[88px] items-center justify-center rounded-[28px] bg-brand-subtle text-brand">
          <Phone size={40} strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="font-display text-h1 font-bold text-brand md:text-display-m">أدخل رمز التحقق</h1>
        <p className="text-body-m text-muted">
          أرسلنا رمزاً من 4 أرقام إلى الرقم <span dir="ltr">{phoneLabel}</span>
        </p>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">رمز التحقق</legend>
          <div dir="ltr" className="flex justify-center gap-3" onPaste={onPaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={d}
                onChange={(e) => setAt(i, e.target.value)}
                onKeyDown={(e) => onKeyDown(e, i)}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                disabled={verifying}
                aria-label={`الرقم ${i + 1} من 4`}
                aria-invalid={error && !d ? true : undefined}
                className={cn(
                  "size-[72px] rounded-[18px] border bg-surface text-center font-display text-display-m font-bold text-brand caret-brand outline-none transition-shadow",
                  "focus:border-2 focus:border-brand focus:shadow-[0_0_0_4px_rgb(22_56_40/0.12)]",
                  error && !d ? "border-error" : "border-line-strong",
                  i === firstEmpty && "border-brand",
                )}
              />
            ))}
          </div>
          <p className="text-center text-caption" aria-live="polite">
            {error ? (
              <span className="text-error">{error}</span>
            ) : (
              <span className="text-faint">نسخة تجريبية: أي 4 أرقام تُقبل.</span>
            )}
          </p>
        </fieldset>

        <p className="flex items-center justify-center gap-1.5 text-body-s text-muted" aria-live="polite">
          {resent ? "أعدنا إرسال الرمز." : "لم يصلك الرمز؟"}
          {left > 0 ? (
            <span className="text-label-s font-medium text-faint">
              إعادة الإرسال بعد <span dir="ltr">0:{String(left).padStart(2, "0")}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLeft(RESEND_SECONDS);
                setResent(true);
              }}
              className="text-label-m font-medium text-brand hover:underline"
            >
              إعادة الإرسال
            </button>
          )}
        </p>

        <Button type="submit" fullWidth arrow loading={verifying} loadingLabel="جارٍ التحقق…">
          تحقق ومتابعة
        </Button>
        <button type="button" onClick={onBack} className="self-center text-label-m font-medium text-brand hover:underline">
          تغيير رقم الجوال
        </button>
      </form>
      <MemberPerks />
    </>
  );
}

/** Figma 390 frame top bar: back button on the right, centered logo. Desktop uses the panel header instead. */
function MobileBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="-mx-5 -mt-6 mb-2 flex h-16 items-center justify-between px-5 md:hidden">
      <button
        type="button"
        onClick={onBack}
        aria-label="رجوع"
        className="flex size-10 items-center justify-center rounded-full border border-line text-ink"
      >
        <ArrowRight size={20} strokeWidth={1.75} />
      </button>
      <Logo size="sm" eager />
      <span aria-hidden className="size-10" />
    </div>
  );
}

/** "مزايا الأعضاء" card from the 390 OTP frame (the slider carries these perks on desktop). */
function MemberPerks() {
  const perks = [
    { icon: Gift, label: "طبق مجاني كل 10 طلبات" },
    { icon: Truck, label: "تتبع مباشر لطلباتك" },
    { icon: Star, label: "عروض حصرية للأعضاء" },
  ];
  return (
    <div className="mt-8 flex flex-col gap-2.5 rounded-[20px] bg-accent-subtle p-[18px] lg:hidden">
      <p className="text-label-l font-medium text-brand">مزايا الأعضاء</p>
      <ul className="flex flex-col gap-2.5">
        {perks.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-body-s text-ink">
            <Icon size={16} strokeWidth={1.75} aria-hidden className="text-accent-ink" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

