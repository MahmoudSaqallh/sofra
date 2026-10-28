"use client";

import { useEffect, useState } from "react";
import { Check, Tag } from "lucide-react";
import { notify } from "@/lib/notifications";
import { cn } from "@/lib/cn";

// Dashed promo-code chip from Figma; clicking copies the code.
export function CopyCode({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      notify({ tone: "info", title: "تم نسخ الرمز", description: `${code} — الصقه في السلة عند الدفع` });
    } catch {
      // Clipboard can be blocked (permissions/insecure context); the code stays visible to copy manually.
      notify({ tone: "error", title: "تعذّر النسخ", description: `انسخ الرمز يدوياً: ${code}` });
    }
  }

  const Icon = copied ? Check : Tag;

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-accent-line px-4 py-2.5 transition-colors hover:bg-white/5",
        className,
      )}
    >
      <Icon size={18} strokeWidth={1.75} className="text-accent-light" aria-hidden />
      <span className="text-body-s text-canvas">{copied ? "تم نسخ الرمز" : "استخدم الرمز"}</span>
      <span dir="ltr" className="text-label-l font-medium text-accent-light">
        {code}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "تم نسخ الرمز" : ""}
      </span>
    </button>
  );
}
