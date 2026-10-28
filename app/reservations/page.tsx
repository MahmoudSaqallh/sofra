import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Booking } from "@/components/reservations/booking";

export const metadata: Metadata = {
  title: "الحجوزات",
  description: "احجز طاولتك في سُفرة — طاولات عائلية، تراس خارجي، وغرف خاصة للمناسبات حتى 24 ضيفاً.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        crumb="الحجوزات"
        title="احجز تجربتك في سُفرة"
        lead="طاولات عائلية، تراس خارجي، وغرف خاصة للمناسبات حتى 24 ضيفاً."
        image="/images/interior.png"
        imageAlt="صالة طعام سُفرة بفوانيس نحاسية وأقواس"
      />
      <Suspense fallback={<div aria-hidden className="shell h-[900px] py-14" />}>
        <Booking />
      </Suspense>
    </>
  );
}
