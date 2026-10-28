import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Search, Utensils, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Props = {
  /** Show the "4 · plate · 4" mark (404 page); otherwise the plate stands alone (empty search results). */
  code?: boolean;
  badge: string;
  title: string;
  text: ReactNode;
  /** Prefills the search pill (submits to /menu?q=). */
  query?: string;
  /** Primary + outline buttons, RTL order (first sits on the right). */
  actions: ReactNode;
  linksLabel: string;
  links: { label: string; href: string; icon: LucideIcon }[];
  headingLevel?: "h1" | "h2";
  className?: string;
};

/**
 * Figma "Error hero" (67:3848): gold-rimmed plate (public/images/error-plate*), badge, Display/M title,
 * search pill, two buttons and quick links. Used by the 404 page and by the menu's "no results" state.
 */
export function ErrorHero({ code, badge, title, text, query, actions, linksLabel, links, headingLevel = "h1", className }: Props) {
  const Heading = headingLevel;
  return (
    <div className={cn("flex flex-col items-center gap-6 px-5 text-center md:gap-7", className)}>
      <div aria-hidden className="flex items-center gap-4 md:gap-6">
        {code && <span className="font-display text-[56px] leading-[1.5] font-bold text-brand md:text-[72px]">4</span>}
        <div className="relative size-[150px] drop-shadow-[0_16px_20px_rgba(61,51,31,0.18)] md:size-[200px]">
          <Image src="/images/error-plate-ring.svg" alt="" width={200} height={200} className="absolute inset-0 size-full" />
          <Image
            src="/images/error-plate.png"
            alt=""
            width={160}
            height={160}
            className="absolute inset-[10%] size-[80%]"
          />
          <span className="absolute top-0 left-[74%] flex size-10 items-center justify-center rounded-full bg-accent text-brand md:size-[52px]">
            <Utensils size={24} strokeWidth={1.75} className="size-5 md:size-6" />
          </span>
        </div>
        {code && <span className="font-display text-[56px] leading-[1.5] font-bold text-brand md:text-[72px]">4</span>}
      </div>

      <Badge label={badge} tone="gold" />
      <Heading className="font-display text-h1 font-bold text-brand md:text-display-m">{title}</Heading>
      <p className="max-w-[560px] text-body-m text-muted md:text-body-l">{text}</p>

      <form
        action="/menu"
        method="get"
        role="search"
        className="flex h-14 w-full max-w-[520px] items-center gap-2.5 rounded-full border border-line bg-surface ps-5 pe-2 shadow-sm focus-within:border-brand"
      >
        <label htmlFor="error-search" className="sr-only">
          ابحث عن طبق
        </label>
        <input
          id="error-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="ابحث عن طبق أو صفحة…"
          className="h-full min-w-0 flex-1 bg-transparent text-body-m text-ink outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          aria-label="بحث"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-canvas transition-colors hover:bg-inverse"
        >
          <Search size={18} strokeWidth={1.75} />
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>

      <nav aria-label={linksLabel} className="flex flex-wrap items-center justify-center gap-2.5">
        <span className="text-label-m font-medium text-muted">{linksLabel}</span>
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1.5 rounded-full bg-subtle px-3.5 py-2 text-label-s font-medium text-brand transition-colors hover:bg-accent-subtle"
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
