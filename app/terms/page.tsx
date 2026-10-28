import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { DELIVERY_FEE, FREE_DELIVERY_FROM, VAT_RATE } from "@/lib/cart";
import { POINTS_REDEEM } from "@/lib/account";

export const metadata: Metadata = { title: "الشروط والأحكام" };

export default function TermsPage() {
  return (
    <LegalPage
      title="الشروط والأحكام"
      updated="أكتوبر 2026"
      sections={[
        {
          heading: "الطلبات والتوصيل",
          body: (
            <>
              <p>
                الأسعار بالريال السعودي، وتُضاف ضريبة القيمة المضافة {VAT_RATE * 100}٪ إلى الإجمالي بعد الخصم ورسوم التوصيل.
              </p>
              <p>
                التوصيل مجاني للطلبات من {FREE_DELIVERY_FROM} ر.س ضمن نطاق 7 كم من الفرع، وتُضاف رسوم {DELIVERY_FEE} ر.س للطلبات
                الأقل.
              </p>
              <p>يمكن إلغاء الطلب من صفحة التتبّع قبل خروجه للتوصيل أو قبل جاهزيته للاستلام.</p>
            </>
          ),
        },
        {
          heading: "العروض ورموز الخصم",
          body: (
            <p>
              يُطبَّق رمز خصم واحد لكل طلب، ويسري كل عرض خلال المدة والشروط الموضحة على بطاقته في صفحة العروض.
            </p>
          ),
        },
        {
          heading: "برنامج الولاء",
          body: (
            <p>
              تُحتسب النقاط على قيمة الطلب حسب مستوى عضويتك (برونزي: نقطة لكل 10 ر.س). كل {POINTS_REDEEM.points} نقطة تساوي{" "}
              {POINTS_REDEEM.value} ر.س أو طبقاً مجانياً.
            </p>
          ),
        },
        {
          heading: "الحجوزات والمناسبات",
          body: (
            <p>
              الغرف الخاصة تتسع حتى 24 ضيفاً برسوم إضافية 150 ر.س. أسعار باقات الضيافة للشخص الواحد وتشمل التقديم والأواني، ويُرسل
              العرض النهائي خلال 24 ساعة من الطلب.
            </p>
          ),
        },
      ]}
    />
  );
}
