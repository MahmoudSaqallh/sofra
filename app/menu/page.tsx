import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";

export const metadata: Metadata = {
  title: "قائمة الطعام",
  description: "أكثر من 180 طبقاً من الفطور حتى العشاء — اطلب للتوصيل أو الاستلام من أقرب فرع.",
};

export default function MenuPage() {
  return (
    <>
      {/* Filters live in the URL (useSearchParams), so the browser renders inside Suspense. */}
      <Suspense fallback={<MenuSkeleton />}>
        <MenuBrowser />
      </Suspense>
      <MobileCartBar />
    </>
  );
}

function MenuSkeleton() {
  return (
    <div aria-hidden>
      <div className="bg-inverse">
        <div className="shell flex flex-col gap-4 pt-6 pb-5 md:pt-14 md:pb-14 lg:pt-36 lg:pb-[72px]">
          <div className="h-16 w-64 animate-pulse rounded-xl bg-white/10 md:h-20" />
          <div className="flex gap-2.5">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-11 w-24 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
      <div className="shell grid gap-6 py-12 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-[20px] bg-subtle" />
        ))}
      </div>
    </div>
  );
}
