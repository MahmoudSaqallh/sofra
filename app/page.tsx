import { Hero } from "@/components/home/hero";
import { OrderModeBar } from "@/components/home/order-mode-bar";
import { FeaturesStrip } from "@/components/home/features-strip";
import { MenuHighlights } from "@/components/home/menu-highlights";
import { MealTimes } from "@/components/home/meal-times";
import { OurStory } from "@/components/home/our-story";
import { OfferBanner } from "@/components/home/offer-banner";
import { Reservation } from "@/components/home/reservation";
import { Testimonials } from "@/components/home/testimonials";
import { AppDownload } from "@/components/home/app-download";

// Section order follows "Web / Desktop / 01 — الرئيسية Home". Mobile-only blocks
// (order switcher) and desktop-only blocks hide themselves per the 390 frame.
export default function HomePage() {
  return (
    <>
      <Hero />
      <OrderModeBar />
      <FeaturesStrip />
      <MenuHighlights />
      <MealTimes />
      <OurStory />
      <OfferBanner />
      <Reservation />
      <Testimonials />
      <AppDownload />
    </>
  );
}
