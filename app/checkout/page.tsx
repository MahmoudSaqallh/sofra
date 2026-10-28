import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/checkout-view";

export const metadata: Metadata = { title: "الدفع والتوصيل" };

export default function CheckoutPage() {
  return <CheckoutView />;
}
