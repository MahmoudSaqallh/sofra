import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites/favorites-view";
import { MobileCartBar } from "@/components/cart/mobile-cart-bar";

export const metadata: Metadata = {
  title: "المفضلة",
  description: "أطباقك المحفوظة في سُفرة — اطلبها متى اشتهيتها.",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <>
      <FavoritesView />
      <MobileCartBar />
    </>
  );
}
