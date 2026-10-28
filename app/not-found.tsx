import { CalendarDays, Home, Phone, Store, Tag, Utensils } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ErrorHero } from "@/components/ui/error-hero";

// Figma "Error hero" (67:3848) — 404 page.
export default function NotFound() {
  return (
    <ErrorHero
      code
      className="pt-16 pb-20 md:pt-24 md:pb-[72px]"
      badge="خطأ 404 · الصفحة غير موجودة"
      title="يبدو أن هذا الطبق ليس في قائمتنا!"
      text="ربما تغيّر الرابط أو أزيلت الصفحة. لا تقلق — أطباقنا المفضلة ما زالت بانتظارك."
      actions={
        <>
          <ButtonLink href="/">
            <Home size={20} strokeWidth={1.75} aria-hidden />
            العودة للرئيسية
          </ButtonLink>
          <ButtonLink href="/menu" variant="outline">
            <Utensils size={20} strokeWidth={1.75} aria-hidden />
            تصفّح القائمة
          </ButtonLink>
        </>
      }
      linksLabel="أو انتقل إلى:"
      links={[
        { label: "الحجوزات", href: "/reservations", icon: CalendarDays },
        { label: "الفروع", href: "/branches", icon: Store },
        { label: "العروض", href: "/offers", icon: Tag },
        { label: "تواصل معنا", href: "/contact", icon: Phone },
      ]}
    />
  );
}
