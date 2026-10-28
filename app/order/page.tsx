import type { Metadata } from "next";
import { OrderOnline } from "@/components/order/order-online";

export const metadata: Metadata = {
  title: "اطلب أونلاين",
  description: "اطلب من سُفرة للتوصيل أو الاستلام من أقرب فرع — طازج من مطبخنا إلى بابك.",
};

export default function OrderPage() {
  return <OrderOnline />;
}
