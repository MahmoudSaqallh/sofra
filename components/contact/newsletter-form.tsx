"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { cn } from "@/lib/cn";

// Figma "النشرة البريدية" pill input + forest button. No mailing service yet — confirms locally.
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("أدخل بريداً إلكترونياً صحيحاً.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-full bg-success-subtle px-5 py-3.5 text-label-m font-medium text-success">
        <Check size={18} strokeWidth={2} aria-hidden />
        تم الاشتراك! ستصلك عروضنا على {email}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label
          className={cn(
            "flex h-[52px] min-w-0 flex-1 items-center gap-2.5 rounded-full border bg-surface px-[18px] focus-within:border-brand",
            error ? "border-error" : "border-line",
          )}
        >
          <Mail size={18} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
          <span className="sr-only">بريدك الإلكتروني</span>
          <input
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            aria-invalid={error ? true : undefined}
            className="min-w-0 flex-1 bg-transparent text-right text-body-s text-ink outline-none placeholder:text-faint"
          />
        </label>
        <button type="submit" className="h-14 shrink-0 rounded-full bg-brand px-8 text-label-l font-medium text-canvas hover:bg-inverse">
          اشترك
        </button>
      </div>
      {error && <p className="px-4 text-caption text-error">{error}</p>}
    </form>
  );
}
