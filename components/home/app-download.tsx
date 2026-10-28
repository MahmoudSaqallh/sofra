import Image from "next/image";
import { Download } from "lucide-react";

const stores = [
  { caption: "حمّل من", name: "App Store", href: "https://apps.apple.com" },
  { caption: "احصل عليه من", name: "Google Play", href: "https://play.google.com" },
];

// Not part of the 390 mobile frame, so it starts at tablet width.
export function AppDownload() {
  return (
    <section aria-labelledby="app-title" className="shell hidden pb-28 md:block">
      <div className="flex flex-col overflow-hidden rounded-[32px] border border-accent-line bg-accent-subtle lg:h-[360px] lg:flex-row-reverse lg:items-center lg:justify-between lg:ps-14">
        <div className="relative h-[280px] w-full shrink-0 lg:h-full lg:w-[560px] lg:max-w-[48%]">
          <Image
            src="/images/drinks.png"
            alt="مشروبات باردة على طاولة في مقهى سُفرة"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-5 p-10 lg:max-w-[520px] lg:p-0">
          <p className="text-overline font-medium text-accent-ink">تطبيق سُفرة</p>
          <h2 id="app-title" className="font-display text-h1 font-semibold text-brand">
            اطلب أسرع، واجمع نقاط الولاء مع كل طلب
          </h2>
          <p className="max-w-[480px] text-body-m text-muted">
            تتبع طلبك لحظة بلحظة، واحفظ عناوينك وأطباقك المفضلة، واحصل على طبق مجاني كل 10 طلبات.
          </p>
          <ul className="flex flex-wrap items-center gap-3">
            {stores.map((store) => (
              <li key={store.name}>
                <a
                  href={store.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-[14px] bg-inverse px-5 py-2.5 transition-colors hover:bg-brand"
                >
                  <Download size={22} strokeWidth={1.75} className="text-canvas" aria-hidden />
                  <span className="flex flex-col items-start">
                    <span className="text-caption text-accent-light">{store.caption}</span>
                    <span lang="en" className="text-label-l font-medium text-canvas">
                      {store.name}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
