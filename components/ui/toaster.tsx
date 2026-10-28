"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster as Sonner } from "sonner";
import { setNavigator } from "@/lib/notifications";

/** Sonner toasts themed with the Sufra tokens (canvas card, forest action, gold accents), RTL. */
export function Toaster() {
  const router = useRouter();

  useEffect(() => {
    setNavigator((href) => router.push(href));
  }, [router]);

  return (
    <Sonner
      dir="rtl"
      position="bottom-left"
      offset={24}
      mobileOffset={{ bottom: 96, left: 16, right: 16 }}
      visibleToasts={3}
      duration={4500}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "font-sans! rounded-2xl! border-line! bg-surface! text-ink! shadow-lg! gap-3! p-3.5! ps-4!",
          title: "text-label-m! font-medium! text-ink!",
          description: "text-caption! text-muted!",
          icon: "size-auto! me-0.5!",
          success: "[&_[data-icon]]:text-success!",
          info: "[&_[data-icon]]:text-accent-ink!",
          error: "border-error/40! [&_[data-icon]]:text-error!",
          actionButton: "rounded-full! bg-brand! text-canvas! h-8! px-3.5! text-label-s! font-medium! hover:bg-inverse!",
          closeButton: "border-line! bg-surface! text-muted! hover:text-ink!",
        },
      }}
    />
  );
}
