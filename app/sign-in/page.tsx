import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LoginSlider } from "@/components/auth/login-slider";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل دخولك برقم جوالك لتتبع طلباتك وجمع نقاط الولاء.",
};

// Figma "Sign In" (49:2988): form panel on the right, Login Slider on the left. No site header/footer (see SiteChrome).
export default function SignInPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-between gap-10 px-5 pt-6 pb-8 md:px-10 md:py-12 xl:px-[120px]">
        <div className="hidden items-center justify-between md:flex">
          <Logo size="lg" eager />
          <Link href="/" className="flex items-center gap-1.5 text-label-s font-medium text-muted hover:text-brand">
            العودة للموقع
            <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>

        <div className="w-full max-w-[480px] md:mx-auto lg:mx-0">
          <Suspense
            fallback={
              <div aria-hidden className="flex flex-col gap-6">
                <div className="h-14 w-3/4 animate-pulse rounded-xl bg-subtle" />
                <div className="h-6 w-full animate-pulse rounded-lg bg-subtle" />
                <div className="h-12 w-full animate-pulse rounded-full bg-subtle" />
                <div className="h-14 w-full animate-pulse rounded-[14px] bg-subtle" />
                <div className="h-14 w-full animate-pulse rounded-full bg-track" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>

        <p className="max-w-[480px] text-caption text-faint md:mx-auto lg:mx-0">
          بالمتابعة، أنت توافق على الشروط والأحكام وسياسة الخصوصية لمطاعم سُفرة.
        </p>
      </div>

      <div className="sticky top-0 hidden h-dvh lg:block">
        <LoginSlider />
      </div>
    </div>
  );
}
