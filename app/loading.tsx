import Image from "next/image";

// Branded full-screen page loader (shown while a route streams in): covers the nav bar and footer,
// breathing gold logo + bouncing dots.
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-canvas px-5"
    >
      <div className="relative flex items-center justify-center">
        <span aria-hidden className="absolute size-36 rounded-full bg-accent-subtle blur-2xl" />
        <Image
          src="/logo.png"
          alt=""
          width={144}
          height={72}
          loading="eager"
          className="relative h-[72px] w-auto animate-loader-breathe"
        />
      </div>
      <div aria-hidden className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 animate-loader-dot rounded-full bg-brand"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-label-m font-medium text-muted">نحضّر لك الصفحة…</p>
    </div>
  );
}
