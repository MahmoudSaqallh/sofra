import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackingSkeleton, TrackingView } from "@/components/orders/tracking-view";

export const metadata: Metadata = { title: "تتبّع الطلب" };

export default function TrackingPage() {
  return (
    <Suspense fallback={<TrackingSkeleton />}>
      <TrackingView />
    </Suspense>
  );
}
