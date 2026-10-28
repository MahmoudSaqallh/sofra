"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { getDish } from "@/lib/menu";
import { toggleFavoriteAndNotify } from "@/lib/notify";
import { cn } from "@/lib/cn";

// Desktop: 640×560 main photo + 148×112 thumbnails. Mobile: full-bleed 360px photo with a canvas lip.
export function DishGallery({ slug, images, name }: { slug: string; images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const favorite = useFavorites().includes(slug);

  const heart = (
    <button
      type="button"
      onClick={() => {
        const dish = getDish(slug);
        if (dish) toggleFavoriteAndNotify(dish, favorite);
      }}
      aria-pressed={favorite}
      aria-label={favorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      className="flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-md transition-transform active:scale-90 md:size-12"
    >
      <Heart size={22} strokeWidth={1.75} className={cn(favorite && "fill-error text-error")} />
    </button>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-5 h-[360px] overflow-hidden md:mx-0 md:h-[460px] md:rounded-[28px] xl:h-[560px]">
        <Image
          src={images[active]}
          alt={name}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute top-[52px] right-5 md:hidden">
          <Link
            href="/menu"
            aria-label="العودة إلى القائمة"
            className="flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-md"
          >
            <ArrowRight size={20} strokeWidth={1.75} />
          </Link>
        </div>
        <div className="absolute top-[52px] left-5 md:top-5">{heart}</div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-7 rounded-t-[28px] bg-canvas md:hidden" />
      </div>

      {images.length > 1 && (
        <ul className="hidden gap-4 md:flex">
          {images.map((src, i) => (
            <li key={src} className="flex-1">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`عرض الصورة ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative block h-[112px] w-full overflow-hidden rounded-2xl transition-shadow",
                  i === active ? "ring-[2.5px] ring-brand ring-inset" : "hover:opacity-90",
                )}
              >
                <Image src={src} alt="" fill sizes="148px" className="-z-10 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
