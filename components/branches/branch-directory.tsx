"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, MapPin, Minus, Phone, Plus, Search, SearchX, Store } from "lucide-react";
import { branchList, branchStatus, cities, type Branch } from "@/lib/branches";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/cn";

const directionsUrl = (b: Branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`سفرة ${b.name} ${b.address}`)}`;

export function BranchDirectory() {
  const now = useNow();
  const [city, setCity] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(branchList[0].id);
  const [zoom, setZoom] = useState(1);

  const list = useMemo(() => {
    const q = query.trim();
    return branchList.filter(
      (b) => (city === "all" || b.city === city) && (!q || b.name.includes(q) || b.address.includes(q) || b.city.includes(q)),
    );
  }, [city, query]);
  const active = list.find((b) => b.id === selected) ?? list[0];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-surface px-[18px] focus-within:border-brand md:w-[380px]">
          <Search size={18} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
          <span className="sr-only">ابحث عن فرع</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالحي أو المدينة"
            className="min-w-0 flex-1 bg-transparent text-body-s text-ink outline-none placeholder:text-faint"
          />
        </label>
        <div role="radiogroup" aria-label="المدينة" className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:px-0">
          {[{ value: "all", label: "جميع المدن" }, ...cities.map((c) => ({ value: c, label: c }))].map((c) => {
            const on = city === c.value;
            return (
              <button
                key={c.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setCity(c.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-label-m font-medium whitespace-nowrap transition-colors",
                  on ? "bg-brand text-canvas" : "border border-line bg-surface text-ink hover:border-brand",
                )}
              >
                <MapPin size={18} strokeWidth={1.75} aria-hidden />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* List */}
        <ul className="flex flex-col gap-4 lg:w-[500px] lg:shrink-0">
          {list.length === 0 && (
            <li className="flex flex-col items-center gap-3 rounded-[20px] border border-dashed border-line-strong p-10 text-center">
              <SearchX size={28} strokeWidth={1.75} className="text-faint" aria-hidden />
              <p className="text-body-m text-muted">لا توجد فروع تطابق «{query}».</p>
            </li>
          )}
          {list.map((b) => {
            const status = now ? branchStatus(b, now) : null;
            const isActive = b.id === active?.id;
            return (
              <li key={b.id}>
                <article
                  onClick={() => setSelected(b.id)}
                  className={cn(
                    "flex cursor-pointer flex-col gap-3.5 rounded-[20px] bg-surface p-6 transition-shadow",
                    isActive ? "border-2 border-brand shadow-md" : "m-px border border-line hover:shadow-sm",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-h3 font-semibold text-brand">
                      <button type="button" onClick={() => setSelected(b.id)} aria-pressed={isActive} className="text-start">
                        {b.name}
                      </button>
                    </h3>
                    {status && (
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-s font-medium",
                          status.open ? "bg-success-subtle text-success" : "bg-error-subtle text-error",
                        )}
                      >
                        <span aria-hidden className="size-[7px] rounded-full bg-current" />
                        {status.label}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-2.5 text-body-s text-muted">
                    <MapPin size={16} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
                    {b.address}
                  </p>
                  <p className="flex items-center gap-2.5 text-body-s text-muted">
                    <Clock size={16} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
                    {b.hoursLabel}
                  </p>
                  <p className="flex items-center gap-2.5 text-body-s text-muted">
                    <Phone size={16} strokeWidth={1.75} className="shrink-0 text-accent-ink" aria-hidden />
                    <span dir="ltr">{b.phone}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Link
                      href={`/reservations?branch=${b.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 items-center rounded-full bg-brand px-4 text-label-s font-medium text-canvas hover:bg-inverse"
                    >
                      احجز طاولة
                    </Link>
                    <a
                      href={directionsUrl(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 items-center rounded-full border-[1.5px] border-brand px-4 text-label-s font-medium text-brand hover:bg-brand-subtle"
                    >
                      الاتجاهات
                    </a>
                    <a
                      href={`tel:${b.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-9 items-center rounded-full px-4 text-label-s font-medium text-brand hover:bg-subtle"
                    >
                      اتصال
                    </a>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Stylised map (Figma): street grid, branch pins, popup for the selected branch */}
        <div className="relative h-[420px] overflow-hidden rounded-3xl bg-track md:h-[560px] lg:sticky lg:top-28 lg:h-[860px] lg:flex-1" role="region" aria-label="خريطة الفروع">
          <div className="absolute inset-0 origin-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
            <div className="absolute inset-4 grid grid-cols-8 grid-rows-10 gap-4">
              {Array.from({ length: 80 }, (_, i) => (
                <div key={i} className={cn("rounded-lg", i % 7 === 0 || i % 11 === 3 ? "bg-brand-subtle" : "bg-subtle")} />
              ))}
            </div>
            <div className="absolute inset-x-0 top-[31%] h-[18px] bg-surface" />
            <div className="absolute inset-x-0 top-[71%] h-[18px] bg-surface" />
            <div className="absolute inset-y-0 left-[42.5%] w-[18px] bg-surface" />
            <div className="absolute inset-y-0 left-[75%] w-3.5 bg-surface" />
            {list.map((b) => {
              const on = b.id === active?.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelected(b.id)}
                  aria-label={b.name}
                  aria-pressed={on}
                  className={cn(
                    "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-lg transition-all",
                    on ? "z-10 size-14 border-accent-line bg-brand text-canvas" : "size-10 border-brand bg-surface text-brand",
                  )}
                  style={{ top: `${b.pin.top}%`, left: `${b.pin.left}%` }}
                >
                  <Store size={on ? 24 : 18} strokeWidth={1.75} />
                </button>
              );
            })}
          </div>
          {active && (
            <div
              className="absolute z-20 w-[240px] -translate-x-1/2 rounded-2xl bg-surface p-4 shadow-lg"
              style={{ top: `min(calc(${active.pin.top}% + 40px), calc(100% - 200px))`, left: `clamp(130px, ${active.pin.left}%, calc(100% - 130px))` }}
            >
              <div className="relative mb-2 h-[90px] overflow-hidden rounded-[10px]">
                <Image src={active.image} alt="" fill sizes="208px" className="object-cover" />
              </div>
              <p className="text-label-l font-medium text-brand">{active.name}</p>
              <p className="text-caption text-success">{active.tablesTonight} طاولة متاحة الليلة</p>
            </div>
          )}
          <div className="absolute top-5 left-5 flex flex-col overflow-hidden rounded-xl bg-surface shadow-md">
            <button type="button" onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))} aria-label="تكبير الخريطة" className="flex size-11 items-center justify-center hover:bg-subtle">
              <Plus size={18} strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(1, z - 0.2))} aria-label="تصغير الخريطة" className="flex size-11 items-center justify-center hover:bg-subtle">
              <Minus size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
