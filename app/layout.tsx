import type { Metadata, Viewport } from "next";
import { El_Messiri, Readex_Pro } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteChrome } from "@/components/layout/site-chrome";
import { Toaster } from "@/components/ui/toaster";
import { RouteProgress } from "@/components/layout/route-progress";
import { Suspense } from "react";
import "./globals.css";

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "مطعم سُفرة — مطبخ عربي معاصر",
    template: "%s | مطعم سُفرة",
  },
  description:
    "مطعم عربي معاصر يقدّم الفطور والغداء والعشاء بلمسة ضيافة فاخرة منذ 2012. اطلب أونلاين أو احجز طاولتك في أحد فروعنا.",
};

export const viewport: Viewport = {
  themeColor: "#163828",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${readexPro.variable} ${elMessiri.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-canvas"
        >
          تخطَّ إلى المحتوى
        </a>
        <SiteChrome>
          <SiteHeader />
        </SiteChrome>
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteChrome>
          <SiteFooter />
        </SiteChrome>
        <Toaster />
        <Suspense>
          <RouteProgress />
        </Suspense>
      </body>
    </html>
  );
}
