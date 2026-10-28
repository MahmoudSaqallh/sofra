import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: ReactNode;
  lead?: ReactNode;
  crumb: string;
  image: string;
  imageAlt: string;
  /** Desktop height from the Figma frame (400–540). */
  height?: "md" | "lg";
  children?: ReactNode;
};

/**
 * Figma "Page hero": full-bleed photo, horizontal fade toward the text side,
 * the transparent nav overlays it on desktop (see SiteHeader).
 */
export function PageHero({ title, lead, crumb, image, imageAlt, height = "md", children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-inverse">
      <Image src={image} alt={imageAlt} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-[rgb(11_32_25/0.25)] to-[rgb(11_32_25/0.92)] lg:bg-linear-to-r lg:from-[rgb(11_32_25/0.3)] lg:to-[rgb(11_32_25/0.92)]"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 hidden h-40 bg-linear-to-b from-[rgb(11_32_25/0.6)] to-transparent lg:block" />
      <div
        className={cn(
          "shell flex flex-col justify-end gap-3.5 pt-24 pb-10 text-canvas lg:justify-start lg:pt-[150px] xl:px-[120px]",
          height === "md" ? "min-h-[320px] lg:min-h-[400px]" : "min-h-[380px] lg:min-h-[520px]",
        )}
      >
        <nav aria-label="مسار التنقل" className="hidden md:block">
          <ol className="flex items-center gap-2 text-label-s font-medium">
            <li>
              <Link href="/" className="text-canvas hover:text-accent-light">
                الرئيسية
              </Link>
            </li>
            <li aria-hidden className="text-accent-light">
              <ChevronLeft size={14} strokeWidth={1.75} />
            </li>
            <li aria-current="page" className="text-accent-light">
              {crumb}
            </li>
          </ol>
        </nav>
        <h1 className="max-w-[700px] font-display text-display-m font-bold lg:text-display-l">{title}</h1>
        {lead && <p className="max-w-[620px] text-body-m opacity-95 md:text-body-l">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
